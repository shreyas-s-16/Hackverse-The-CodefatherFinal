
import React, { useState, useCallback } from 'react';
import Card from './common/Card';
import { MOCK_PORTFOLIO } from '../constants';
import { getPortfolioAnalysis } from '../services/geminiService';

const PortfolioAnalytics: React.FC = () => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setAnalysis('');
        const result = await getPortfolioAnalysis(MOCK_PORTFOLIO);
        setAnalysis(result);
        setIsLoading(false);
    }, []);

    return (
        <Card title="AI Portfolio Analytics">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">
                    Get an AI-powered analysis of your current holdings for insights on risk, diversification, and potential opportunities.
                </p>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Analyzing...' : 'Generate Analysis'}
                </button>
                {isLoading && (
                     <div className="flex justify-center items-center pt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                )}
                {analysis && (
                    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg space-y-2">
                        <h4 className="font-semibold text-green-400">AI Insights:</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{analysis}</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PortfolioAnalytics;
