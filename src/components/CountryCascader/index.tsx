import { useEffect, useState } from 'react';
import { ProFormCascader, ProFormSelect } from '@ant-design/pro-form';
import { countries, rsuDeviceList } from '@/services/api';
import type { DefaultOptionType } from 'antd/lib/select';

type CountryCascaderProps = {
  defaultValue: string[];
  mapChange: (data?: {
    type: 1 | 2;
    rsuId: number;
    rsuEsn: string;
    lngLat: [number, number] | [];
  }) => void;
};

type DeviceListType = {
  id: number;
  rsuName: string;
  rsuEsn: string;
  location: {
    lon: number;
    lat: number;
  };
};

type RSUSelectChangeType = {
  extra: {
    rsuEsn: string;
    lng: number;
    lat: number;
  };
};

const CountryCascader: React.FC<CountryCascaderProps> = ({ defaultValue, mapChange }) => {
  const [areaCode, setAreaCode] = useState<string>(defaultValue[defaultValue.length - 1]);
  const [deviceList, setDeviceList] = useState<DefaultOptionType[]>([]);
  const [rsuId, setRsuId] = useState<number | null>();

  const fetchDeviceList = async () => {
    const res = await rsuDeviceList(areaCode);
    const data = res?.data.map(
      ({ id, rsuName, rsuEsn, location: { lon: lng, lat } }: DeviceListType) => ({
        label: `${rsuName} (Esn：${rsuEsn})`,
        value: id,
        extra: { rsuEsn, lng, lat },
      }),
    );
    if (data?.length) {
      const [
        {
          value,
          extra: { rsuEsn, lng, lat },
        },
      ] = data;
      setRsuId(value);
      mapChange({
        type: 1,
        rsuId: value,
        rsuEsn: rsuEsn,
        lngLat: lng && lat ? [lng, lat] : [],
      });
    } else {
      setRsuId(null);
      mapChange(undefined);
    }
    setDeviceList(data);
  };

  useEffect(() => {
    fetchDeviceList();
  }, [areaCode]);

  return (
    <div className="f">
      <ProFormCascader
        fieldProps={{
          allowClear: false,
          fieldNames: { label: 'name', value: 'code' },
          defaultValue,
          onChange: ([, , , code]: (string | number)[]) => setAreaCode(code as string),
        }}
        request={async () => {
          const res = await countries();
          return res;
        }}
      />
      <div style={{ marginLeft: '20px' }}>
        <ProFormSelect
          fieldProps={{
            allowClear: false,
            value: rsuId,
            onChange: (value, option: unknown) => {
              const {
                extra: { rsuEsn, lng, lat },
              } = option as RSUSelectChangeType;
              setRsuId(value);
              mapChange({
                type: 1,
                rsuId: value,
                rsuEsn,
                lngLat: lng && lat ? [lng, lat] : [],
              });
            },
          }}
          params={{ code: areaCode }}
          options={deviceList}
        />
      </div>
    </div>
  );
};

export default CountryCascader;
