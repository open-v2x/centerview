import CloudPoint from '@/components/CloudPoint';
const CloudLidar = () => {
  const webSocketUrl = `ws://172.16.201.233:8000/ws`;
  return (
    <div>
      <CloudPoint wsUrl={webSocketUrl} />
    </div>
  );
};

export default CloudLidar;
