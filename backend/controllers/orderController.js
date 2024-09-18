import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// Importing the stripe package to handle the payment processing
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// Function to handle placing a user's order from the fronend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173"
    try {
        // Create a new order model and data from request body 
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        // save the new order to the database
        await newOrder.save()
        // Clear the user's cart data after placing the order
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});
        // Create line items for each product to be passed to the stripe
        const line_items = req.body.items.map((item) => ({
            price_data:{
                currency: "mad",
                product_data:{
                    name: item.name
                },
                unit_amount: item.price*9.74*100
            },
            quantity: item.quantity
        }))
        // Add delivery charges as separate line item
        line_items.push({
            price_data:{
                currency: "mad",
                product_data:{
                    name: "Delivery Charges"
                },
                unit_amount: 2*9.74*100
            },
            quantity: 1
        })
        // Create a new Stripe checkout session with the line items and URLs for success and cancel direction
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        // Send a session URL back to the frontend
        res.json({success:true, session_url:session.url})
    } catch (error) {
        // Log any error that occurs and send a failure response
        console.log(error)
        res.json({success:false, message: "Error when placing the order!"})
    }
}
// Function to verify the status of an order item when processing the order
const verifyOrder = async (req, res) => {
    // Extract the orderId and success status from the request body
    const {orderId, success} = req.body;
    try {
        // If the payment was successful 
        if(success =="true"){
            // Update the order in the database to mark it as paid
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            // Respond with a success message
            res.json({success:true, message:"Paid"})
        }else{
            // If the payment was not successful, delete the order from the database
            await orderModel.findByIdAndDelete(orderId);
            // Response with a failure message
            res.json({success:false, message:"Not Paid"})
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error);
        res.json({success:false, message:"Error!"})
    }
}
// user orders for the frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error!"})
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Failed fetching orders!"})
    }
}

// Function to update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Failed update the status"})
    }
}
export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}