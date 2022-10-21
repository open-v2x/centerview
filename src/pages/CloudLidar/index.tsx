import CloudPoint from '@/components/CloudPoint';
const CloudLidar = () => {
  const webSocketUrl = process.env.WEBSOCKET_URL!;
  return (
    <div>
      <CloudPoint wsUrl={webSocketUrl} />
    </div>
  );
};

export default CloudLidar;
