import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

import getUserIdFromToken from '../../function.js';



const updateUser = (req, res) => {
    const authHeader = req.headers["authorization"]; 
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        
        const userId = getUserIdFromToken(token);
       
        try
        {
            
            const { nom,prenom,email } = req.body;
            console.log(nom);
            const sql = `
                UPDATE users 
                SET nom = ?, prenom = ?, email = ? 
                WHERE id = ?
            `;
            const [row] = await db.query(sql, [nom, prenom, email, userId]);
            console.log(row);
            res.json({message:"l'utilisateur a été modifié avec succés"})
        }
        catch(error)
        {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ message: 'ces informations que vous essayer de modifier sont déjà existés' });
        }

       
    });
};

export default updateUser;