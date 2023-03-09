import React, { Component } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import './styles.css'

class Sidebar extends Component {
    state = {
      orderConfig: {
        isLimit: false,
        isStop: false,
        isBracket: false
      },
      search: "",
      assets: [
        {
          symbol: "BTC",
          currentPrice: "1134.23",
          name: "Bitcoin/USD",
          dayPriceChange: "+123",
          dayHigh: 123123,
          dayLow: 123123,
          totalVolume: 123123,
          ath: 123123,
          atl: 123123,
          marketCap: 123123123
        }
      ],
      selectedAsset: "BTC",
      orderError: ""
    }
    sidebarSearchBoxRef = React.createRef();
    orderQuantityRef = React.createRef();
    orderTypeRef = React.createRef();
    orderLimitRef = React.createRef();
    orderStopRef = React.createRef();
    orderDurationRef = React.createRef();
    orderBracketRef = React.createRef();
    orderProfitQtyRef = React.createRef();
    orderProfitLmtRef = React.createRef();
    orderProfitDurRef = React.createRef();
    orderLossQtyRef = React.createRef();
    orderLossStpRef = React.createRef();
    orderLossDurRef = React.createRef();

    componentDidMount() {
      fetch("api/trading/marketData")
      .then((result) => result.json())
      .then((data) => {
        this.setState({assets: data, selectedAsset: data[0].symbol})
      })
    }

    updateSelectedAsset(symbol) {
      this.setState({selectedAsset: symbol});
    }

    generateSideBarLi = () => {
      let display = this.state.assets;
      if (this.state.search != ""){
        display = [];
        for (let i =0; i < this.state.assets.length; i++){
          if (this.state.assets[i].symbol.search(this.state.search.toUpperCase()) != -1){
            display.push(this.state.assets[i]);
          }
        }
      }
      return display.map((assets) => {
        return <li className='trading-side-bar-asset' onClick={()=> {this.updateSelectedAsset(assets.symbol)}}>
              <span className='header'> {assets.symbol} </span> <span className='subheader'> {assets.currentPrice} </span>
              <h6> <span style={{color:"grey"}}> {assets.name}</span> <span style={{color:"green"}}> {this.dayChange} </span> </h6>
        </li>
      })
    }

    updateSelectedOrderType(type) {
      if (type == "market") {
        this.setState({orderConfig: { isLimit: false, isStop: false,
          isBracket: this.state.orderConfig.isBracket}});
      } else if (type == "limit") {
        this.setState({orderConfig: { isLimit: true, isStop: false,
          isBracket: this.state.orderConfig.isBracket}});
      } else {
        this.setState({orderConfig: { isLimit: false, isStop: true,
          isBracket: this.state.orderConfig.isBracket}});
      }
    }

    updateBracketOrderSelect = () => {
      if (this.orderBracketRef.current.checked) {
        this.setState({orderConfig : { isLimit: this.state.orderConfig.isLimit,
          isStop: this.state.orderConfig.isStop,
          isBracket: true}});
      } else {
        this.setState({orderConfig : { isLimit: this.state.orderConfig.isLimit,
          isStop: this.state.orderConfig.isStop,
          isBracket: false}});
      }
    }

    generateOrderLimitStopFields = () => {
      let generate = [];
      if (this.state.orderConfig.isLimit) {
        generate.push(<div className="order-input-field"> Limit: <input type="number" ref={this.orderLimitRef} /> </div>);
      }
      if (this.state.orderConfig.isStop) {
        generate.push(<div className="order-input-field"> Stop: <input type="number" ref={this.orderStopRef} /> </div>);
      }
      return generate;
    }

    generateBracketOrderFields = () => {
      if (this.state.orderConfig.isBracket) {
        return <div className="order-bracket-section">
          <div className="order-input-field"> Profit:  
            <div className="order-input-field"> - Qty: <input type="number" ref={this.orderProfitQtyRef}/></div>
            <div className="order-input-field"> - Lmt: <input type="number" ref={this.orderProfitLmtRef}/> </div>
            <div className="order-input-field"> - Dur: <select ref={this.orderProfitDurRef}> <option value="DAY"> DAY </option> <option value="GTC"> GTC </option></select> </div>
          </div>
          <div className="order-input-field"> Loss: 
            <div className="order-input-field"> - Qty: <input type="number" ref={this.orderLossQtyRef}/></div>
            <div className="order-input-field"> - Stp: <input type="number" ref={this.orderLossStpRef}/> </div>
            <div className="order-input-field"> - Dur: <select ref={this.orderLossDurRef}> <option value="DAY"> DAY </option> <option value="GTC"> GTC </option></select> </div></div>
        </div>
      }
    }

    findAssetInfo(symbol) {
      return this.state.assets.filter((asset) => asset.symbol == symbol)[0]
    }

    async sendOrder(BuySell) {
      const account = this.props.accountNumber
      const mode = BuySell
      const symbol = this.state.selectedAsset.toLowerCase()
      this.props.onOrder();
      // Send server request with information thats is in the input fields

      const reqBody = {
        account: account,
        mode: mode,
        symbol: symbol,
        orderQuantity: Number(this.orderQuantityRef.current.value),
        orderType: this.orderTypeRef.current.value,
        orderLimit: this.orderLimitRef.current == null ? 0: Number(this.orderLimitRef.current.value),
        orderStop: this.orderStopRef.current == null ? 0: Number(this.orderStopRef.current.value),
        orderDuration: this.orderDurationRef.current.value,
        orderBracket: this.orderBracketRef.current.checked,
        orderProfitDur: this.orderProfitDurRef.current == null ? "" : this.orderProfitDurRef.current.value,
        orderProfitLmt: this.orderProfitLmtRef.current == null ? 0: Number(this.orderProfitLmtRef.current.value),
        orderProfitQty: this.orderProfitQtyRef.current == null ? 0: Number(this.orderProfitQtyRef.current.value),
        orderLossQty: this.orderLossQtyRef.current == null ? 0: Number(this.orderLossQtyRef.current.value),
        orderLossStp: this.orderLossStpRef.current == null ? 0: Number(this.orderLossStpRef.current.value),
        orderLossDur: this.orderLossDurRef.current == null ? "" : this.orderLossDurRef.current.value
      }
      const result = await fetch("/api/trading/createOrder", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      })
      if (result.status == 500) {
        this.setState({orderError: "Oops, something went wrong, please check your inputs :("})
      } else if (result.status == 480){
        this.setState({orderError: "Insufficient Funds."})
      } else if (result.status == 481){
        this.setState({orderError: "Not enough positions to sell."})
      }
      this.props.onOrder()
    }

    mapSymbolToChart() {
      return this.state.selectedAsset + "USD"
    }

    generateOrderErrorMessage = () => {
      if (this.state.orderError){
        return (
        <div> <span className="red-error-message"> {this.state.orderError} </span> </div>
        )
      }
    }

    render() { 
        return ( 
      <div className="trading-sidebar-asset-info-section">
        <div className="sidebar">
          <input ref={this.sidebarSearchBoxRef} className='sidebar-search-box' type="text" id="mySearch" placeholder="Search.." onChange={
                                                                         () => this.setState({search: this.sidebarSearchBoxRef.current.value})}/>
          <ul>
            {this.generateSideBarLi()}
          </ul>
        </div>
        <div className="sidebar-margin">
        </div>
        <div className="trading-current-asset-container">
          <TradingViewWidget symbol={this.mapSymbolToChart()} width="850" height="400"/>
        </div>
        <ul className="trading-current-asset-info-conatiner">
          <li className="trading-current-asset-info-field"> Current Price: {this.findAssetInfo(this.state.selectedAsset).currentPrice} </li>
          <li className="trading-current-asset-info-field"> 24hr Price Change: {this.findAssetInfo(this.state.selectedAsset).dayPriceChange} </li>
          <li className="trading-current-asset-info-field"> 24hr High: {this.findAssetInfo(this.state.selectedAsset).dayHigh} </li>
          <li className="trading-current-asset-info-field"> 24hr Low: {this.findAssetInfo(this.state.selectedAsset).dayLow} </li>
          <li className="trading-current-asset-info-field"> Total Volume: {this.findAssetInfo(this.state.selectedAsset).totalVolume} </li>
          <li className="trading-current-asset-info-field"> All Time High: {this.findAssetInfo(this.state.selectedAsset).ath} </li>
          <li className="trading-current-asset-info-field"> All Time Low: {this.findAssetInfo(this.state.selectedAsset).atl} </li>
          <li className="trading-current-asset-info-field"> Market Cap.: {this.findAssetInfo(this.state.selectedAsset).marketCap} </li>
        </ul>
        <div className="trading-order-container">
          <h4> Make Order </h4>
          <div className="order-input-field"> Quantity: <input type="number" ref={this.orderQuantityRef} /> </div>
          <div className="order-input-field">
          Order Type: <select ref={this.orderTypeRef} onChange={() => this.updateSelectedOrderType(this.orderTypeRef.current.value)}>
                        <option value="market"> Market </option>
                        <option value="limit"> Limit </option>
                        <option value="stop"> Stop </option>
                      </select>
          </div>
          {this.generateOrderLimitStopFields()}
          <div className="order-input-field"> Duration: <select ref={this.orderDurationRef} >
                        <option value="DAY"> DAY </option>
                        <option value="GTC"> GTC </option>
                      </select>
          </div>
          <div className="order-bracket-select"> Bracket: <input ref={this.orderBracketRef} type="checkbox" onChange={this.updateBracketOrderSelect}/> </div>
          {this.generateBracketOrderFields()}
          <div>
            <button className="order-button-buy" onClick={() => this.sendOrder("buy")}> Buy </button>
            <button className="order-button-sell" onClick = {() => this.sendOrder("sell")}> Sell </button>
          </div>

          {this.generateOrderErrorMessage()}

        </div>
      </div>
  );    
    }
}
 
 export default Sidebar;
