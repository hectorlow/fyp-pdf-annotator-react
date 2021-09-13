import React, { useEffect } from 'react';

console.log('listener script');

const selectSomething = (event) => {
  const selectedText = window.getSelection().toString();
  console.log('selected text: ', selectedText);
};

const Listener = () => {
  console.log('listener component');
  useEffect(() => {
    document.body.onmouseup = selectSomething;

    return function cleanup() {
      console.log('use effect cleanup function');
    };
  }, []);

  return (
    <div>
      Listener component
    </div>
  );
};

export default Listener;
