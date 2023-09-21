const Order = require("../models/Order.js");
const User = require("../models/User.js");

const OrderController = {
  async create(req, res) {
    try {
      const order = await Order.create({
        ...req.body,

        status: "pending",
        userId: req.user._id,
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: { orderIds: order._id },
      });

      res.status(201).send(order);
    } catch (error) {
      console.error(error);
    }
  },

  async update(req, res) {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params._id,
        { ...req.body, userId: req.user._id },
        { new: true }
      );
  
      if (!order) {
        
        return res.status(404).send({ message: "Order not found" });
      }  
      
      res.send({ message: "Order successfully updated", order });
    } catch (error) {
      console.error(error);
      
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  

  async delete(req, res) {
    try {
      const deletedOrder = await Order.findByIdAndRemove(req.params._id);

      if (!deletedOrder) {
        return res.status(404).send({ message: "Order not found" });
      }

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { orderIds: req.params._id },
      });

      res.send({ message: "Order successfully deleted", deletedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};

module.exports = OrderController;
