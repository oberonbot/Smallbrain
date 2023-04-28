import { useEffect, useState, React } from 'react';

function Typewritter ({ text }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const intervalId = setInterval(() => {
      setDisplayText(prevText => prevText + text[i]);
      i++;
      if (i === text.length) clearInterval(intervalId);
    }, 100);
    return () => clearInterval(intervalId);
  }, [text]);

  return <div>{ displayText }</div>;
}

export default Typewritter
