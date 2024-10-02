// pages/index.js

import { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import PortfolioChart from '@/components/Stocks/charts/PortfolioChart';
import SankeyChart from '@/components/Stocks/charts/SankeyChart';
import PieChartComponent from '@/components/Stocks/charts/piChart';

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/stocks/csv-convert');
            const jsonData = await response.json();
            setData(jsonData);
        };

        fetchData();
    }, []);

    return (
        <Container>
            <h1>Your Portfolio Data</h1>
            {data.length > 0 ? (
                <>
                    <PortfolioChart height="500px" data={data} />
                    <SankeyChart data={data}/>
                    <PieChartComponent data={data} />
                </>

            ) : (
                <p>Loading data...</p>
            )}
        </Container>
    );
};

export default Home;
