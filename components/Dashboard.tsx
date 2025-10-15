import React, { useState, useCallback } from 'react';
import PortfolioAnalytics from './PortfolioAnalytics';
import StockChart from './StockChart';
import NewsFeed from './NewsFeed';
import VoiceAgent from './VoiceAgent';
import AiPredictions from './AiPredictions';
import OrderHistory from './OrderHistory';
import OrderPlacement from './OrderPlacement';
import { StockPrediction, TradeOrder } from '../types';
import { getAiPredictions } from '../services/geminiService';
import { MOCK_PORTFOLIO, MOCK_CHART_DATA } from '../constants';

const Dashboard: React.FC = () => {
    const [predictions, setPredictions] = useState<StockPrediction[]>([]);
    const [isGeneratingPredictions, setIsGeneratingPredictions] = useState(false);
    const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([]);

    const handleGeneratePredictions = useCallback(async () => {
        setIsGeneratingPredictions(true);
        setPredictions([]);
        const result = await getAiPredictions(MOCK_PORTFOLIO, MOCK_CHART_DATA);
        setPredictions(result);
        setIsGeneratingPredictions(false);
    }, []);

    const addTradeToHistory = (order: TradeOrder) => {
        setTradeHistory(prev => [order, ...prev]);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-6 font-sans">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Stonks AI Dashboard
                </h1>
                <div className="text-sm text-gray-400">Welcome, trader_01</div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Main chart */}
                <div className="lg:col-span-3 lg:row-span-2">
                    <StockChart />
                </div>
                
                {/* Voice Agent */}
                <div className="lg:col-span-1 lg:row-span-2">
                    <VoiceAgent onNewTrade={addTradeToHistory} />
                </div>

                {/* Portfolio Analytics */}
                <div className="lg:col-span-1">
                    <PortfolioAnalytics />
                </div>
                
                {/* News */}
                <div className="lg:col-span-1">
                    <NewsFeed />
                </div>

                {/* AI Predictions */}
                <div className="lg:col-span-1">
                     <AiPredictions 
                        onGenerate={handleGeneratePredictions}
                        predictions={predictions}
                        isLoading={isGeneratingPredictions}
                    />
                </div>

                {/* Order Placement */}
                <div className="lg:col-span-1">
                    <OrderPlacement />
                </div>

                 {/* Order History */}
                <div className="lg:col-span-4">
                    <OrderHistory tradeHistory={tradeHistory} />
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
