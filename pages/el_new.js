// pages/index.js
import { useState, useRef, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function El_new() {
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState('');
    const outputRef = useRef(null);

    const runScript = async () => {
        setOutput(''); setError(''); setLoading(true); setColor('');

        const response = await fetch('/api/run-script');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let done = false;
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                const text = decoder.decode(value, { stream: true });
                setOutput((prevOutput) => prevOutput + text);
            }
        }

        const finalText = await reader.read();
        const finalMessage = JSON.parse(decoder.decode(finalText.value));

        if (finalMessage.success) {
            setColor('green');
        } else {
            setColor('red');
            setError('Failed to run script');
        }

        setLoading(false);
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output, error]);

    return (
        <div style={{ margin: 10 }}>
            <h1>EL Staging Script</h1>
            <Button variant="contained" color="primary" onClick={runScript} disabled={loading} endIcon={loading && <CircularProgress size={24} />} style={{ backgroundColor: color ? color : 'primary', color: 'white' }}>
                {loading ? 'Loading...' : 'Run Script'}
            </Button>
            {color === 'green' && (
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: 20 }}
                    onClick={() => { window.location.href = "http://192.168.131.150:8980/job/git_update_edit-list_staging/"; }}
                >
                    Run Pipeline
                </Button>
            )}
            {(output || error) && (
                <div
                    ref={outputRef}
                    className="tranBg"
                    style={{ maxHeight: 'calc(100vh - 154px)', overflow: 'scroll', width: '100%', marginTop: 10 }}
                >
                    {output && <pre>{output}</pre>}
                    {error && <pre style={{ color: 'red' }}>{error}</pre>}
                </div>
            )}
        </div>
    );
}
