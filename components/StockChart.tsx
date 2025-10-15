import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './common/Card';
import { MOCK_CHART_DATA } from '../constants';
import { ChartDataPoint } from '../types';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="label text-sm text-gray-200">{`Time: ${label}`}</p>
                <p className="intro text-sm text-green-400">{`Price: ₹${payload[0].value.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

const StockChart: React.FC = () => {
    return (
        <Card title="RELIANCE - Intraday Price" className="h-full flex flex-col">
            <div className="flex-grow">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={MOCK_CHART_DATA}
                        margin={{
                            top: 5, right: 30, left: 0, bottom: 5,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} />
                        <YAxis stroke="#a0aec0" domain={['dataMin - 10', 'dataMax + 10']} fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default StockChart;
