

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the models
const { Account } = require('../models/accounts')
const { Position } = require('../models/positions')
const { Order } = require('../models/orders')
let supportedCurrencies = require('../marketData')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

// to validate object IDs
const { ObjectID } = require('mongodb');
const { response } = require('express');



// a GET route to get market data for the supported currencies
router.get('/api/trading/marketData', mongoChecker, authenticate, async (req, res) => {
    let prepData = JSON.parse(JSON.stringify(supportedCurrencies)) // deep copy
    for (let i = 0; i < prepData.length; i++){
        prepData[i].symbol = prepData[i].symbol.toUpperCase()
    }
    res.send(prepData)
})

router.get('/api/trading/accountCurrentBalance/:id', mongoChecker, authenticate, async (req, res) => {
    const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
		return; 
	}

	// If id valid, findById
	try {
        const account = await Account.findOne({_id: id, creator: req.user._id})
        let marketValue = 0
		if (!account) {
			res.status(404).send('Resource not found')  // could not find this account
		} else { 
            const accountPositions = await Position.find({account: account._id})
            for (i = 0; i < accountPositions.length; i++){
                const curPrice = supportedCurrencies.find((coin) => coin.symbol == accountPositions[i].symbol).currentPrice
                marketValue += curPrice * accountPositions[i].quantity
            }
            let resp = {
                cash: account.cash,
                marketValue: marketValue,
                totalEquity: account.cash + marketValue,
                maintenanceExcess: account.cash, // Currently no margin or short feature
                buyingPower: account.cash // Currently no margin or short feature
            }
            console.log(resp)
			res.send(resp)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
})


router.get('/api/trading/accountCurrentPositions/:id', mongoChecker, authenticate, async (req, res) => {
    const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
		return; 
	}

	// If id valid, findById
	try {
        const positions = await Position.find({creator: req.user._id, account: id})
        let prepData = JSON.parse(JSON.stringify(positions))
        for (let i = 0; i < prepData.length; i++){
            delete prepData[i]._id
            delete prepData[i].creator
            prepData[i].marketValue = supportedCurrencies.find((coin) => coin.symbol == prepData[i].symbol).currentPrice * prepData[i].quantity
            prepData[i].openPL = prepData[i].marketValue - prepData[i].bookValue
        }
        res.send(prepData)
    } catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
})



// post route for the entire order creation logic
router.post('/api/trading/createOrder', mongoChecker, authenticate, async (req, res) => {
    parrentOrderId = null;
    if (req.body.orderQuantity <= 0){
        response.status(400).send()
        return
    }
    // get Account 
    try {
        const account = await Account.findOne({creator: req.user._id, _id: req.body.account})

        let limit = 0
        let stop = 0
        let price = supportedCurrencies.find((coin) => {return coin.symbol == req.body.symbol}).currentPrice
        let cashOnHold = 0
        if (req.body.orderType == "limit"){
            limit = req.body.orderLimit
            price = limit
        }else if (req.body.orderType == "stop"){
            stop = req.body.orderStop
            price = stop
        }

        if (req.body.mode == 'buy'){
            // price check (cant buy if you dont have money)
            if (price *  req.body.orderQuantity > account.cash){
                res.status(480).send("Insufficient funds")
                return
            }
            cashOnHold = price * req.body.orderQuantity
            account.cash = Math.round((account.cash - price * req.body.orderQuantity)*100)/100
            await account.save()
        } else if (req.body.mode == 'sell'){
            // position check (Cant sell stuff you dont have)
            const position = await Position.findOne({creator: req.user._id, account: req.body.account, symbol: req.body.symbol})
            if (!position || position.quantity < req.body.orderQuantity) {
                res.status(481).send("Not enough positions to sell")
                return
            }
        }
        // new Order
        const order = new Order({
            creator: req.user._id,
            account: req.body.account,
            symbol: req.body.symbol,
            mode: req.body.mode,
            quantity: req.body.orderQuantity,
            orderType: req.body.orderType, 
            limit: limit,
            stop: stop,
            duration: req.body.orderDuration,
            status: "Accepted",
            timePlaced: Date.now(),
            cashOnHold: cashOnHold
        })
        const saved = await order.save()
        console.log(saved, "===============================================================HERE===================")
        parrentOrderId = saved._id
        // Handle Braket order
        if (req.body.orderBracket == true){
            let bracketMode = 'sell'
            let bracketStatus = 'Pending'
            if (req.body.mode == 'buy'){ // Error checks, check if bracket is legitimate
                if (req.body.orderProfitLmt <= req.body.orderLossStp){
                    bracketStatus = 'Failed'
                }
            }else if (req.body.mode == 'buy'){ // Error checks, check if bracket is legitimate
                bracketMode = 'buy'
                if (req.body.orderProfitLmt >= req.body.orderLossStp){
                    bracketStatus = 'Failed'
                }
            }
            //Profit order
            const porder = new Order({
                creator: req.user._id,
                account: req.body.account,
                symbol: req.body.symbol,
                mode: bracketMode,
                quantity: req.body.orderProfitQty,
                orderType: "limit", 
                limit: req.body.orderProfitLmt,
                stop: 0,
                duration: req.body.orderProfitDur,
                status: bracketStatus,
                parentOrder: parrentOrderId,
                timePlaced: Date.now(),
                cashOnHold: 0
            })
            //Loss order 
            const lorder = new Order({
                creator: req.user._id,
                account: req.body.account,
                symbol: req.body.symbol,
                mode: bracketMode,
                quantity: req.body.orderLossQty,
                orderType: "stop", 
                limit: 0,
                stop: req.body.orderLossStp,
                duration: req.body.orderLossDur,
                status: bracketStatus,
                parentOrder: parrentOrderId,
                timePlaced: Date.now(),
                cashOnHold: 0
            })
            await porder.save()
            await lorder.save()
        }

        res.status(200).send("Success")

    } catch (error) {
        console.log(error)
        res.status(500).send("interal server error")
    }
})



// export the router
module.exports = router