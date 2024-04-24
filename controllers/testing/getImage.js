import db from "../../databaseConnection.js";



const getImage = async(req,res) =>
{


    try
    {
        const sql = 'select * from objects where id = 26';
        const [row] = await db.query(sql);
        const imagePath = row[0].image; // Assuming the image path is stored in the 'image' field
        const imageUrl = `http://localhost:3002/${imagePath.replace(/\\/g, '/')}`;

        console.log(imageUrl);
        res.json(imageUrl);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"No data was found"})
    }

}

export default getImage;
