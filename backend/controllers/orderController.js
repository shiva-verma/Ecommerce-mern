const Order = require("../models/orderModel");
const product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//creating new order
exports.newOrder = catchAsyncError(async(req,res,next) =>{
    const {
        shippingInfo,
        orderItems,
        itemsPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice, 
        paymentInfo
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice, 
        paymentInfo,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(200).json({
        success:true,
        order,
    })
});

//get single order
exports.getSingleOrder = catchAsyncError(async(req, res, next) =>{
     const order = await Order.findById(req.params.id).populate("user", "name email");

     if(!order){
        return next(new ErrorHandler("order doesn't exist", 404))
     };

     res.status(200).json({
        success:true,
        order,
     })
});

//get logged in user order
exports.myOrders = catchAsyncError(async(req, res, next) =>{
    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
       success:true,
       orders,
    })
});

//get all order --admin
exports.getAllOrders = catchAsyncError(async(req, res, next) =>{
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) =>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
       success:true,
       orders,
       totalAmount,
    })
});

//update order status --admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found",400))
      }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("you have already delivered this order",400));
    };

    order.orderItems.forEach(async(order) => {
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt= Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
       success:true,
    })
});

async function updateStock(id, quantity){
    const Product = await product.findById(id);

    Product.stock -= quantity;

    await Product.save({validateBeforeSave:false});
};

//delete  order --admin
exports.deleteOrder = catchAsyncError(async(req, res, next) =>{
    const order = await Order.findById(req.params.id);

   if(!order){
     return next(new ErrorHandler("order not found",400))
   }

   await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
       success:true,
       message:"order deleted successfully",
    })
});