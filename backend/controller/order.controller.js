// ctrl+ k +0 to fold k + j to unfold
const OrderModel = require("../models/order.model");

// ^Route to get order details by ID
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

// ^Route to get orders by user ID
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

// ^Route to update order details
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

// ^ Route to track order status
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

// ^Route to calculate order total price
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
// ^ Route to delete the order
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

// ^Route to place a new order
const placeNewOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while placing the order",
    });
  }
};

// ^Route to get orders
const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while fetching orders",
    });
  }
};

// Route to cancel an order
const cancelOrder = async (req, res) => {
  const orderId = req.params.ID;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.status = "Cancelled";
    await order.save();
    return res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while cancelling the order",
    });
  }
};

// Admin accessible route to get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while fetching all orders",
    });
  }
};

// ?Admin accessible route to change order status
const changeOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { newStatus } = req.body;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.status = newStatus;
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating order status",
    });
  }
};
// ^Route to add products to an order
const addProductsToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { products } = req.body;

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    order.products.push(...products);

    const totalPrice = order.products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    order.totalPrice = totalPrice;

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Products added to order successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while adding products to the order",
    });
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
