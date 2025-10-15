export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface PortfolioHolding {
    symbol: string;
    name: string;
    shares: number;
    avgCost: number;
    currentPrice: number;
}

// FIX: Updated NewsArticle interface to match the structure of grounding chunks from the Gemini API.
export interface NewsArticle {
    web: {
        uri: string;
        title: string;
    };
}

export interface TradeOrder {
    action: 'BUY' | 'SELL';
    symbol: string;
    quantity: number;
    price: number;
}

export interface ChartDataPoint {
    name: string;
    price: number;
}

export interface StockPrediction {
    symbol: string;
    targetPrice: number;
    rationale: string;
}
