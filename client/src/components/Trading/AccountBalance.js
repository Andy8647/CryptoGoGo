import React, { Component } from 'react';

class AccountBalance extends Component {
    state = { 
        balance:{
            cash: 0,
            marketValue: 0,
            totalEquity: 0,
            maintenanceExcess: 0,
            buyingPower: 0
        },
        positions:[]
     }

    async updateAccountBalance() {
        try {
            const resBal = await fetch("/api/trading/accountCurrentBalance/" + this.props.accountNumber)
            const newBalance = await resBal.json()
            const resPos = await fetch("/api/trading/accountCurrentPositions/" + this.props.accountNumber)
            const newPositions = await resPos.json()
            this.setState({balance: newBalance, positions: newPositions})
        } catch (error){
            console.log("g")
        }
    }


    async componentDidMount() {
        await this.updateAccountBalance()
    }

    async componentDidUpdate(prevProps, prevState) {
        // populate state from this.props.accountNumber server request
        // This is different from the dashboard page, this will update with a server request
        if (this.props.accountNumber !== prevProps.accountNumber || this.props.updatedTime !== prevProps.updatedTime) {
            await this.updateAccountBalance()
          }
    }

    mapPositionsToTableRows= () => {
        return this.state.positions.map((position) => {
            let plClass = "pos-PL-val";
            if (position.openPL < 0){
                plClass = "neg-PL-val"
            }
            return <tr>
                        <td> {position.symbol.toUpperCase()} </td>
                        <td> {position.quantity} </td>
                        <td> {Math.round(position.avgPrice * 10000)/10000} </td>
                        <td> {Math.round(position.bookValue * 100)/100} </td>
                        <td> {Math.round(position.marketValue * 100)/100} </td>
                        <td> <span className={plClass}> {Math.round(position.openPL * 100)/100} </span> </td>
                    </tr>
        });
    }

    render() { 
        return (
            <div className='trading-account-balance'>
                <div className="trading-current-balance-container">
                    <h3> Current Balances </h3>
                    <table className="trading-account-balance-table-current">
                        <tr>
                            <td> <span className="balance-label"> Cash: </span>  </td>
                            <td> {Math.round(this.state.balance.cash * 100) / 100} </td>
                        </tr>
                        <tr>
                            <td> <span className="balance-label"> MarketValue: </span> </td>
                            <td> {Math.round(this.state.balance.marketValue * 100) / 100} </td>
                        </tr>
                        <tr>
                            <td> <span className="balance-label"> Total Equity: </span> </td>
                            <td> {Math.round(this.state.balance.totalEquity * 100)/ 100} </td>
                        </tr>
                        <tr>
                            <td> <span className="balance-label"> Maintenance Excess: </span> </td>
                            <td> {Math.round(this.state.balance.maintenanceExcess * 100)/ 100} </td>
                        </tr>
                        <tr>
                            <td> <span className="balance-label"> Buying Power: </span> </td>
                            <td> {Math.round(this.state.balance.buyingPower * 100)/ 100} </td>
                        </tr>
                    </table>
                </div>
                <div className="trading-positions-container">
                    <h3> Positions </h3>
                    <table className="trading-account-balance-table">
                        <tr>
                            <th> Symbol</th>
                            <th> Quantity </th>
                            <th> Avg price </th>
                            <th> Book value</th>
                            <th> Market value </th>
                            <th>Open P&L</th>
                        </tr>
                        {this.mapPositionsToTableRows()}
                    </table>
                </div>

            </div>
          );
    }
}
 
export default AccountBalance;