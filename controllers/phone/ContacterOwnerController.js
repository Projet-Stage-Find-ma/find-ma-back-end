import dotenv from 'dotenv';
dotenv.config();

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

const contacterOwner=(req,res)=>{
    console.log(req.body)
    const {email,message,ownerEmail} = req.body
  

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
            <h1>Find.ma message</h1>
            <p>Un utilisateur avec l'adresse email suivante : <span style="font-weight: bold;">${email}</span> vous a envoyé le message suivant : <span style="font-weight: bold;">"${message}"</span>. Vous pouvez le contacter pour plus de détails.</p>

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
           res.json({message:"email a été envoyé avec succés"})
        }
    });

    

}
export default contacterOwner