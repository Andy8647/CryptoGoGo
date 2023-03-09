import React, { Component } from 'react';
import Navbar from "../Navbar/index";
import AccountBalance from './AccountBalance';
import AccountOrders from './AccountOrders';
import "./styles.css";
import Sidebar from "./Sidebar"

class Trading extends Component {
    state = { 
        accounts: ["10000000", "10000001", "10000003"],
        currentAccount: "10000000",
        updatedTimestamp: "100000"
    }

    accountSelector = React.createRef();

    async componentDidMount() {
        const results = await fetch("/api/accounts")
        const accounts = await results.json()
        let accountIds = []
        accounts.map((acc) => {
            accountIds.push(acc._id)
        })
        this.setState({accounts: accountIds, currentAccount: accountIds[0], updatedTimestamp: Date.now()})
        const varID = setInterval(()=>{this.setState({updatedTimestamp: Date.now()})}, 5000) // periodically pull from server to check on orders
        this.setState({varID:varID})
    }

    componentWillUnmount() {
        clearInterval(this.state.idVar);
    }

    updateAccount = () => {
        this.setState({updatedTimestamp: Date.now()});
        // done server calls too accounts
    }



    handleAccountSelectChange = () => {
        this.setState({currentAccount: this.accountSelector.current.value});
    }

    render() { 
        return ( 
                <div>
                    <Sidebar accountNumber={this.state.currentAccount} onOrder={this.updateAccount} />
                    <div className="trading-asset-info-section-container">
                        
                    </div>
                    <div className="trading-account-info-section-container">
                        <div>
                            <span id="trading-account-info-section-header"> My Account </span>
                            <div className="trading-account-list-container">
                                Select Account: 
                                <select ref={this.accountSelector} id="trading-account-list" onChange={this.handleAccountSelectChange}>
                                {this.state.accounts.map((accountNumber)=> <option value={accountNumber}> {accountNumber} </option>)}
                                </select>
                            </div>
                        </div>
                        <AccountBalance accountNumber={this.state.currentAccount} updatedTime={this.state.updatedTimestamp}/>
                        <AccountOrders accountNumber={this.state.currentAccount} updatedTime={this.state.updatedTimestamp}/>
                    </div>
                </div>
                );
    }
}
 
export default Trading;