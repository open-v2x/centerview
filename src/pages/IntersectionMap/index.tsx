import React from 'react';
import PlatformHeader from 'center-src/components/PlatformHeader';
import RoadMap from './components/RoadMap';
import RoadMapXml from './components/RoadMapXml';
import IntersectionStatistics from 'center-src/components/IntersectionStatistics';

const IntersectionMap: React.FC<RouterMatchTypes> = ({ location: { query } }) => {
  const { type, id, esn, nodeId } = query;
  return (
    <div className="cloud_platform">
      <PlatformHeader back={true} />
      {type === '1' && <RoadMap esn={esn as string} nodeId={nodeId as string} />}
      {type === '2' && <RoadMapXml id={id as string} />}
      <IntersectionStatistics esn={esn as string} />
    </div>
  );
};

export default IntersectionMap;
