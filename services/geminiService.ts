import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import type { PortfolioHolding } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPortfolioAnalysis = async (portfolio: PortfolioHolding[]): Promise<string> => {
    const prompt = `
        Analyze the following stock portfolio based on current market conditions for the Indian stock market. 
        Provide a concise analysis covering:
        1. Risk assessment (concentration, volatility).
        2. Potential opportunities for diversification.
        3. A brief comment on the strongest and weakest positions.
        
        Keep the analysis to a maximum of 3 paragraphs.
        
        Portfolio:
        ${JSON.stringify(portfolio, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting portfolio analysis:", error);
        return "An error occurred while analyzing the portfolio. Please try again.";
    }
};

export const getNews = async (ticker: string): Promise<{ summary: string; sources: any[] }> => {
    const prompt = `Provide a brief summary of the latest significant news and current affairs for the Indian stock with ticker ${ticker}.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { summary, sources };
    } catch (error) {
        console.error("Error getting news:", error);
        return { summary: "Could not fetch news at this time.", sources: [] };
    }
};

export const tradeFunctionDeclarations: FunctionDeclaration[] = [
    {
        name: 'execute_stock_trade',
        description: 'Execute a stock trade (buy or sell) on the Indian stock market.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                action: {
                    type: Type.STRING,
                    description: 'The type of trade, either "BUY" or "SELL".',
                    enum: ['BUY', 'SELL']
                },
                symbol: {
                    type: Type.STRING,
                    description: 'The stock ticker symbol for NSE, e.g., "RELIANCE" or "TCS".',
                },
                quantity: {
                    type: Type.INTEGER,
                    description: 'The number of shares to trade.',
                },
            },
            required: ['action', 'symbol', 'quantity'],
        },
    },
     {
        name: 'get_stock_price',
        description: 'Get the latest stock price for a given ticker symbol from the Indian stock market.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                symbol: {
                    type: Type.STRING,
                    description: 'The stock ticker symbol for NSE, e.g., "RELIANCE" or "HDFCBANK".',
                },
            },
            required: ['symbol'],
        },
    }
];
