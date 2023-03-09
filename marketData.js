// Import coingecko-api
const CoinGecko = require('coingecko-api');
// Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();
// List of supported currencies
let supportedCurrencies = [
    {
        id: "bitcoin",
        name: "",
        symbol: "",
        currentPrice: 0,
        dayPriceChange: 0,
        marketCap: 0,
        totalVolume: 0,
        dayHigh: 0,
        dayLow: 0,
        ath: 0,
        atl: 0,
    },
    {
        id: "ethereum",
        name: "",
        symbol: "",
        currentPrice: 0,
        dayPriceChange: 0,
        marketCap: 0,
        totalVolume: 0,
        dayHigh: 0,
        dayLow: 0,
        ath: 0,
        atl: 0,
    },
    {
        id: "ripple",
        name: "",
        symbol: "",
        currentPrice: 0,
        dayPriceChange: 0,
        marketCap: 0,
        totalVolume: 0,
        dayHigh: 0,
        dayLow: 0,
        ath: 0,
        atl: 0,
    },
    {
        id: "tether",
        name: "",
        symbol: "",
        currentPrice: 0,
        dayPriceChange: 0,
        marketCap: 0,
        totalVolume: 0,
        dayHigh: 0,
        dayLow: 0,
        ath: 0,
        atl: 0,
    },
    {
        id: "bitcoin-cash",
        name: "",
        symbol: "",
        currentPrice: 0,
        dayPriceChange: 0,
        marketCap: 0,
        totalVolume: 0,
        dayHigh: 0,
        dayLow: 0,
        ath: 0,
        atl: 0,
    },
    {
        id: "litecoin",
        name: "",
        symbol: "",
        currentPrice: 0,
        dayPriceChange: 0,
        marketCap: 0,
        totalVolume: 0,
        dayHigh: 0,
        dayLow: 0,
        ath: 0,
        atl: 0,
    }
]

// Make calls
const updateMarketData = async() => {
    let data = await CoinGeckoClient.ping();
    if (data.code === 200){
        const mkConfig = {
            tickers: false, 
            market_data: true,
            community_data: false, 
            developer_data: false, 
            localization: false, 
            sparkline: false
        };
        for (let i = 0; i < supportedCurrencies.length; i++) {
            data = await CoinGeckoClient.coins.fetch(supportedCurrencies[i].id, mkConfig)
            if (data.code === 200) {
                supportedCurrencies[i].name = data.data.name
                supportedCurrencies[i].symbol = data.data.symbol
                const marketData = data.data.market_data
                supportedCurrencies[i].dayPriceChange = marketData.price_change_24h_in_currency.usd
                supportedCurrencies[i].marketCap = marketData.market_cap.usd
                supportedCurrencies[i].totalVolume = marketData.total_volume.usd
                supportedCurrencies[i].dayHigh = marketData.high_24h.usd
                supportedCurrencies[i].dayLow = marketData.low_24h.usd
                supportedCurrencies[i].ath = marketData.ath.usd
                supportedCurrencies[i].atl = marketData.atl.usd
                supportedCurrencies[i].currentPrice = marketData.current_price.usd
                supportedCurrencies[i].serverTick = Date.now()
            } else {
                console.log(`Market Data Fetch Failed For ${supportedCurrencies[i].id}`)
            }

        }
    } else {
        console.log("Market Data Fetch Failed")
    }
};

updateMarketData()
setInterval(updateMarketData, 60000) // MarketData refresh rate. updates every 60 seconds

module.exports = supportedCurrencies;