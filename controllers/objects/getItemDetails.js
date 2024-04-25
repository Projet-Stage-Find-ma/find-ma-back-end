import dotenv from 'dotenv'

import db from '../../databaseConnection.js';
dotenv.config();


const getItemDetails = async (req,res) =>
{
    try{
        const id = req.params.id;
       
       console.log(id)

        const sql = 'select * from objects where id = ?';
        const [row] = await db.query(sql,[id]);

        res.json(row);
        

    }
    catch(error)
    {
        console.log(error);
    }
}

export default getItemDetails;