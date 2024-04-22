import db from "../../databaseConnection.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const addFoundObject = (req,res) =>
{
    const dataToSend = req.body;
    const Authorization = req.headers["authorization"];

    if(!Authorization)
    {
        return res.status(401).json({message:"no data recieved"})
    }

    const token = Authorization.split(" ")[1];

    jwt.verify(token,process.env.JWT_SECRET_KEY, async(error) =>
    {
        if(error)
        return res.status(401).json({message:"Unaurized access"})


        try{
            const {details,category,subCategory,city} = dataToSend;
            const JsonDetails = JSON.stringify(details);
            const type = 'found';
    
            const imagePath = req.file.path;
    
            const sql = 'Insert into objects(details,category,subCategory,city,type,image) values (?,?,?,?,?,?)';
            const values = [JsonDetails,category,subCategory,city,type,imagePath];
    
            const [result] = await db.query(sql,values);
            console.log(imagePath);
            res.json({message:"Object has been added"})
    
        }
        catch(err)
        {
            console.error(err);
            res.status(500).json({message:"Error creating found item"})
        }
    })

    
}

export default addFoundObject;