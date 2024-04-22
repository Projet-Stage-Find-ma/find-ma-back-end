import db from "../../databaseConnection.js";



const getImage = async(req,res) =>
{


    try
    {
        const sql = 'select * from objects where id = 18';
        const [row] = await db.query(sql);
        
        console.log(row[0]);
        res.json(row[0]);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"No data was found"})
    }

}

export default getImage;
