
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

export interface NewsArticle {
    title: string;
    uri: string;
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
