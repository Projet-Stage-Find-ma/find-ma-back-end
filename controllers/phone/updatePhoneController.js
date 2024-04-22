import getUserIdFromToken from '../../function.js';

import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

const updatePhone=(req,res)=>{
    const authHeader = req.headers["authorization"]; 
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    const token = authHeader.split(' ')[1]; 

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err)=>{
        if(err){
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }

        const userId = getUserIdFromToken(token);
       
        const { imei1, imei2, serialNumber, brand, model, color, tel1, tel2, email, status } = req.body;
try{
    const updatePhoneSQL=`
    UPDATE phones 
    SET imei1 = ?, imei2 = ?, serialNumber = ?, brand = ?, model = ?, color = ?, status = ?, tel1 = ?, tel2 = ?, email = ? 
    WHERE id = ? AND owner = ?
`;
const [updatePhoneResult]=await db.query(updatePhoneSQL,[imei1, imei2, serialNumber, brand, model, color, status, tel1, tel2, email, req.params.id, userId])
if(updatePhoneResult.affectedRows===0)
{
     res.status(404).json({ message: "Il y'a un probléme lors de modification" });
}
else {
   res.status(200).json({ message: 'le téléphone a été modifié avec succés' });
}
}catch(error)
{
    console.error('Error executing SQL query:', error);
    res.status(500).json({ message: 'ces informations que vous essayer de modifier sont déjà existés' });
}
        

    })

}

export default updatePhone;