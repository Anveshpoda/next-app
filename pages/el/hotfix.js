import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Hotfix = (props) => {
  return (
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
  );
};

export default Hotfix;
