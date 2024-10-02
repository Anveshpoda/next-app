// components/PortfolioChart.js

import React from 'react';
import { BarChart, Bar, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

// Expanded color array
const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF5733', '#33FF57', '#3357FF', '#FFC300',
    '#DAF7A6', '#C70039', '#900C3F', '#581845', '#FFB6C1',
    '#7FFF00', '#FFD700', '#8A2BE2', '#FF4500', '#20B2AA',
];

const PortfolioChart = ({ data, height }) => {
    const maxValue = Math.max(...data.map(entry => entry.Value));

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { 'ISIN Name': isinName, Value } = payload[0].payload;

            return (
                <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    maxWidth: '200px',
                    padding: '10px',
                    wordWrap: 'break-word'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{isinName}</p>
                    <p style={{ margin: 0 }}>Value: {Value}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>
                Portfolio Distribution
            </Typography>
            <div style={{ width: '100%', height: height || '100px' }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis domain={[0, maxValue + 1000]} />
                        <Tooltip content={<CustomTooltip />} />
                        {/* <Legend /> */}
                        <Bar dataKey="Value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
};

export default PortfolioChart;
