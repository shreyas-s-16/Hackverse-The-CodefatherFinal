import React from 'react';
import Card from './common/Card';
import { StockPrediction } from '../types';

interface AiPredictionsProps {
    onGenerate: () => void;
    predictions: StockPrediction[];
    isLoading: boolean;
}

const AiPredictions: React.FC<AiPredictionsProps> = ({ onGenerate, predictions, isLoading }) => {
    return (
        <Card title="AI Price Predictions">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">
                    Generate short-term price targets for your holdings based on technical and market analysis.
                </p>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Generating...' : 'Generate Predictions'}
                </button>
                {isLoading && (
                     <div className="flex justify-center items-center pt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                )}
                {predictions.length > 0 && !isLoading && (
                    <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                        {predictions.map((p, index) => (
                             <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="flex justify-between items-center font-semibold">
                                    <span className="text-white">{p.symbol}</span>
                                    <span className="text-blue-400">Target: ₹{p.targetPrice.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{p.rationale}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AiPredictions;
