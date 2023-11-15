const express = require("express");
const { jwtAuth } = require("../middlewares/authMiddleware");
const {
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
} = require("../controller/order.controller");

const orderRouter = express.Router();

// Route to place a new order
orderRouter.post("/placeNewOrder", jwtAuth, placeNewOrder);

// Route to get orders
orderRouter.get("/getOrders", jwtAuth, getOrders);

// Route to cancel an order
orderRouter.delete("/cancelOrder/:id", jwtAuth, cancelOrder);

// Admin accessible route to get all orders
orderRouter.get("/getAllOrders", jwtAuth, getAllOrders);

// Admin accessible route to change order status
orderRouter.patch("/updateOrderStatus/:id", jwtAuth, changeOrderStatus);

// Route to get order details by ID
orderRouter.get("/:orderId", jwtAuth, getOrderById);

// Route to get orders by user ID
orderRouter.get("/user/:userId", jwtAuth, getOrdersByUser);

// Route to update order details
orderRouter.put("/:orderId/update", jwtAuth, updateOrderDetails);

// Route to track order status
orderRouter.get("/:orderId/track", jwtAuth, trackOrderStatus);

// Route to calculate order total price
orderRouter.get("/:orderId/totalPrice", jwtAuth, calculateOrderTotalPrice);

// Route to handle order payments
orderRouter.post("/:orderId/pay", jwtAuth, handleOrderPayments);

// Admin accessible route to delete order
orderRouter.delete("/:orderId", jwtAuth, deleteOrder);

module.exports = { orderRouter };
