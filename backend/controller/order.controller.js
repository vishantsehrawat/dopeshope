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
