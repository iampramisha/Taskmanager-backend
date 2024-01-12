const express=require('express');
const User=require('../models/User')
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
router.get('/', (req,res)=>{
    res.send('Hello from user routes');
})
router.post('/register', async(req,res)=>{
    console.log('Reached /register route');
const {name,email,password}=req.body;
try{
    const user=new User({name,email,password});
    await user.save();
    res.status(201).send({user,message: "user created successfully"})
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(400).send({ error: err.message || 'Error creating user' });
    }
});



router.post('/login', async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            throw new Error ('unable to login,invalid credentials');
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new Error('Unable to login, invalid credentials');
        }
        const token=jwt.sign({
            _id: user._id.toString()
        },process.env.JWT_SECRET_KEY);
        res.send({user,token, message: "logged in successfully"});
    }
    catch(err){
        res.status(400).send({error: err})
    }
})

module.exports=router;