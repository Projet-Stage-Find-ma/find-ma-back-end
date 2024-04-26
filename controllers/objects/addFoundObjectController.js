import db from "../../databaseConnection.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const addFoundObject = async (req,res) =>
{

    try{
        const dataToSend = req.body;
        
        const {details,category,subCategory,city,type} = dataToSend;
        const JsonDetails = JSON.stringify(details);
        const imagePath = req.file.path;
            

            if(dataToSend.type === 'lost')
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
                        const sql = 'Insert into objects(details,category,subCategory,city,type,image,poster) values (?,?,?,?,?,?,?)';
                        const values = [JsonDetails,category,subCategory,city,type,imagePath,validation.userId];
                        const [result] = await db.query(sql,values);
                        res.json({message:"Object has been added"})
                    }
                    else
                    {
                        return  res.status(401).json({ message: 'Unauthorized. Invalid token.' });
                    }
                
            }
            else
            {
                
                const sql = 'Insert into objects(details,category,subCategory,city,type,image) values (?,?,?,?,?,?)';
                const values = [JsonDetails,category,subCategory,city,type,imagePath];
                const [result] = await db.query(sql,values);
                res.json({message:"Object has been added"})

            }
        }
        catch(err)
        {
            console.error(err);
            res.status(500).json({message:"Error creating found item"})
        }
    

    
}

export default addFoundObject;