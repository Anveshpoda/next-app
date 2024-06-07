// pages/index.js
import { useState } from 'react';

export default function EL() {
    const [output, setOutput] = useState('');

    const runScript = async () => {
        const res = await fetch('/api/beta');
        const data = await res.json();
        console.log('data >> ',res)
        if (res.ok) {
            setOutput(data.output);
        } else {
            setOutput(`Error: ${data.error}`);
        }
    };

    return (
        <div style={{ padding: 15 }}>
            <h1>Run Script Example</h1>
            <button onClick={runScript}>Run Script</button>
            {output && <pre>{output}</pre>}
        </div>
    );
}
