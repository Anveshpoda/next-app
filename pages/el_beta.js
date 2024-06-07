// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const runScript = async () => {
    setOutput('');
    setError('');

    const response = await fetch('/api/run-script');
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        setOutput((prevOutput) => prevOutput + decoder.decode(value));
      }
    }

    if (!response.ok) {
      setError('Failed to run script');
    }
  };

  return (
    <div>
      <h1>Run Script Example</h1>
      <button onClick={runScript}>Run Script</button>
      {output && <pre>{output}</pre>}
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
    </div>
  );
}
