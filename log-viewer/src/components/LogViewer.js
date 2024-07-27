import React, { useEffect, useState } from 'react';

const LogViewer = () => {
  const [log, setLog] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onmessage = (event) => {
      console.log('This is data', event.data);
      setLog(event.data + '\n');
    };

    ws.onopen = () => {
      console.log('Open connection');
    };

    ws.onclose = () => {
      console.log('Close connection');
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <title>Browserstack Test</title>
      <h1>This is Frontend for Logs</h1>
      <pre id='log'>{log}</pre>
    </div>
  );
};

export default LogViewer;
