const express = require('express');
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require ("../models/Product");
const Order = require("../models/Order");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/checkout
//@desc Create a new checkout session
//@access Private
router.post("/", protect, async (req, res) => {
  const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;

  if(!checkoutItems || checkoutItems.length === 0){
    return res.status(400).json({ message: "No Items in checkout"})
  }
  try{
    //Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout)

  } catch(error){
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
} )

//@route PUT /api/checkout/:id/pay
//@desc Update checkout to mark as paid after successful payment
//@access Private

router.put("/:id/pay", protect, async(req,res) => {
  const {paymentStatus, paymentDetails} = req.body;

  try{
    const checkout = await Checkout.findById(req.params.id);

    if(!checkout) {
      return res.status(404).json({message: "Checkout Not Found"})
    }

    if(paymentStatus.toLowerCase() === "paid"){
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus.toLowerCase();
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
    
      await checkout.save();
    
      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({message: "Invalid Payment Status"});
    }

  } catch(error) {
    console.log(error);
    res.status(500).json({message: "Server Error"});
  }
})

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert to an order after payment conformination
//@access Private

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    console.log("📥 Received finalize request for:", req.params.id);

    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      console.log("❌ Checkout not found");
      return res.status(404).json({ message: "Checkout Not Found" });
    }

    console.log("🧾 Checkout state:", {
      isPaid: checkout.isPaid,
      isFinalized: checkout.isFinalized,
    });

    if (checkout.isPaid && !checkout.isFinalized) {
      // ✅ Create a final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: checkout.paymentStatus,
        paymentDetails: checkout.paymentDetails,
      });

      // ✅ Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // ✅ Clear the user's cart
      await Cart.findOneAndDelete({ user: checkout.user });

      console.log("✅ Final order created successfully:", finalOrder._id);
      return res.status(201).json(finalOrder);
    } else {
      console.warn("⚠️ Checkout is not paid or already finalized");
      return res.status(400).json({ message: "Checkout is not paid or already finalized" });
    }
  } catch (error) {
    console.error("❌ Error finalizing checkout:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;




