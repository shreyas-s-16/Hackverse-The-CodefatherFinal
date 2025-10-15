import { PortfolioHolding, Stock, ChartDataPoint } from './types';

export const MOCK_STOCKS: Stock[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2855.50, change: 30.15, changePercent: 1.06 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3840.10, change: -25.55, changePercent: -0.66 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1670.80, change: 12.20, changePercent: 0.73 },
    { symbol: 'INFY', name: 'Infosys Ltd', price: 1530.45, change: 5.90, changePercent: 0.39 },
];

export const MOCK_PORTFOLIO: PortfolioHolding[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', shares: 50, avgCost: 2450.00, currentPrice: 2855.50 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', shares: 100, avgCost: 1550.25, currentPrice: 1670.80 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', shares: 200, avgCost: 975.60, currentPrice: 955.20 },
    { symbol: 'WIPRO', name: 'Wipro Ltd', shares: 300, avgCost: 450.10, currentPrice: 488.75 },
];

export const MOCK_CHART_DATA: ChartDataPoint[] = [
    { name: '9:30', price: 2845.10 },
    { name: '10:00', price: 2850.90 },
    { name: '10:30', price: 2858.50 },
    { name: '11:00', price: 2852.20 },
    { name: '11:30', price: 2860.30 },
    { name: '12:00', price: 2865.10 },
    { name: '12:30', price: 2859.80 },
    { name: '1:00', price: 2862.50 },
    { name: '1:30', price: 2868.80 },
    { name: '2:00', price: 2864.30 },
    { name: '2:30', price: 2861.50 },
    { name: '3:00', price: 2858.90 },
    { name: '3:30', price: 2856.90 },
    { name: '4:00', price: 2855.50 },
];

export const MOCK_CHART_DATA_5D: ChartDataPoint[] = [
    { name: '5 days ago', price: 2820.75 },
    { name: '4 days ago', price: 2835.10 },
    { name: '3 days ago', price: 2815.90 },
    { name: '2 days ago', price: 2850.30 },
    { name: 'Yesterday', price: 2848.00 },
    { name: 'Today', price: 2855.50 },
];

export const MOCK_CHART_DATA_1M: ChartDataPoint[] = [
    { name: 'Week 1', price: 2750.45 },
    { name: 'Week 2', price: 2790.80 },
    { name: 'Week 3', price: 2810.25 },
    { name: 'Week 4', price: 2855.50 },
];

export const MOCK_CHART_DATA_6M: ChartDataPoint[] = [
    { name: '6M ago', price: 2500.00 },
    { name: '5M ago', price: 2650.50 },
    { name: '4M ago', price: 2600.75 },
    { name: '3M ago', price: 2750.10 },
    { name: '2M ago', price: 2800.90 },
    { name: 'Last month', price: 2855.50 },
];