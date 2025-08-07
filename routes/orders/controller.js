const orderModel = require("./model");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.createOrder = async (req, res) => {
  try {
    const { productId, userId, orderStatus } = req.body;
    const order = new orderModel({
      productId,
      userId,
      orderStatus,
    });
    await order.save();
    res
      .status(201)
      .json({ response: true, message: "Order Placed Successfully!" });
  } catch (err) {
    res.status(500).json({ response: false, error: err.message });
    console.error(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    // Fetch all orders and populate product and user details
    const orders = await orderModel
      .find()
      .populate("productId") // Populate product details
      .populate("userId"); // Populate user details with selected fields

    // Transform response data
    const detailedOrders = orders.map((order) => ({
      _id: order._id,
      user: order.userId ? order.userId : null,
      products: order.productId.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        productImage: product.productImage,
      })),
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json({
      response: true,
      data: detailedOrders,
      message: "Orders Details Fetched!",
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { orderStatus });
    res
      .status(200)
      .json({ response: true, message: "Order Status Updated Successfully!" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ response: false, error: error.message });
  }
};

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
};

exports.getOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch all orders and populate product and user details
    const orders = await orderModel
      .find()
      .populate("productId") // Populate product details
      .populate("userId"); // Populate user details with selected fields
    const updatedOrders = orders.filter((item) => item.userId._id == id);
    if (updatedOrders.length <= 0) {
      return res.status(404).json({ response: false, message: "Not Found" });
    }
    res
      .status(200)
      .json({
        response: true,
        data: updatedOrders,
        message: "Fetched Successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, message: error.message });
  }
};
