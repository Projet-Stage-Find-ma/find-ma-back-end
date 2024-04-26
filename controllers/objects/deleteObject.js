
import db from "../../databaseConnection.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const deleteObject = async (req,res) =>
{
    try
    {
        
        const Authorization = req.headers["authorization"];
        const token = Authorization.split(" ")[1];

        if(!Authorization)
        {
            return res.status(401).json({message:"Unauthorized"})
        }

        const validation =  jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(validation)
        {
            const objectId = req.params.id
            console.log(objectId);
            const sql = 'delete from objects where id = ?';
            const result = await db.query(sql,[objectId])
            
           res.json({message:"l'objet a été supprimé avec succès"})
        }
        else{
            return  res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
    }
    catch(error)
    {
        console.error(error)
    }
}

export default deleteObject;