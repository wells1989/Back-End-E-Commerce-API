const {Order} = require('../models/order');
const express = require('express');
const {OrderItem} = require('../models/order-Item');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    // above, populates the user with their name, and sorts it by date ordered (from newest to oldest)

    if(!orderList){
        res.status(500).json({success: false})
    }
    res.send(orderList);
}) 

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category' }
        });
    // above, populates the user with their name, and sorts it by date ordered (from newest to oldest)
    // and populates the orderItems path, and populates each product within that path, and populates each category within each product

    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order);
}) 

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))
    // above, maps over the orderItemsIdsResolved array, populating the product and price, THEN calculates total price and returns it

    const totalPrice = totalPrices.reduce((a,b) => a + b, 0);
    // above, calculates the total of the prices in the totalPrice array (above) so it can be used below...

    console.log(totalPrices)

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
    })
    order = await order.save();

   if(!order) {
    return res.status(404).send('order cannot be created!')
   } 

   res.send(order);
})

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true} // returns the new object, as opposed to the old one
    )
    if(!order) {
        return res.status(404).send('order cannot be updated!')
       } 
    
       res.send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
        // above, if there is an order, loop over the order items, and for each one we delete it
            return res.status(200).json({success: true, message: 'the order has been deleted'})
        } else {
            return res.status(404).json({success: false, message: 'order not found'})
        }
    }).catch(err => { 
        return res.status(500).json({success: false, error: err})
    })
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum : '$totalPrice'}} }
    ])
    // above, takes the aggregate of the Order(s), then groups then, with totalsales being the sum of the totalPrice element of each order
    // NOTE above, need it as mongoose cannot return an object without an id / object id

    if (!totalSales) {
        return res.status(400).send('Order sales cannot be generated')
    } else {
        res.send({totalsales: totalSales.pop().totalsales})
    }
    // above .pop().totalsales just leaves the total sales, so you don't see the id field
})

router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments();
    // above counts orders, and returns an integer value

    if(!orderCount){
        res.status(500).json({success: false})
    }
    res.send({
        orderCount: orderCount
    });
})  

router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid})
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category' }
        })
    .sort({'dateOrdered': -1});
    // above, finds the orders with the user as the params id, then populates the order items and the products within 

    if(!userOrderList){
        res.status(500).json({success: false})
    }
    res.send(userOrderList);
}) 

module.exports = router;