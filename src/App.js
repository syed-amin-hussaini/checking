import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  width:auto;
`;

const CapturedImage = styled.img`
  margin-top: 20px;
  max-width: 100%;
  border: 2px solid #333;
`;

const App = () => {
  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);

  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );

  return (
    <>
      {devices.map((device, key) => (
          <div>
            <Webcam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
            {device.label || `Device ${key + 1}`}
          </div>

        ))}
    </>
  );
};
export default App;