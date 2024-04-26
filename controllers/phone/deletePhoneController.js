import getUserIdFromToken from '../../function.js';

import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

const deletePhone=(req,res)=>{
    const authHeader = req.headers["authorization"]; 
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err)=>{
        if(err)
        {
            return res.status(401).json({message:"Unauthorized. Invalid token."});
        }

        const userId=getUserIdFromToken(token);

        const id=req.params.id;
        
        try {
            const deletePhoneSQL="update phones set deleted = ? where id = ?";
            const [deltePhoneResult]=await db.query(deletePhoneSQL,[true,id]);
            res.json({message:"le téléphone a été bien supprimé"})

        }catch(error){
            console.error("problem en suppression")

        }

    })


}

export default deletePhone;