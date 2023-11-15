// ctrl+ k +0 to fold k + j to unfold
const OrderModel = require("../models/order.model");

// Route to get order details by ID
const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error fetching order details" });
  }
};

// Route to get orders by user ID
const getOrdersByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await OrderModel.find({ user: userId });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error fetching user orders" });
  }
};

// Route to update order details
const updateOrderDetails = async (req, res) => {
  const orderId = req.params.orderId;
  const updatedData = req.body;
  try {
    const order = await OrderModel.findByIdAndUpdate(orderId, updatedData, {
      new: true,
    });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Order details updated", order });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error updating order details" });
  }
};

// Route to track order status
const trackOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, status: order.status });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error fetching order status" });
  }
};

// Route to calculate order total price
const calculateOrderTotalPrice = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const totalPrice = order.products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    return res.status(200).json({ success: true, totalPrice });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error calculating total price" });
  }
};

const handleOrderPayments = async (req, res) => {
  const orderId = req.params.orderId;
  return res.status(501).json({
    success: false,
    message: "Payment handling logic not implemented yet",
  });
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await OrderModel.findByIdAndDelete(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error deleting order" });
  }
};

module.exports = {
  getOrderById,
  getOrdersByUser,
  updateOrderDetails,
  trackOrderStatus,
  calculateOrderTotalPrice,
  handleOrderPayments,
  deleteOrder,
  placeNewOrder,
  getOrders,
  cancelOrder,
  getAllOrders,
  changeOrderStatus,
  addProductsToOrder,
};
