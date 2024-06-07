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
                setOutput((prevOutput) => prevOutput + decoder.decode(value, { stream: true }));
            }
        }

        if (!response.ok) {
            setError('Failed to run script');
        }
    };

    return (
        <div>
            <h1 style={{ padding: 10 }}>Run Script Example</h1>
            <button onClick={runScript}>Run Script</button>
            {(output || error) && <div style={{ maxHeight: 'calc( 100vh - 154px)', overflow: 'scroll', width: '100%' }}>
                {output && <pre>{output}</pre>}
                {error && <pre style={{ color: 'red' }}>{error}</pre>}
            </div>}
            <style jsx>{`
                /* Custom scrollbar track */
                ::-webkit-scrollbar {
                    width: 10px;
                }

                /* Custom scrollbar thumb */
                ::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 5px;
                }

                /* Optional: scrollbar track */
                ::-webkit-scrollbar-track {
                    background-color: #f1f1f1;
                }
            `}</style>
        </div>
    );
}
