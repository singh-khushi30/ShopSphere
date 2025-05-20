const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");


//@route POST /api/subscribe
//@desc handle newsletter subscription
//@acess Public

router.post("/subscribe", async(req,res) => {
  const {email} = req.body;

  if(!email){
    return res.status(400).json({message: 'Email is Required'});
  }
  try{
    //Check if the email is already subscribed
    let subscriber = await Subscriber.findOne({ email});

    if(subscriber){
      return res.status(400).json({message: "email is already subscribed"});
    }

    //Create a new Subscriber
    subscriber = new Subscriber({ email});
    await subscriber.save();

    res.status(201).json({ message: "Successfully subscribed to the newsletter!"})

  } catch(error){
    console.log(error);
    res.status(500).json({message: "Server Error"});
  }
})

module.exports = router;
