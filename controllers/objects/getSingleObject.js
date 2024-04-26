import getUserIdFromToken from '../../function.js';

import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

const getSingleObject=(req,res)=>{
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1];

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err)=>{
        if(err){
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        const objectId = req.params.id;
        try{
            console.log(objectId)
            const sql="SELECT * FROM objects WHERE id = ?";
            const [result]=await db.query(sql,[objectId]);
           
            res.status(200).json(result[0]);
        }catch(error){
            console.error('Error executing SQL query:', error);
          res.status(500).json({ message: 'Internal server error.' });
        }
    
    })
}

export default getSingleObject;