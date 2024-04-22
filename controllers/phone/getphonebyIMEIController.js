import dotenv from 'dotenv';
dotenv.config();
import db from '../../databaseConnection.js';
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



const getPhoneByIMEI = async (req, res) => {
    const phoneIMEI = req.body.imei;
   
    

    try
    {
        const sql = "SELECT * FROM phones WHERE imei1 = ? OR imei2 = ?";
        const [row] = await db.query(sql, [phoneIMEI, phoneIMEI]);

       

        const phoneDetails = row[0];
        if (phoneDetails.status === 'perdu' || phoneDetails.status === 'vole')
        {
            const ownerId = phoneDetails.owner;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const dateTime = new Date().toLocaleString();

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
                            
                            <img src="cid:unique@headerimage" style="width:100%;" />
                            <h1>Find.ma Alert</h1>
                            <p>Votre téléphone avec l'IMEI ${phoneIMEI} a été recherché. La recherche a été effectuée depuis l'adresse IP ${ip} le ${dateTime}.</p>

                        `,
                        attachments: [{
                            filename: 'logo.png',
                            path: 'E:/Projet-Find-ma/find-me-back-end/media/logo.png', 
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
            }
            catch(err)
            {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
        }
        res.json(row);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"No data was found"})
    }


    
  
    
};

export default getPhoneByIMEI;