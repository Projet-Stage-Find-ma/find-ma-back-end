import getUserIdFromToken from '../../function.js';

import dotenv from 'dotenv';
dotenv.config();

import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const verifyIMEI=(req,res)=>{
    const authHeader = req.headers["authorization"]; 
    const {imei}=req.body
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const token = authHeader.split(' ')[1]; 
     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        }
        
        try {
            const VerifyImeiSQL = "select * from phones where imei1 = ? or imei2 = ?";
            const [verificationResult]=await db.query(VerifyImeiSQL,[imei,imei])
           if(verificationResult.length===0)
           {
            res.json({message:" Le numéro IMEI que vous avez saisi ne correspond pas à un téléphone répertorié dans notre application. Veuillez vérifier avec le vendeur",exist:false})
           }
           else{
                if(verificationResult[0].status==="perdu" || verificationResult[0].status==="vole")
                
               { 
                const ownerId = verificationResult[0].owner;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const dateTime = new Date();

            const emailQuery = "SELECT email FROM users WHERE id = ?";
            const [emailQueryResult] = await db.query(emailQuery,[ownerId]);
            try{
                if(emailQueryResult.length > 0)
                {
                   const ownerEmail = emailQueryResult[0].email;

                   const mailOptions = {
                       from: process.env.EMAIL_USER,
                       to: ownerEmail,
                       subject: 'Your phone has been searched',
                       html: `
                           
                       <!DOCTYPE html>
                       <html lang="en">
                       <head>
                         <meta charset="UTF-8">
                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
                         <title>Find.ma Alert</title>
                         <style>
                           /* Global Styles */
                           body {
                             font-family: Arial, sans-serif;
                             background-color: #f4f4f4;
                             margin: 0;
                             padding: 0;
                           }
                           .container {
                             max-width: 600px;
                             margin: 20px auto;
                             padding: 20px;
                             background-color: #ffffff;
                             border-radius: 10px;
                             box-shadow: 0 0 10px rgba(0,0,0,0.1);
                           }
                           h1 {
                             color: #333333;
                             text-align: center;
                           }
                           p {
                             color: #666666;
                             line-height: 1.6;

                           }
                           /* Button Styles */
                           .btn {
                             display: inline-block;
                             background-color: #007bff;
                             color: #ffffff;
                             text-decoration: none;
                             padding: 10px 20px;
                             border-radius: 5px;
                           }
                           .btn:hover {
                             background-color: #0056b3;
                           }
                         </style>
                       </head>
                       <body>
                         <div class="container">
                           <img src="cid:unique@headerimage" style="width:100%;" />
                           <h1>Find.ma avertissement</h1>
                           <p>Votre téléphone avec l'IMEI ${imei} a été essayé d'être acheté. L'essai a été effectuée depuis l'adresse IP ${ip} le ${dateTime}.</p>
                         </div>
                       </body>
                       </html>
                       
                       
                       `,
                       attachments: [{
                           filename: 'logo.png',
                           path: 'E:/Projet-Find-ma/find-ma-back-end/media/logo.png', 
                           cid: 'unique@headerimage'
                       }]
                   };

                   transporter.sendMail(mailOptions, (error, info) => {
                       if (error) {
                           console.error('Error sending email:', error);
                       } else {
                           console.log('Email sent:', info.response);
                       }
                   });


                   
                } 
                else {
                   console.error('Owner not found with ID:', ownerId);
               }
               res.json({exist:true,message:"Vous ne pouvez pas acheter ce téléphone car il est perdu ou volé"})

           }
           catch(err)
           {
               console.error('Error executing SQL query:', err);
               return res.status(500).json({ message: 'Internal server error.' });
           }
       
                
                
                
                
               
            
            
            } 
                
                
                else
                {
                    res.json({exist:true})
                }
            
            }

           
           
        } catch (error) {
            console.error("Error generating code:", error);
            res.status(500).json({ message: 'Internal Server Error.' });
        }
    });

}

export default verifyIMEI;