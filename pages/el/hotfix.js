import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { runCmd } from '@/utils/fun';
import moment from 'moment';

const Hotfix = ({ output, error, outputRef, prOut, ...props }) => {
  const [logData, setLogData] = useState('')
  const [logList, setLogList] = useState([])

  useEffect(() => { getLogList() }, [])
  useEffect(() => { setLogData('') }, [output, error, prOut])
  

  const sortedFd = (fd) => fd.sort((a, b) => {
    const format = '[log_]HH-mm__DD-MM-YYYY[.txt]';
    const dateA = moment(a, format);
    const dateB = moment(b, format);
    return dateB.diff(dateA);
  });

  const getLogList = async () => {
    let files = await runCmd('ls', 'logs/hotfix');
    console.log('files >> ', files)
    setLogList(sortedFd(files.fd) || []);
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
          <FormControlLabel control={<Checkbox name="checkbox1" checked={props.extraOpt?.createMr || false} onChange={(e, n) => { props.setExtraOpt({ ...props.extraOpt, createMr: n }) }} />} label="Create Mr to Live" />
          {/* <FormControlLabel control={<Checkbox name="checkbox2" />} label="Checkbox 2" /> */}
        </AccordionDetails>
      </Accordion>
      <div style={{ display: 'flex', width: '100%' }} >
        <div className='hfix' style={{ width: '170px', margin: '10px 10px 0 0 ', paddingRight: 9 }}>
          <div style={{ padding: '10px 0 0', fontWeight: 'bold' }}>LOG FILES</div>
          {logList.map((l, i) => <div className="tranBg" style={{ marginTop: 10, padding: 5, cursor: 'pointer' }} key={i} onClick={() => fetchLogContent(l)}>{l.replace('.txt', '').replace('log_', '')}</div>)}
        </div>
        {(output || error || logData) && (
          <div ref={outputRef} className="tranBg hfix" style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 10 }}>
            {output && <pre>{output}</pre>}
            {prOut && <pre>{JSON.stringify(prOut, null, 2)}</pre>}
            <pre style={{ whiteSpace: 'pre-wrap' }}>{logData}</pre>
            {error && <pre style={{ color: 'red' }}>{error}</pre>}
          </div>
        )}

      </div>
      <style jsx>{`
        .hfix{ max-height: calc(-242px + 100vh); overflow-y: scroll; }
      `}</style>
    </div>
  );
};

export default Hotfix;
