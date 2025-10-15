import React, { useState } from 'react';
import Card from './common/Card';

const OrderPlacement: React.FC = () => {
    const [symbol, setSymbol] = useState('RELIANCE');
    const [quantity, setQuantity] = useState('10');
    const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');

    return (
        <Card title="Manual Order">
            <div className="space-y-4">
                <div>
                    <label htmlFor="symbol" className="block text-xs font-medium text-gray-400 mb-1">Stock Symbol</label>
                    <input 
                        type="text" 
                        id="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        className="w-full p-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                 <div>
                    <label htmlFor="quantity" className="block text-xs font-medium text-gray-400 mb-1">Quantity</label>
                    <input 
                        type="number" 
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                     <button
                        onClick={() => setAction('BUY')}
                        className={`px-4 py-2 font-semibold text-white rounded-md transition-colors ${action === 'BUY' ? 'bg-green-600' : 'bg-gray-600 hover:bg-green-700'}`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setAction('SELL')}
                        className={`px-4 py-2 font-semibold text-white rounded-md transition-colors ${action === 'SELL' ? 'bg-red-600' : 'bg-gray-600 hover:bg-red-700'}`}
                    >
                        Sell
                    </button>
                </div>
                <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Place {action} Order
                </button>
            </div>
        </Card>
    );
};

export default OrderPlacement;
