import db from "../../databaseConnection.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();



const updateObject = async (req,res) =>
{

    const authHeader = req.headers["authorization"]; 
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    const token = authHeader.split(' ')[1]; 

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err)=>{
        if(err){
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }

        
        try
        {
            const dataToSend = req.body;
            
            const {details,category,subCategory,city,id} = dataToSend;
            const JsonDetails = JSON.stringify(details);
            const imagePath = req.file ? req.file.path : dataToSend.image;
            
             const sql = 'update objects set details = ?, category = ? ,subCategory = ? ,city = ? ,image = ? where id = ?'
             const values = [JsonDetails,category,subCategory,city,imagePath,id];
             const [result] = await db.query(sql,values);
             res.json({message:"Object has been modified"})
        }   
        catch(err)
        {
            console.error(err);
            res.status(500).json({message:"Error modifying your Object"})
        }
    })


}

export default updateObject;