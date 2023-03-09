import React, { Component } from 'react';

class AccountOrders extends Component {
    state = { 
        orders: []
    }

    async updateState(){
        const resp = await fetch("/api/orders/account/" + this.props.accountNumber)
        const orders = await resp.json()
        let orderState = []
        for (let i = 0; i < orders.length; i++){
            let newOrder = {
                id: orders[i]._id,
                symbol: orders[i].symbol.toUpperCase(),
                status: orders[i].status,
                action: orders[i].mode.toUpperCase(),
                quantity: orders[i].quantity,
                limit: orders[i].limit == 0 ? "--": orders[i].limit,
                stop: orders[i].stop == 0 ? "--": orders[i].stop,
                duration: orders[i].duration,
                type: orders[i].orderType.toUpperCase(),
                timePlaced: orders[i].timePlaced
            }
            orderState.push(newOrder)
        }
        this.setState({orders: orderState})
        console.log(orderState)
    }

    async componentDidMount() {
        // populate state from this.prop.accountNumber via server request
        this.updateState()
    }

    async componentDidUpdate(prevProps, prevState) {
        // populate state from this.props.accountNumber server request
        // This is different from the dashboard page, this will update with a server request
        if (this.props.accountNumber !== prevProps.accountNumber || this.props.updatedTime !== prevProps.updatedTime) {
            this.updateState()
          }
    }

    mapOrdersToTableRow = () => {
        return this.state.orders.map((orderObj) => {
            return <tr>
                        <td> {orderObj.symbol} </td>
                        <td> {orderObj.status} </td>
                        <td> {orderObj.action} </td>
                        <td> {orderObj.quantity} </td>
                        <td> {orderObj.limit} </td>
                        <td> {orderObj.stop} </td>
                        <td> {orderObj.duration} </td>
                        <td> {orderObj.type} </td>
                        <td> {orderObj.timePlaced} </td>
                </tr>
        });
    }

    render() { 
        return ( 
            <div className="trading-account-orders-container">
                <h3> Orders </h3>
                <table className="trading-account-order-balance-table">
                    <tr>
                        <th> Symbol </th>
                        <th> Status </th>
                        <th> Action </th>
                        <th> Qty </th>
                        <th> Limit </th>
                        <th> Stop </th>
                        <th> Duration </th>
                        <th> Type </th>
                        <th> Time Placed </th>
                    </tr>
                    {this.mapOrdersToTableRow()}
                </table>                
            </div>
         );
    }
}
 
export default AccountOrders;