import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  // 初期値は 5 分 = 1500 秒
  const [seconds, setSeconds] = useState(1500);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 分:秒 の書式に変換
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1 style={{ fontSize: '4rem' }}>{formatTime(seconds)}</h1>
    </div>
  );
};

export default PomodoroTimer;
