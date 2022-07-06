import React from 'react';
import { history } from 'umi';
import PlatformHeader from '@/components/PlatformHeader';
import RoadMap from './components/RoadMap';
import RoadMapXml from './components/RoadMapXml';
import IntersectionStatistics from '@/components/IntersectionStatistics';

const IntersectionMap: React.FC = () => {
  const { type, id, esn } = history.location.query!;
  return (
    <div className="cloud_platform">
      <PlatformHeader back={true} />
      {type === '1' && <RoadMap esn={esn as string} />}
      {type === '2' && <RoadMapXml id={id as string} />}
      <IntersectionStatistics esn={esn as string} />
    </div>
  );
};

export default IntersectionMap;
