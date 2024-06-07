import { useState } from 'react';

export default function EL() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const runScript = async () => {
    setOutput('');
    setError('');

    const res = await fetch('/api/run-script');
    const data = await res.json();
    if (res.ok) {
      setOutput(data.output);
    } else {
      setError(data.error);
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
