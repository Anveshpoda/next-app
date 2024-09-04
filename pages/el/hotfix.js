import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { runCmd } from '@/utils/fun';

const Hotfix = ({ output, error, outputRef, ...props }) => {
  const [logData, setLogData] = useState('')
  const [logList, setLogList] = useState([])
  useEffect(() => {
    getLogList()
  }, [])

  const getLogList = async () => {
    let files = await runCmd('ls', 'logs/hotfix');
    setLogList(files.fd || []);
  }


  const fetchLogContent = (fileName) => {
    fetch(`/api/getFileData?type=hotfix&fileName=${encodeURIComponent(fileName)}`)
      .then(response => response.json())
      .then(data => { console.log('data >> ', data); setLogData(data.content) })
      .catch(error => console.error('Error fetching log content:', error));
  };




  return (

    <div>
      <Accordion sx={{ mt: 1 }} style={{ background: 'transparent', width: 'fit-content' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Advance Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {console.log('props.extraOpt.createMr >> ', props.extraOpt.createMr)}
          <FormControlLabel control={<Checkbox name="checkbox1" checked={props.extraOpt.createMr || false} onChange={(e, n) => { props.setExtraOpt({ ...props.extraOpt, createMr: n }) }} />} label="Create Mr to Live" />
          {/* <FormControlLabel control={<Checkbox name="checkbox2" />} label="Checkbox 2" /> */}
        </AccordionDetails>
      </Accordion>
      <div style={{ display: 'flex', width: '100%' }} >
        <div style={{ width: '165px', margin: '10px 10px 0 0 ' }}>
          <div style={{ padding: '10px 0 0', fontWeight: 'bold' }}>LOG FILES</div>
          {logList.map((l, i) => <div className="tranBg" style={{ marginTop: 10, padding: 5, cursor: 'pointer' }} key={i} onClick={() => fetchLogContent(l)}>{l.replace('.txt', '').replace('log_', '')}</div>)}
        </div>
        {(output || error || logData) && (
          <div ref={outputRef} className="tranBg" style={{ maxHeight: 'calc(100vh - 242px)', width: '100%', overflow: 'scroll', marginTop: 10, padding: 10 }}>
            {output && <pre>{output}</pre>}
            <pre style={{ whiteSpace: 'pre-wrap' }}>{logData}</pre>
            {error && <pre style={{ color: 'red' }}>{error}</pre>}
          </div>
        )}

      </div>
    </div>
  );
};

export default Hotfix;
