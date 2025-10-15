import React from 'react';
import Card from './common/Card';
import StockChart from './StockChart';
import PortfolioAnalytics from './PortfolioAnalytics';
import NewsFeed from './NewsFeed';
import VoiceAgent from './VoiceAgent';
import { MOCK_STOCKS, MOCK_PORTFOLIO } from '../constants';
import { Stock, PortfolioHolding } from '../types';

const Watchlist: React.FC = () => (
    <Card title="Watchlist">
        <div className="space-y-3">
            {MOCK_STOCKS.map((stock: Stock) => (
                <div key={stock.symbol} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-bold">{stock.symbol}</p>
                        <p className="text-xs text-gray-400 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono">₹{stock.price.toFixed(2)}</p>
                        <p className={`text-xs font-mono ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const Portfolio: React.FC = () => (
    <Card title="My Holdings" className="col-span-1 lg:col-span-2">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                    <tr>
                        <th scope="col" className="px-4 py-2">Symbol</th>
                        <th scope="col" className="px-4 py-2">Quantity</th>
                        <th scope="col" className="px-4 py-2">Avg. Cost</th>
                        <th scope="col" className="px-4 py-2">Current Price</th>
                        <th scope="col" className="px-4 py-2">P/L</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_PORTFOLIO.map((holding: PortfolioHolding) => {
                        const pnl = (holding.currentPrice - holding.avgCost) * holding.shares;
                        return (
                            <tr key={holding.symbol} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-4 py-3 font-bold">{holding.symbol}</td>
                                <td className="px-4 py-3 font-mono">{holding.shares}</td>
                                <td className="px-4 py-3 font-mono">₹{holding.avgCost.toFixed(2)}</td>
                                <td className="px-4 py-3 font-mono">₹{holding.currentPrice.toFixed(2)}</td>
                                <td className={`px-4 py-3 font-mono ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    ₹{pnl.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 lg:p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Stonks AI Dashboard</h1>
                <p className="text-gray-400">Welcome, Trader_01</p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="lg:col-span-2 xl:col-span-3 h-96">
                    <StockChart />
                </div>
                <div className="row-span-2">
                     <Watchlist />
                </div>
                <div className="md:col-span-2 lg:col-span-3 xl:col-span-2">
                    <Portfolio />
                </div>
                 <div className="h-full">
                    <VoiceAgent />
                </div>
                <div className="h-full">
                    <PortfolioAnalytics />
                </div>
                 <div className="h-full">
                    <NewsFeed />
                </div>
            </main>
             <footer className="text-center text-xs text-gray-600 mt-8">
                <p>Stonks AI is a simulated trading platform. All data is mock data. Not financial advice.</p>
                <p>SEBI Regulatory Disclosures | Data Security Policy</p>
            </footer>
        </div>
    );
};

export default Dashboard;
