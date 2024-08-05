// resources/js/pages/WeatherData.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const WeatherData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/weather-data')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <Layout>
            <h2>Weather Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        {/* Add more columns as needed */}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.date}</td>
                            <td>{item.temperature}</td>
                            <td>{item.humidity}</td>
                            {/* Add more columns as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default WeatherData;
