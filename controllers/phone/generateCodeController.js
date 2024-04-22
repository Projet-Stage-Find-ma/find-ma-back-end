import getUserIdFromToken from '../../function.js';

import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';
import {v4} from 'uuid';



const generateCode = (req, res) => {
    const authHeader = req.headers["authorization"]; 
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    
    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        
        try {
            const code = v4();
            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 1);
            const {phoneID,ownerID}=req.body
            
           try
           {
                const row = await db.query('update sellinglog set token = ? , TokenExpirationDate = ? where owner = ? and phone = ?', [code, expirationTime,ownerID,phoneID]);
                res.json({code});
           }
           catch(error)
           {
                console.error("Error saving code to database:", error);
                res.status(500).json({ message: 'Internal Server Error.' });
           }

           
        } catch (error) {
            console.error("Error generating code:", error);
            res.status(500).json({ message: 'Internal Server Error.' });
        }
    });
};


const registerOwnership = (req, res) => {
    const { code } = req.body;
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];  

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }

        const buyerID = getUserIdFromToken(token); 

        try
        {
            
            const fetchPhoneIDSql = 'SELECT phone,TokenExpirationDate FROM sellinglog WHERE token = ?';
 
            const [fetchPhoneIDResult] = await db.query(fetchPhoneIDSql,[code]);
            
            const expirationDate = fetchPhoneIDResult[0].TokenExpirationDate;
            const phoneID = fetchPhoneIDResult[0].phone;

            if(fetchPhoneIDResult[0].phone === undefined)
            {
                res.json({message:"Ce code n'existe pas"})
            }

            if(expirationDate < new Date())
            {
                res.json({message:"Ce code a expiré"})
                
            }
            else
            {
                //Expiring the token
                const UpdateTokenExpirationDate = 'UPDATE sellinglog set TokenExpirationDate = ? where token = ?';
                const now = new Date();
                const [data] = await db.query(UpdateTokenExpirationDate,[now,code]);

                //Change ownerShip;
                const InsertNewOwnerInLogSQL = 'Insert into sellinglog(owner,phone) values(?,?)'
                const [InsertNewOwnerInLog]  = await db.query(InsertNewOwnerInLogSQL,[buyerID,phoneID]);

                //Update Owner in phone table
                const ChangePhoneOwnerSQL = 'Update phones set owner = ? where id = ?';
                const [ChangePhoneOwner] = await db.query(ChangePhoneOwnerSQL,[buyerID,phoneID]);

                res.json({message:"L'achat de téléphone a été réussi"})
            }
            

            
           
        }
        catch(error)
        {
            console.error("Error getting data")
        }

    })
  


};

export {registerOwnership,generateCode};