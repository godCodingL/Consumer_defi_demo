import { useState, useEffect, useCallback } from "react";

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  updatedAt: number;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

export const usePriceFeed = () => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({
    FLOW: {
      symbol: "FLOW",
      price: 2.45,
      change24h: 3.2,
      marketCap: 625000000,
      volume24h: 45000000,
      updatedAt: Date.now(),
    },
    USDC: {
      symbol: "USDC",
      price: 1.0,
      change24h: 0.01,
      marketCap: 35000000000,
      volume24h: 2500000000,
      updatedAt: Date.now(),
    },
  });

  const [priceHistory, setPriceHistory] = useState<
    Record<string, PriceHistory[]>
  >({
    FLOW: [],
    USDC: [],
  });

  // Simulate price updates with realistic volatility
  const simulatePriceUpdate = useCallback(() => {
    setPrices((prev) => {
      const updated = { ...prev };

      ["FLOW", "USDC"].forEach((symbol) => {
        const current = updated[symbol];
        const volatility = symbol === "FLOW" ? 0.02 : 0.001; // FLOW is more volatile
        const changePercent = (Math.random() - 0.5) * volatility;
        const newPrice = Math.max(0.01, current.price * (1 + changePercent));

        updated[symbol] = {
          ...current,
          price: parseFloat(newPrice.toFixed(4)),
          change24h: current.change24h + changePercent * 100,
          updatedAt: Date.now(),
        };

        // Add to history
        setPriceHistory((hist) => ({
          ...hist,
          [symbol]: [
            ...(hist[symbol] || []).slice(-99), // Keep last 100 entries
            { timestamp: Date.now(), price: newPrice },
          ],
        }));
      });

      return updated;
    });
  }, []);

  // Update prices every 5 seconds
  useEffect(() => {
    const interval = setInterval(simulatePriceUpdate, 5000);
    return () => clearInterval(interval);
  }, [simulatePriceUpdate]);

  const getPrice = useCallback(
    (symbol: string): number => {
      return prices[symbol]?.price ?? 0;
    },
    [prices],
  );

  const getPriceChange = useCallback(
    (symbol: string): number => {
      return prices[symbol]?.change24h ?? 0;
    },
    [prices],
  );

  const getPriceHistory = useCallback(
    (symbol: string): PriceHistory[] => {
      return priceHistory[symbol] ?? [];
    },
    [priceHistory],
  );

  return {
    prices,
    priceHistory,
    getPrice,
    getPriceChange,
    getPriceHistory,
  };
};
