
import db from "../../databaseConnection.js";

const subCategoriesList = async (req,res) =>
{
    const {category} = req.params;

    try{
       
        const sql = 'select subCategories from categories where category = ?';
        const values = [category];

        const [rows] = await db.query(sql,values);
        const fetchedSubCategories = rows[0].subCategories;

        
        res.json(fetchedSubCategories);

    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"No data was found"})
    }
}

export default subCategoriesList;