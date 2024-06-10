import { Button, CircularProgress } from "@mui/material";
import Router from "next/router";
import { useEffect, useState } from "react";


const El_new = () => {
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [color, setColor] = useState('');

    const runScript = async () => {
        setOutput(''); setError(''); setLoading(true);
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

        if (!response.ok) { setError('Failed to run script'); setColor('red') }
        // else if () setColor('green')
        setLoading(false);
    };

    return (
        <div style={{ margin: 10 }}>
            <h1>EL Staging Script</h1>
            <Button variant="contained" color="secondary" onClick={runScript} disabled={!!loading} endIcon={loading && <CircularProgress size={24} />}
                style={{ backgroundColor: color ? color : 'secondary', color: 'white' }}
            > {loading ? 'Loading...' : 'Submit'}
            </Button>

            {(output || error) && <div className="tranBg" style={{ maxHeight: 'calc( 100vh - 154px)', overflow: 'scroll', width: '100%', marginTop: 10 }}>
                {output && <pre>{output}</pre>}
                {error && <pre style={{ color: 'red' }}>{error}</pre>}
            </div>}
        </div>
    );
}

export default El_new;