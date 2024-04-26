import dotenv from 'dotenv'

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken'


dotenv.config();

import getUserIdFromToken from '../../function.js';

 const getUserObjects = (req, res) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        
       try
       {
        const userId = await getUserIdFromToken(token); 
        const sql = "SELECT * FROM objects WHERE poster = ?";

        const [row] = await db.query(sql, [userId]);

        
        res.status(200).json({row});
       }
       catch(error)
       {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal server error.' });
       }

        
    });
};

export default getUserObjects
