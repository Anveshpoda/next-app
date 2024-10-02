// components/SankeyChart.js

import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Paper, Typography } from '@mui/material';

const sankeyData = [
    { source: 'ABSL AMC LTD#ABSL MF-ABSL PSU EQUITY FUND-DIRECT-GROWTH', target: 'Listed', value: 4434.51 },
    { source: 'ASIAN PAINTS  LIMITED # NEW EQUITY SHARES OF RE.1/- AFTER SUB DIVISION', target: 'Listed', value: 9831.6 },
    { source: 'BHARAT ELECTRONICS LIMITED#EQ SH WITH FACE VALUE RE. 1/- AFTER SUB DIVISION', target: 'Listed', value: 9370.35 },
    { source: 'BLS INTERNATIONAL SERVICES LIMITED#EQUITY SHARES WITH FACE VALUE RE1/- AFTER SUB-DIVISION', target: 'Listed', value: 3745 }
];

const transformData = (data) => {
    const nodes = [];
    const links = [];

    // Create unique nodes
    data.forEach(entry => {
        if (!nodes.find(node => node.name === entry.source)) {
            nodes.push({ name: entry.source });
        }
        if (!nodes.find(node => node.name === entry.target)) {
            nodes.push({ name: entry.target });
        }

        // Create links
        links.push({ 
            source: nodes.findIndex(node => node.name === entry.source),
            target: nodes.findIndex(node => node.name === entry.target),
            value: entry.value
        });
    });

    return { nodes, links };
};

const SankeyChart = ({data}) => {
    const { nodes, links } = transformData(sankeyData);

    return (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Sankey Chart Example
            </Typography>
            <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer>
                    <Sankey
                        data={{ nodes, links }}
                        node={{ stroke: '#000', strokeWidth: 1 }}
                        link={{ stroke: '#ccc' }}
                    >
                        <Legend />
                        <Tooltip content={({ payload }) => {
                            if (payload && payload.length) {
                                const { source, target, value } = payload[0].payload;
                                return (
                                    <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
                                        <p>{`${source} → ${target}: ${value?.toFixed(2)}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                    </Sankey>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
};

export default SankeyChart;
