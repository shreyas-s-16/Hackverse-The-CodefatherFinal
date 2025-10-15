import React from 'react';
import Card from './common/Card';
import { TradeOrder } from '../types';

interface OrderHistoryProps {
    tradeHistory: TradeOrder[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ tradeHistory }) => {
    return (
        <Card title="Simulated Trade History">
            <div className="max-h-60 overflow-y-auto">
                {tradeHistory.length === 0 ? (
                    <p className="text-center text-gray-400">No trades executed yet.</p>
                ) : (
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-2">Action</th>
                                <th scope="col" className="px-4 py-2">Symbol</th>
                                <th scope="col" className="px-4 py-2">Quantity</th>
                                <th scope="col" className="px-4 py-2">Price (INR)</th>
                                <th scope="col" className="px-4 py-2">Total Value (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tradeHistory.map((order, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                    <td className={`px-4 py-2 font-semibold ${order.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                        {order.action}
                                    </td>
                                    <td className="px-4 py-2 font-mono">{order.symbol}</td>
                                    <td className="px-4 py-2">{order.quantity}</td>
                                    <td className="px-4 py-2">{order.price.toFixed(2)}</td>
                                    <td className="px-4 py-2">{(order.quantity * order.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
};

export default OrderHistory;
