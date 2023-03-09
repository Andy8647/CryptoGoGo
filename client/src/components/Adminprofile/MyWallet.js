import React, { Component } from 'react';
import Navbar from "../Navbar/index";
import './Profile.css';
import Sidebar from './Content'
import Information from './Information'
import Header from './Header'
import { Tag } from 'antd';

class MyWallet extends Component {
    state = {
      accountList: [
        { 
          accountNumber: 10000000,
          cash: 2000,
          marketValue: 123123,
          totoalEquity: 23123
        },
        { 
          accountNumber: 10000001,
          cash: 2000,
          marketValue: 223123,
          totoalEquity: 123123
        },
        { 
          accountNumber: 10000002,
          cash: 2000,
          marketValue: 23123,
          totoalEquity: (77887)
        }
      ]
    }

    async getAccountInfo() {
      let accounts = []
      const resilt = await fetch("/api/accounts")
      const accs = await resilt.json()
      for (let acc of accs){
        const resBal = await fetch("/api/trading/accountCurrentBalance/" + acc._id)
        const balance = await resBal.json()
        accounts.push({
          accountNumber: acc._id,
          cash: Math.round(balance.cash * 100) / 100,
          marketValue: Math.round(balance.marketValue * 100) / 100,
          totoalEquity: Math.round(balance.totalEquity * 100) / 100
        })
        this.setState({accountList: accounts})
      }
    }

    componentDidMount() {
      this.getAccountInfo();
    }

    async handleAddAccount(){
      // server call
      await fetch('/api/accounts', {
        method: 'POST'
      })
      this.getAccountInfo();
    }

    async handleDeleteAccount(account) {
      console.log(account.accountNumber)
      await fetch('/api/accounts/' + account.accountNumber, {
        method: 'DELETE'
      })
      // server call
      this.getAccountInfo();
    }

    renderAccountSection = () => {
      return (
        <div className="profile-account-section">
        <div>
          <span className="profile-account-summary-header"> Accounts </span> 
          <button className="profile-add-account-btn" onClick={() => this.handleAddAccount()}> Add Account</button> 
        </div>
        <table>
          <tbody>
              <tr>
                <th> Account Number </th>
                <th>Cash</th>
                <th>Market Value</th>
                <th>Total Equity</th>
              </tr>
              {this.state.accountList.map((account) => { return (
                  <tr>
                    <td>{account.accountNumber}</td>
                    <td>{account.cash}</td>
                    <td>{account.marketValue}</td>
                    <td>{account.totoalEquity}</td>
                    <td><button className="profile-delete-account-btn" onClick={() => this.handleDeleteAccount(account)}> delete </button></td>
                  </tr>
              )
              })}
          </tbody>
        </table>
        </div>
      )
    }

    render() {
      return (
        <div className="wallet">
        <h2> Summary</h2>
          <table className="wallet-table">
          <tr>
        <th> Cash </th>
        <th> Profit </th>
        <th> Loss </th>
        <th> Currency </th>
        <th> Currency Amount</th>
      </tr>
      <tr>
          <td> 10000.00 </td>
          <td> 300000.00</td>
          <td> 20050.00 </td>
          <td> CAD </td>
          <td> 200.00 </td>
        </tr>

              </table>
              <p> Total Cost Last Week : 3000</p>
              <p> Total profit Last Week : 3000</p>
              <h5> Bitconins </h5>
              <table className="bitcoins-table">
          <tr>
        <th> Type </th>
        <th> Amount </th>
      </tr>
      <tr>
          <td> ETC </td>
          <td> 200 </td>
          </tr>
          <tr>
          <td> BTC </td>
          <td> 300 </td>
        </tr>
        </table>
        {this.renderAccountSection()}
      </div>
      );
  }
}
 
export default MyWallet;