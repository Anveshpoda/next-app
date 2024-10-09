// pages/index.js

import { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import PortfolioChart from '@/components/Stocks/charts/PortfolioChart';
import SankeyChart from '@/components/Stocks/charts/SankeyChart';

import { alphavantageApiKey } from '@/constants';
import PieChartComponent from '@/components/Stocks/charts/PiChart';

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/stocks/csv-convert');
            const jsonData = await response.json();
            // console.log('jsonData >> ',(jsonData.map(i => i.ISIN)))
            // getSymbols(jsonData.map(i => i.ISIN))
            setData(jsonData.sort((a, b) => a.Value - b.Value));
        };

        fetchData();
    }, []);

    const getSymbols = async (arr) => {
        try {
            let params = {
                function: 'SYMBOL_SEARCH',
                keywords: arr.join(','), // Join ISINs into a comma-separated string
                apikey: alphavantageApiKey,
            }
            let url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=' + alphavantageApiKey + '&keywords=' + arr.join(',')
            console.log('url >> ',url)
            const response = await fetch(url);
            const data = await response.json();


            console.log('data >> ', response, data)
            const symbols = [];
            // for (const result of data?.bestMatches) {
            //     symbols.push(result.symbol);
            // }
            // console.log('symbols >> ',symbols)
            return symbols;
        } catch (error) {
            console.error('Error fetching symbols:', error);
            throw error;
        }
    }

    return (
        <Container>
            <h1>Your Portfolio Data</h1>
            {data.length > 0 ? (
                <>
                    <PortfolioChart height="500px" data={data} />
                    <SankeyChart data={data} />
                    <PieChartComponent data={data} />
                </>

            ) : (
                <p>Loading data...</p>
            )}
        </Container>
    );
};

export default Home;
