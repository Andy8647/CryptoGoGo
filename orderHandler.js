// import the models
const { Account } = require('./models/accounts')
const { Position } = require('./models/positions')
const { Order } = require('./models/orders')
const { Activity } = require('./models/activities')
let supportedCurrencies = require('./marketData')



async function executeOrder(order) {
    price = supportedCurrencies.find((coin) => {return coin.symbol == order.symbol}).currentPrice
    let account  = await Account.findOne({creator: order.creator, _id: order.account})
    if (!account){
        order.status = 'Failed'
        await order.save()
        return
    }
    let position = await Position.findOne({creator: order.creator, account: order.account, symbol: order.symbol})
    const orderValue = order.quantity * price

    if (order.mode.toLowerCase() == 'buy'){
        // Check existing position
        if (account.cash + order.cashOnHold - orderValue < 0){

            let atvt = new Activity({
                creator: order.creator,
                timestamp: Date.now(),
                type: 'trading',
                content: `Order execution of ${order.quantity} ${order.symbol.toUpperCase()} at ${price} failed due to incifficient funds`,
            })
            await atvt.save()
            order.status = 'Failed'
            await order.save()
            return
        }
        account.cash = account.cash + order.cashOnHold - orderValue
        await account.save()
        if (position) { // add to position
            position.quantity = position.quantity + order.quantity
            position.bookValue = position.bookValue + orderValue
            position.avgPrice = position.bookValue / position.quantity
        }else{
            position = new Position({
                creator: order.creator,
                account: order.account,
                symbol: order.symbol,
                quantity: order.quantity,
                bookValue: orderValue,
                avgPrice: orderValue / order.quantity
            })
        }
        await position.save()
        order.status = "Executed"
        await order.save()

        let atvt = new Activity({
            creator: order.creator,
            timestamp: Date.now(),
            type: 'trading',
            content: `Order - ${order.mode} ${order.quantity} ${order.symbol.toUpperCase()} at ${price} executed successfully`,
        })
        await atvt.save()
    } else if (order.mode.toLowerCase() == 'sell'){
        // position check
        if (!position){
            
            let atvt = new Activity({
                creator: order.creator,
                timestamp: Date.now(),
                type: 'trading',
                content: `Order - ${order.mode} ${order.quantity} ${order.symbol.toUpperCase()} at ${price} failed due to no position avaliable`,
            })
            await atvt.save()
            order.status = 'Failed'
            await order.save()
            return
        } else {
            if (position.quantity < order.quantity){
                           
                let atvt = new Activity({
                    creator: order.creator,
                    timestamp: Date.now(),
                    type: 'trading',
                    content: `Order - ${order.mode} ${order.quantity} ${order.symbol.toUpperCase()} at ${price} failed due to no position avaliable`,
                })
                await atvt.save()
                order.status = 'Failed'
                await order.save()
                return
            }
            position.quantity = position.quantity - order.quantity
            if (position.quantity === 0){
                position.remove()
            }else{
                position.save()
            }
        }
        account.cash = account.cash + orderValue
        await account.save()
        order.status = "Executed"
        await order.save()

        let atvt = new Activity({
            creator: order.creator,
            timestamp: Date.now(),
            type: 'trading',
            content: `Order - ${order.mode} ${order.quantity} ${order.symbol.toUpperCase()} at ${price} executed successfully`,
        })
        await atvt.save()
    }
    // handle any other bracket orders
    const brakets = await Order.find({parentOrder: order._id})
    for (let i = 0; i < brakets.length; i++){
        if (brakets[i].status == 'Pending'){
            brakets[i].status = 'Accepted'
            await brakets[i].save()
        }
    }
    // cancel sibling orders
    const sib = await Order.find({parentOrder: order.parentOrder})
    for (let i = 0; i < sib.length; i++){
        if (sib[i].status == 'Accepted'){
            sib[i].status = 'Cancelled'
            await sib[i].save()
        }
    }
}

async function serverTickOrderHandler() {
    const allOrders = await Order.find({})
    for (let i = 0; i < allOrders.length; i++){
        let curOrder = allOrders[i]
        if (curOrder.status != "Accepted"){
            continue
        }
        marktPrice = supportedCurrencies.find((coin) => {return coin.symbol == curOrder.symbol}).currentPrice
        if (curOrder.orderType.toLowerCase() == "market") {  // execute
            executeOrder(curOrder)
        }else if (curOrder.orderType.toLowerCase() == "limit"){
            if (curOrder.mode.toLowerCase() == 'buy'){
                if (marktPrice <= curOrder.limit){
                    executeOrder(curOrder)
                }
            }else if (curOrder.mode.toLowerCase() == 'sell'){
                if (marktPrice >= curOrder.limit){
                    executeOrder(curOrder)
                }
            }
        }else if (curOrder.orderType.toLowerCase() == "stop"){
            if (curOrder.mode.toLowerCase() == 'buy'){
                if (marktPrice >= curOrder.limit){
                    executeOrder(curOrder)
                }
            }else if (curOrder.mode.toLowerCase() == 'sell'){
                if (marktPrice <= curOrder.limit){
                    executeOrder(curOrder)
                }
            }
        }
    }
}

async function serverDailyOrderExpireHandler () {
    const allOrders = await Order.find({})
    for (let i = 0; i < allOrders.length; i++){
        let curOrder = allOrders[i]
        if (curOrder.status != "Accepted"){
            continue
        }
        if (curOrder.duration.toUpperCase() == "DAY"){
            curOrder.status = "Cancelled"
            curOrder = await curOrder.save()
            let atvt = new Activity({
                creator: curOrder.creator,
                timestamp: Date.now(),
                type: 'trading',
                content: `Order - ${curOrder.mode} ${curOrder.quantity} ${curOrder.symbol.toUpperCase()} expired.`,
            })
            await atvt.save()
        }
    }

}


module.exports = {serverTickOrderHandler, serverDailyOrderExpireHandler}