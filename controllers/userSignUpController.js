import bcrypt from 'bcrypt';
import db from '../databaseConnection.js';


import dotenv from 'dotenv';
dotenv.config();





 const signup =  async (req,res) =>
{
        const {nom,prenom,email,password} = req.body;
        const saltRounds = 10;
   

        try
        {
                const hashedPassowrd = await bcrypt.hash(password,saltRounds);

                const sql = 'INSERT INTO users(nom,prenom,email,password) VALUES (?,?,?,?)';
                const values = [nom,prenom,email,hashedPassowrd];

                const [result] = await db.query(sql,values);


                res.json({message:"User created successfully",data:result});
        }
        catch(err){
                console.error(err);
                res.status(500).json({message:'Error creating user'});
        }


}

export default signup;


