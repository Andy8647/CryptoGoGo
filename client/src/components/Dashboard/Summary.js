import { Result } from 'antd';
import React, { Component } from 'react';

class Summary extends Component {
    state = { 
        cash: '10,000.00',
        marketValue: '3,000.46',
        equity: '13,000.46',
        unrealizedPL: '223.32',
        date: '14:00 PST 29 Oct 2020',
     }


    async componentDidMount() {
        const resuit = await fetch("/api/dashboard/summary")
        const summary = await resuit.json()
        this.setState({
            cash: summary.totalCash,
            marketValue: Math.round(summary.totalMarketValue * 100) / 100,
            equity: Math.round(summary.totalEquity * 100) / 100,
            date: summary.updatedDate,
            unrealizedPL: Math.round(summary.totalPL * 100) / 100
        })
    }

    renderPLValue() {
        if (this.state.unrealizedPL >= 0){
            return <span className='pos-PL-val'> {this.state.unrealizedPL} </span>
        }
        return <span className='neg-PL-val'> {this.state.unrealizedPL} </span>
    }   

    render() { 
        return ( 
            <div className='dashboard-summary'>
                <div>
                    <h3 className='summary-fields'> Summary </h3>
                    <span className='summary-fields'> Last updated: <span className='summary-values'> {this.state.date} </span> </span>
                </div>
                <div className='summary-fields'> TOTAL CASH <span className='summary-values'> {this.state.cash} </span> </div>
                <div className='summary-fields'> TOTAL MARKET VALUE <span className='summary-values'> {this.state.marketValue} </span></div>
                <div className='summary-fields'> TOTAL EQUITY <span className='summary-values'> {this.state.equity} </span></div>
                <div className='summary-fields'> UNREALIZED P&L {this.renderPLValue()} </div>

            </div>
        );
    }
}
 
export default Summary;