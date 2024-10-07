import React from 'react';
import useStore from './lib/store';

function App() {
  const { count, increaseCount, clearCount } = useStore();
  console.log(count);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increaseCount}>Increase Count</button>
      <button onClick={clearCount}>Clear Count</button>
    </div>
  );
}

export default App;
