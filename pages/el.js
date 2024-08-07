import { useState, useRef, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { runCmd } from '@/utils/fun';
import Select from '@/components/UI/select';
const path = '/home/anveshpoda/sandbox/El_staging';

const selSx = {
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'purple', border: '2px solid' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'pink' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'orange' },
    '.MuiSvgIcon-root ': { fill: 'blue' },
}

const El_new = ({ branchName: initialBranchName, branchList }) => {
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState('');
    const [forceUpdate, setForceUpdate] = useState(false);
    const [script, setScript] = useState(initialBranchName == 'el-pre-prod' ? 'beta' : 'hotfix');
    const [selectedBranch, setSelectedBranch] = useState(initialBranchName);
    const outputRef = useRef(null);

    useEffect(() => {
        console.log('props test >> ', { branchName: initialBranchName, branchList });
    }, [initialBranchName, branchList]);

    const runScript = async (force = 0) => {
        console.log('force >> ', force)
        setOutput(''); setError(''); setLoading(true); setColor(''); setForceUpdate(false);

        if ((script != 'dev') && !((selectedBranch == 'el-pre-prod' && script == 'beta') || (selectedBranch == 'el-hotfix' && script == 'hotfix'))) { setError('Check The Branch and Script combination'); return setLoading(false); }

        try {
            const response = await fetch('/api/run-script?type=' + script + '&force=' + force);

            // Check if the status is not OK before reading the stream
            if (!response.ok) {
                if (response.status === 429) {
                    const errorData = await response.json();
                    setError(errorData.error);
                    setForceUpdate(true);
                    setColor('red');
                } else {
                    setError('An error occurred while running the script');
                    setColor('red');
                }
                setLoading(false);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let success = false;

            let done = false;
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const text = decoder.decode(value, { stream: true });
                    setOutput((prevOutput) => prevOutput + text);
                    if (text.includes('Script ran successfully')) {
                        success = true;
                    }
                }
            }

            if (success) {
                setColor('green');
            } else {
                setColor('red');
                setError('Failed to run script');
            }

        } catch (err) {
            setError('An error occurred while running the script');
            setColor('red');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output, error]);

    const handleBranchChange = async (nB) => {
        await runCmd(`git checkout ${nB}`, path);
        let bName = await runCmd('git rev-parse --abbrev-ref HEAD', path);
        console.log('branchName >> ', bName);
        setSelectedBranch(bName.data);
    };

    return (
        <div style={{ margin: 10 }}>
            <div>
                <h1 style={{ display: 'inline-flex' }}>EL Staging Script</h1>

                <div style={{ display: 'inline-flex', float: 'right' }}>
                    <Select value={selectedBranch} onChange={handleBranchChange} list={branchList} sx={selSx} />
                </div>
            </div>
            {selectedBranch && <><div>Current Branch: <b>{selectedBranch}</b></div><br /></>}

            <Select value={script} onChange={v => setScript(v)} list={['beta', 'hotfix', 'dev']} sx={{ ...selSx }} style={{ height: 40, margin: '0 10px', display: 'inline-flex' }} />
            <Button variant="contained" color="primary" onClick={() => runScript(0)} disabled={loading} endIcon={loading && <CircularProgress size={24} />} style={{ backgroundColor: color || 'primary', color: 'white' }}>
                {loading ? 'Loading...' : 'Run Script'}
            </Button>
            {(color === 'green' && script == "beta") && (
                <Button variant="contained" color="secondary" style={{ marginLeft: 20 }} onClick={() => { window.location.href = "http://192.168.131.150:8980/job/git_update_edit-list_staging/"; }}>
                    Run Pipeline
                </Button>
            )}
            {forceUpdate && (
                <Button variant="contained" style={{ backgroundColor: "#b02727", marginLeft: 20 }} onClick={() => runScript(1)}>
                    Force Update
                </Button>
            )}
            {(output || error) && (
                <div ref={outputRef} className="tranBg" style={{ maxHeight: 'calc(100vh - 180px)', overflow: 'scroll', marginTop: 10, padding: 10 }}>
                    {output && <pre>{output}</pre>}
                    {error && <pre style={{ color: 'red' }}>{error}</pre>}
                </div>
            )}
        </div>
    );
}

export async function getStaticProps() {
    let branchName = await runCmd('git rev-parse --abbrev-ref HEAD', path, 1);
    let branchList = await runCmd('git for-each-ref --format="%(refname:short)" refs/heads/', path, 1);

    console.log('branchName >> ', branchName, branchList);
    return {
        props: {
            branchName: branchName?.data || null,
            branchList: branchList?.fd || [],
        },
    };
}

export default El_new;