import React, { useEffect, useState } from 'react';
import { Group, Image as KonvaImage, Layer, Line, Ellipse, Stage } from 'react-konva';
import { useDebounceFn } from '@umijs/hooks';
import { MQTT } from 'center-src/utils/mqtt';
import imgMotor from 'center-src/assets/images/motor.png';
import imgNonMotor from 'center-src/assets/images/non_motor.png';
import imgPedestrian from 'center-src/assets/images/pedestrian.png';
import imgWarn from 'center-src/assets/images/event_warn.png';

type Point = { x: number; y: number };

const Track: React.FC<Point & { type: 'motor' | 'non-motor' | 'pedestrian'; rotation: number }> = ({
  type,
  x,
  y,
  rotation,
}) => {
  const imageMap = {
    motor: imgMotor,
    'non-motor': imgNonMotor,
    pedestrian: imgPedestrian,
  };
  const image = new Image();
  image.src = imageMap[type];
  const imageWidth = 20;

  const imageRotation = type === 'motor' ? rotation * 0.0125 : 0;

  return (
    <Group x={x} y={y} offset={{ x, y }} rotation={imageRotation}>
      <KonvaImage
        image={image}
        x={x - imageWidth}
        y={y - imageWidth}
        width={imageWidth * 2}
        height={imageWidth * 2}
      />
    </Group>
  );
};

const WarningImage: React.FC<Point> = ({ x, y }) => {
  const image = new Image();
  image.src = imgWarn;
  const iconWidth = 15;

  return (
    <KonvaImage
      image={image}
      x={x - iconWidth}
      y={y - iconWidth * 2.5}
      width={iconWidth * 2}
      height={iconWidth * 2}
    />
  );
};

const WarningEllipse: React.FC<any> = ({ x, y, ...props }) => (
  <Ellipse x={x} y={y} radiusX={26} radiusY={20} strokeWidth={2} {...props} />
);

const EventWarnLine: React.FC<{ firstPoint: [number, number]; secondPoint: [number, number] }> = ({
  firstPoint,
  secondPoint,
}) => {
  const props = { stroke: '#FFC12B', strokeWidth: 2 };
  const ellipseProps = { fill: 'rgba(255, 158, 23, 0.5)', ...props };
  return (
    <Group>
      <Line points={[...firstPoint, ...secondPoint]} dash={[10, 10]} {...props} />
      {[firstPoint, secondPoint].map(([x, y], index) => (
        <Group key={`${x}${y}${index}`}>
          <WarningEllipse x={x} y={y} {...ellipseProps} />
          <WarningImage x={x} y={y} />
        </Group>
      ))}
    </Group>
  );
};

const ChangeLanes: React.FC<{ egoPoint: Point; trajPoints: Point[] }> = ({
  egoPoint,
  trajPoints = [],
}) => {
  const points = trajPoints.reduce((data: number[], { x, y }) => [...data, x, y], []);
  const stroke = { darkGreen: '#00FF00' };
  const fill = { darkGreen: 'rgba(0, 128, 0, 0.6)' };
  return (
    <Group>
      <WarningEllipse
        x={egoPoint.x}
        y={egoPoint.y}
        stroke={stroke.darkGreen}
        fill={fill.darkGreen}
      />
      <Line points={points} dash={[10, 10]} stroke={stroke.darkGreen} strokeWidth={2} />
    </Group>
  );
};

const ReverseOvertaking: React.FC<{ egoPoint: Point; accept: boolean }> = ({
  egoPoint,
  accept,
}) => {
  const stroke = {
    green: '#47FF95',
    red: '#FF7777',
  };
  const fill = {
    green: 'rgba(71, 255, 149, 0.3)',
    red: 'rgba(255, 119, 119, 0.3)',
  };
  return (
    <WarningEllipse
      x={egoPoint.x}
      y={egoPoint.y}
      stroke={accept ? stroke.green : stroke.red}
      fill={accept ? fill.green : fill.red}
    />
  );
};

const DataSharing: React.FC<{ egoPoint: Point; points: Point[] }> = ({ egoPoint, points = [] }) => {
  const stroke = {
    purple: '#E178FF',
    blue: '#36DCFF',
  };
  const fill = {
    purple: 'rgba(225, 120, 255, 0.3)',
    blue: 'rgba(54, 220, 255, 0.3)',
  };
  return (
    <Group>
      <WarningEllipse x={egoPoint.x} y={egoPoint.y} stroke={stroke.purple} fill={fill.purple} />
      {points.map(({ x, y }: Point, index: number) => (
        <WarningEllipse
          key={`${x}${y}${index}`}
          x={x}
          y={y}
          stroke={stroke.blue}
          fill={fill.blue}
        />
      ))}
    </Group>
  );
};

const RoadImage: React.FC<{ esn: string; nodeId: string }> = ({ esn, nodeId }) => {
  // 参与者信息
  const [trackData, setTrackData] = useState<any[]>([]);
  const { run: clearTrackData } = useDebounceFn(() => {
    setTrackData([]);
  }, 1000);

  // 碰撞预警
  const [CWData, setCWData] = useState<any[]>([]);
  const { run: clearCWData } = useDebounceFn(() => {
    setCWData([]);
  }, 500);

  // 协同换道
  const [CLCData, setCLCData] = useState<any[]>([]);
  const { run: clearCLCData } = useDebounceFn(() => {
    setCLCData([]);
  }, 500);

  // 逆向超车
  const [DNPData, setDNPData] = useState<any[]>([]);
  const { run: clearDNPData } = useDebounceFn(() => {
    setDNPData([]);
  }, 500);

  // 数据共享
  const [SDSData, setSDSData] = useState<any[]>([]);
  const { run: clearSDSData } = useDebounceFn(() => {
    setSDSData([]);
  }, 500);

  useEffect(() => {
    const mqtt = new MQTT(process.env.MQTT_URL!);

    mqtt.connect({
      path: process.env.MQTT_PATH,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clientId: `v2x_mqtt_${new Date().getTime()}`,
      keepalive: 10,
      clean: true,
    });

    // 订阅主题-参与者信息
    mqtt.subscribe(`V2X/DEVICE/${esn}/PARTICIPANT/NODE${nodeId}`, 0);
    const messageCallback = (topic: string, payload: unknown) => {
      const data = JSON.parse(payload as string);
      setTrackData(data || []);
      clearTrackData();
    };
    mqtt.set_message_callback(`V2X/DEVICE/${esn}/PARTICIPANT/NODE${nodeId}`, messageCallback);

    // 订阅主题-碰撞预警
    mqtt.subscribe(`V2X/DEVICE/${esn}/APPLICATION/CW/NODE${nodeId}`, 0);
    const CWCallback = (topic: string, payload: unknown) => {
      const data = JSON.parse(payload as string);
      setCWData(data || []);
      clearCWData();
    };
    mqtt.set_message_callback(`V2X/DEVICE/${esn}/APPLICATION/CW/NODE${nodeId}`, CWCallback);

    // 订阅主题-协同换道
    mqtt.subscribe(`V2X/DEVICE/${esn}/APPLICATION/CLC/NODE${nodeId}`, 0);
    const CLCCallback = (topic: string, payload: unknown) => {
      const data = JSON.parse(payload as string);
      setCLCData(data || []);
      clearCLCData();
    };
    mqtt.set_message_callback(`V2X/DEVICE/${esn}/APPLICATION/CLC/NODE${nodeId}`, CLCCallback);

    // 订阅主题-逆向超车
    mqtt.subscribe(`V2X/DEVICE/${esn}/APPLICATION/DNP/NODE${nodeId}`, 0);
    const DNPCallback = (topic: string, payload: unknown) => {
      const data = JSON.parse(payload as string);
      setDNPData(data || []);
      clearDNPData();
    };
    mqtt.set_message_callback(`V2X/DEVICE/${esn}/APPLICATION/DNP/NODE${nodeId}`, DNPCallback);

    // 订阅主题-数据共享
    mqtt.subscribe(`V2X/DEVICE/${esn}/APPLICATION/SDS/NODE${nodeId}`, 0);
    const SDSCallback = (topic: string, payload: unknown) => {
      const data = JSON.parse(payload as string);
      setSDSData(data || []);
      clearSDSData();
    };
    mqtt.set_message_callback(`V2X/DEVICE/${esn}/APPLICATION/SDS/NODE${nodeId}`, SDSCallback);

    return () => mqtt.disconnect();
  }, []);

  return (
    <Stage width={1777} height={999}>
      <Layer>
        {CWData.map(({ ego, other, ego_current_point, other_current_point }) => (
          <EventWarnLine
            key={ego + other}
            firstPoint={ego_current_point}
            secondPoint={other_current_point}
          />
        ))}
        {CLCData.map(({ type, ego_point, traj_list_for_show: points }, index) => (
          <ChangeLanes key={`${type}${index}`} egoPoint={ego_point} trajPoints={points} />
        ))}
        {DNPData.map(({ type, ego_point, if_accept }, index) => (
          <ReverseOvertaking key={`${type}${index}`} egoPoint={ego_point} accept={if_accept} />
        ))}
        {SDSData.map(({ type, ego_point, other_cars }, index) => (
          <DataSharing key={`${type}${index}`} egoPoint={ego_point} points={other_cars} />
        ))}
        {trackData.map(({ ptcId, ptcType, x, y, heading }) => (
          <Track key={ptcId} type={ptcType} x={x} y={y} rotation={heading} />
        ))}
      </Layer>
    </Stage>
  );
};

export default RoadImage;
