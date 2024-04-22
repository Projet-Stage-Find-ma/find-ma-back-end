import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../databaseConnection.js';

import dotenv from 'dotenv';
dotenv.config();

const login =  async (req,res) =>
{
  const {email,pass} = req.body;
  

  try
  {
    const sql = 'select * from users where email = ?';
    const values = [email];
    
    const [row] = await db.query(sql,values);
    const [user] = row;
    

    
    //checking if the user exists
    if(!user)
    {
      return  res.status(401).json({message:"Invalid credentials"});
    }

    //Password Validation
    const isPasswordValid = await bcrypt.compare(pass,user.password);
    if(!isPasswordValid){
      return res.status(401).json({message:'Invalid credentials'})
    }

    //JWT Token
    const secretKey = process.env.JWT_SECRET_KEY;
    
    const token = jwt.sign({userId:user.id},secretKey,{expiresIn:'1h'});

    
    res.json({message:'Login successful',token})
  }
  catch(err){
    console.error(err);
    res.status(500).json({message:"No user was found"})
  }
}

export default login;