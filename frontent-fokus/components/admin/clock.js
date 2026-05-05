import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function Clock() {
  const [time, setTime] = useState(dayjs().format('DD/MM/YYYY HH:mm:ss'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('DD/MM/YYYY HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div className="text-xs font-medium">{time}</div>;
}
