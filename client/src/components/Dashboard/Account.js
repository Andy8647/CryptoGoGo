import React, { Component } from 'react';
import { Doughnut } from '@reactchartjs/react-chart.js'

const option = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: "bottom",
      fullWidth: true,
      labels: {
        boxWidth: 10,
        fontSize: 10
      },
      onClick: null
        
    }
}

class Account extends Component {
    state = { 
        accounts: [
          { 
            accountNumber: 10000000,
            holdings: {
              Cash: 20000.00,
              BTC: 22552.00,
              LTC: 112431.00,
              ETH: 15222.12,
              Other: 6123.00
            }
          }
        ],
        currentAccountNumber: 10000000,
        chartData: {
          datasets: [
            {
              data: [10, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',          
                'rgba(255, 99, 132, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(180, 180, 180, 0.9)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',          
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(150, 150, 150, 1)',
              ],
              borderWidth: 2,
            },
          ],
          labels: ['Cash', 'BTC', 'ETH', 'LTC', 'BCH', 'Orange'],
        }
    }
    accountSelector = React.createRef();


    async componentDidMount() {
      // reuqests to populate state
      const result = await fetch("/api/dashboard/accounts")
      const accounts = await result.json()
      this.setState({accounts: accounts, currentAccountNumber: accounts[0].accountNumber}, this.handleAccountChange)
    }


    generateAccountInfo = () => {
      const accountHoldings = this.state.accounts
      .filter((account) => 
          account.accountNumber == this.state.currentAccountNumber
      )[0].holdings;
      let investments = [];
      let values = [];
      let total = 0;
      for (let dat in accountHoldings){
        investments.push(dat);
        values.push(accountHoldings[dat]);
        total = total + accountHoldings[dat];
      }
      return [investments, values, total]
    }


    generateAccountInfoTableRows = () => {
      const currentAccountData = this.generateAccountInfo();
      const investments = currentAccountData[0];
      const value = currentAccountData[1];
      const total = currentAccountData[2];
      let tableRows = [];
      tableRows.push(
        <tr>
          <th> Investment </th>
          <th> % </th>
          <th> Market Value </th>
        </tr>
      );
      for (let i = 0; i < investments.length; i++){
        tableRows.push(
          <tr>
            <td> {investments[i]} </td>
            <td> {Math.round(value[i] / total * 10000) / 100} </td>
            <td> {value[i]} </td>
          </tr>
          );
      }
      tableRows.push(
        <tr>
          <td> Total </td>
          <td> 100 </td>
          <td> {total} </td>
      </tr>
      );
      return <table className="dashboard-account-table"> {tableRows.map(tableRows => tableRows)} </table>;
    }


    handleAccountChange = () => {
      const currentAccountData = this.generateAccountInfo();
      const newLabels = currentAccountData[0];
      const newData = currentAccountData[1];
      const total = currentAccountData[2];
      let percentData = newData.map((data) => Math.round(data / total * 10000) / 100);
      const dataset = Object.assign({}, this.state.chartData.datasets[0], {data: percentData})
      const newChartData = Object.assign({}, this.state.chartData, {labels: newLabels}, {datasets: [dataset]});
      this.setState({chartData: newChartData})
    }


    handleAccountSelectChange = () => {
      this.setState({currentAccountNumber: this.accountSelector.current.value}, 
        this.handleAccountChange);
    }


    render() { 
        return (
            <div className="summary-account">
                <div> 
                  <h3 className="account-title"> Account </h3>
                  <div className="account-list-container">
                    Select Account: 
                    <select ref={this.accountSelector} id="account-list" onChange={this.handleAccountSelectChange}>
                      {this.state.accounts.map((account)=> <option value={account.accountNumber}> {account.accountNumber} </option>)}
                    </select>
                  </div>
                </div>
                <div className="selected-account-chart">
                    <Doughnut data={this.state.chartData} options={option}/>
                </div>
                <div className="account-breakdown">
                  {this.generateAccountInfoTableRows()}

                </div>
            </div>
            );
    }
}
 
export default Account;