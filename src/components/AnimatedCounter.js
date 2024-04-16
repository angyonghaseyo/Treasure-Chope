import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ number, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // first figure out how many milliseconds we need for each increment
    const interval = Math.floor(duration / number);

    const counter = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === number) clearInterval(counter);
    }, interval);

    return () => clearInterval(counter); // cleanup on component unmount
  }, [number, duration]);

  return <span>{count}</span>;
};

export default AnimatedCounter;
