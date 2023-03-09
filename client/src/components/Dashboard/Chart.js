import React, { Component } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

class Chart extends Component {
    state = { 
        symbol: 'BTCUSD'
     }
     _ref = React.createRef();

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js'
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
              {
                "description": "",
                "proName": "COINBASE:LTCUSD"
              },
              {
                "description": "",
                "proName": "BITSTAMP:BTCUSD"
              },
              {
                "description": "",
                "proName": "KRAKEN:BCHUSD"
              },
              {
                "description": "",
                "proName": "KRAKEN:ETHUSD"
              },
              {
                "description": "",
                "proName": "BITKUB:BNBTHB"
              }
            ],
            "colorTheme": "light",
            "isTransparent": false,
            "showSymbolLogo": false,
            "largeChartUrl": "",
            "locale": "en",
            "width": 50
          });
        this._ref.current.appendChild(script);
        }



    render() { 
        return (
                <div className='dashboard-main-chart-container'>
                    <div className="tradingview-widget-container" ref={this._ref}>
                        <div className="tradingview-widget-container__widget"></div>
                    
                    </div>
                </div>
                 );
    }
}
 
export default Chart;
