import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

import getUserIdFromToken from '../../function.js';

const getUser = (req, res) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        
        const userId=getUserIdFromToken(token)
        const sql = "SELECT nom,prenom,email FROM users WHERE id = ?";

        const [row] = await db.query(sql, [userId]);

        try
        {   
           
            res.status(200).json({row});
        }
        catch(error)
        {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }

        
    });
};

export default getUser;