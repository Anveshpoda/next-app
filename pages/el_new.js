import { Button } from "@mui/material";
import { useState } from "react";


const El_new = () => {
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

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
        <div style={{ margin: 10 }}>
            <h1>EL Staging Script</h1>
            {/* <button onClick={runScript}>Run Script</button> */}
            <Button onClick={runScript} className='m-5' variant="contained" color="primary"> Run Script </Button><br />
            {(output || error) && <div className="tranBg" style={{ maxHeight: 'calc( 100vh - 154px)', overflow: 'scroll', width: '100%' }}>
                {output && <pre>{output}</pre>}
                {error && <pre style={{ color: 'red' }}>{error}</pre>}
            </div>}
        </div>
    );
}

export default El_new;