import React, { useState, useCallback } from 'react';
import Card from './common/Card';
import { getNews } from '../services/geminiService';
import { NewsArticle } from '../types';

const NewsFeed: React.FC = () => {
    const [news, setNews] = useState<{ summary: string, sources: NewsArticle[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [ticker] = useState('RELIANCE');

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        setNews(null);
        const result = await getNews(ticker);
        setNews(result);
        setIsLoading(false);
    }, [ticker]);

    return (
        <Card title={`Latest News for ${ticker}`}>
            <div className="space-y-4">
                 <button
                    onClick={fetchNews}
                    disabled={isLoading}
                    className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Fetching News...' : `Get Latest ${ticker} News`}
                </button>
                 {isLoading && (
                     <div className="flex justify-center items-center pt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    </div>
                )}

                {news && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <h4 className="font-semibold text-blue-400">AI Summary:</h4>
                            <p className="text-sm text-gray-300">{news.summary}</p>
                        </div>
                        {news.sources.length > 0 && (
                             <div>
                                <h4 className="font-semibold text-blue-400">Sources:</h4>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    {news.sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a 
                                                href={source.web.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-400 hover:underline truncate"
                                            >
                                                {source.web.title || source.web.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default NewsFeed;
