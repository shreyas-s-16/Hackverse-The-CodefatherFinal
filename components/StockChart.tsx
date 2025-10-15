import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import Card from './common/Card';
import { MOCK_CHART_DATA, MOCK_CHART_DATA_5D, MOCK_CHART_DATA_1M, MOCK_CHART_DATA_6M } from '../constants';
import { ChartDataPoint } from '../types';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    const getLabelName = () => {
        if (!label) return 'Time';
        // Heuristic for mock data to differentiate intraday from longer timeframes
        if (String(label).includes('ago') || String(label).includes('Week') || String(label).includes('month')) {
            return 'Date';
        }
        return 'Time';
    };

    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="label text-sm text-gray-200">{`${getLabelName()}: ${label}`}</p>
                <p className="intro text-sm text-green-400">{`Price: ₹${payload[0].value.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

type Timeframe = '1D' | '5D' | '1M' | '6M';

const StockChart: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe>('1D');

    const getChartData = () => {
        switch (timeframe) {
            case '5D':
                return MOCK_CHART_DATA_5D;
            case '1M':
                return MOCK_CHART_DATA_1M;
            case '6M':
                return MOCK_CHART_DATA_6M;
            default:
                return MOCK_CHART_DATA;
        }
    };

    const chartData = getChartData();
    const timeframes: Timeframe[] = ['1D', '5D', '1M', '6M'];

    return (
        <Card title="RELIANCE - Price Chart" className="h-full flex flex-col">
            <div className="flex flex-col h-full">
                <div className="flex justify-end -mt-2 mb-2">
                    <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-md">
                        {timeframes.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                    timeframe === t 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-grow">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
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
                            {/* Added Brush component for zoom and pan functionality */}
                            <Brush 
                                dataKey="name" 
                                height={30} 
                                stroke="#10b981" 
                                fill="#1f2937" 
                                travellerWidth={10} 
                                travellerProps={{ stroke: '#a0aec0' }}
                            >
                                <AreaChart>
                                    <Area dataKey="price" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                </AreaChart>
                            </Brush>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default StockChart;