
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import { LockClosedIcon, ArrowRightIcon } from './components/common/Icons';

const WelcomeScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl text-center">
            <div className="flex justify-center">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Stonks AI</h1>
            </div>
            <p className="text-gray-400">
                The future of trading is here. Voice-activated commands, AI-powered analytics, and real-time insights.
            </p>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold text-gray-400 sr-only">Username</label>
                    <input className="w-full p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" type="text" placeholder="Username" defaultValue="trader_01" />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-400 sr-only">Password</label>
                    <input className="w-full p-3 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" type="password" placeholder="Password" defaultValue="••••••••" />
                </div>
                 <div className="flex items-center justify-center text-xs text-gray-500">
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    SEBI Compliant & 256-bit SSL Secured
                </div>
            </div>
            <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-blue-400 hover:underline">Forgot Password?</a>
                <button
                    onClick={onLogin}
                    className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-blue-600 rounded-md hover:opacity-90 transition-opacity duration-200"
                >
                    <span>Secure Login</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <WelcomeScreen onLogin={() => setIsAuthenticated(true)} />;
    }

    return <Dashboard />;
};

export default App;
