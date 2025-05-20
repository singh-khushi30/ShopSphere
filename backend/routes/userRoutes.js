const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

//Register a new user
router.post('/register', async(req,res) => {
  const {name, email, password} = req.body;

  try{
    //Registration logic
    //Check if user already exists
    let user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: 'User already exists'});
    }
    //Create a new user
    user = new User({name, email, password});
    await user.save();
    
    //Create JWT Payload
    const payload = { user: {id: user._id,role: user.role} };

    //Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET,
      {expiresIn: "3h"},
      (err, token) => {
        if (err) throw err;

        //Send the token and user data in the response
        res.status(201).json({
          user:{
            _id:user._id,
            name:user.name,
            email: user.email,
            role: user.role
          },
          token,
        })
      }
    );

    // res.status(201).json({
    //   user:{
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role
    // }
    // })
    // res.send({name, email, password});
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Server error'});
  }

})

//Login a user
router.post('/login', async(req,res) => {
  const {email, password} = req.body;
  try{

  
  //Find the user by email
  let user = await User.findOne({email});
  if(!user){
    return res.status(400).json({message: 'Invalid credentials'});
  }
  const isMatch = await user.matchPassword(password);

  if(!isMatch){
    return res.status(400).json({message: 'Invalid credentials'});
  }

     //Create JWT Payload
     const payload = { user: {id: user._id,role: user.role} };

     //Sign and return the token along with user data
     jwt.sign(payload, process.env.JWT_SECRET,
       {expiresIn: "3h"},
       (err, token) => {
         if (err) throw err;
 
         //Send the token and user data in the response
         res.json({
           user:{
             _id:user._id,
             name:user.name,
             email: user.email,
             role: user.role
           },
           token,
         })
       }
     );

} catch(err){
  console.error(err);
  res.status(500).json({message: 'Server error'});
}
})

//@route GET api/users/profile
//@desc Get user profile
//@access Private
router.get("/profile", protect, async (req,res) => {
  res.json(req.user);

})

module.exports = router;