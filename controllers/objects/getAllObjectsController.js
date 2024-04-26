import dotenv from 'dotenv'

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken'


dotenv.config();

const getObjects = async(req,res) =>
{
    try{
        const sql = "Select * from objects order by creation_date desc ";
        const [row] = await db.query(sql);
      
        res.status(200).json(row);
    }
    catch(error)
    {
        console.error('Error fetching Objects',error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export default getObjects;