import React, { useState } from 'react';
import { history } from 'umi';
import { Map, APILoader, ScaleControl, ToolBarControl, Marker } from '@uiw/react-amap';
import PlatformHeader from 'center-src/components/PlatformHeader';
import CountryCascader from 'center-src/components/CountryCascader';
import imgLocation from 'center-src/assets/images/location.png';
type MarkerType = {
  type: number;
  rsuId: number;
  rsuEsn: string;
  lngLat: [number, number] | [];
};

const CloudPlatform: React.FC<RouterMatchTypes> = ({ location: { query } }) => {
  const [markerList, setMarkerList] = useState<MarkerType>();

  const mapLngLat = (data?: MarkerType) => {
    setMarkerList(data);
  };

  return (
    <div className="cloud_platform">
      <PlatformHeader back>
        <CountryCascader
          nodeId={+query.id}
          defaultValue={['CN', '320000', '320100', '320115']}
          mapChange={mapLngLat}
        />
      </PlatformHeader>
      <APILoader akay={process.env.AMAP_KEY}>
        <Map
          center={markerList?.lngLat.length ? markerList.lngLat : undefined}
          mapStyle="amap://styles/blue"
          zoom={16}
        >
          {({ AMap }) => (
            <>
              <ScaleControl offset={[20, 30]} position="LB" />
              <ToolBarControl offset={[30, 30]} position="RB" />
              {markerList?.lngLat.length ? (
                <Marker
                  icon={
                    new AMap.Icon({
                      imageSize: new AMap.Size(36, 36),
                      image: imgLocation,
                    })
                  }
                  offset={new AMap.Pixel(-18, -36)}
                  position={new AMap.LngLat(...markerList.lngLat)}
                  onClick={() =>
                    history.push({
                      pathname: '/map',
                      query: {
                        type: `${markerList.type}`,
                        id: `${markerList.rsuId}`,
                        esn: `${markerList.rsuEsn}`,
                        nodeId: query.id,
                      },
                    })
                  }
                />
              ) : (
                ''
              )}
            </>
          )}
        </Map>
      </APILoader>
    </div>
  );
};

export default CloudPlatform;
