import getUserIdFromToken from '../../function.js';

import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

const getSinglePhone=(req,res)=>{
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1];

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err)=>{
        if(err){
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        const phoneId = req.params.id;
        try{
            const getPhoneSQL="SELECT * FROM phones WHERE id = ?";
            const [getPhoneResult]=await db.query(getPhoneSQL,[phoneId]);
            res.status(200).json({ phone: getPhoneResult[0] });
        }catch(error){
            console.error('Error executing SQL query:', error);
          res.status(500).json({ message: 'Internal server error.' });
        }
    
    })
}

export default getSinglePhone;