import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  theme?: "light" | "dark";
  autosize?: boolean;
}

export function TradingViewWidget({ symbol, theme = "dark", autosize = true }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous widget
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Convert symbol format if needed (e.g., EUR/USD -> FX:EURUSD)
    let tvSymbol = symbol;
    if (symbol.includes("/")) {
      tvSymbol = `FX:${symbol.replace("/", "")}`;
    } else if (["AAPL", "MSFT", "GOOGL", "IBM"].includes(symbol)) {
      tvSymbol = `NASDAQ:${symbol}`;
    }

    script.innerHTML = JSON.stringify({
      "autosize": autosize,
      "symbol": tvSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "fr",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    container.current.appendChild(script);
  }, [symbol, theme, autosize]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export function TradingViewMiniChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    let tvSymbol = symbol;
    if (symbol.includes("/")) {
      tvSymbol = `FX:${symbol.replace("/", "")}`;
    }

    script.innerHTML = JSON.stringify({
      "symbol": tvSymbol,
      "width": "100%",
      "height": "100%",
      "locale": "fr",
      "dateRange": "12M",
      "colorTheme": "dark",
      "trendLineColor": "rgba(41, 98, 255, 1)",
      "underLineColor": "rgba(41, 98, 255, 0.3)",
      "underLineBottomColor": "rgba(41, 98, 255, 0)",
      "isAutoScale": false,
      "isReadOnly": false,
      "isTransparent": true,
      "autosize": true,
      "largeChartUrl": ""
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "150px" }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
