// components/PieChart.js

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

// Sample data based on your structure


// Expanded color array
const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF5733', '#33FF57', '#3357FF', '#FFC300',
    '#DAF7A6', '#C70039', '#900C3F', '#581845', '#FFB6C1',
];


const PieChartComponent = ({data}) => {

    const transformedData = data.map(item => ({
        name: item['ISIN Name'],
        value: parseFloat(item['Value']), // Ensure value is a number
    }));

    return (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Portfolio Distribution (Pie Chart)
            </Typography>
            <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={transformedData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            label
                        >
                            {transformedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value}`, name]}
                            labelFormatter={(label) => label}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
};


export default PieChartComponent;
