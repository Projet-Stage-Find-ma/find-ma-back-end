

import db from "../../databaseConnection.js";


const categoriesList = async(req,res) =>
{


    try{

        let categoriesList = [];
        const sql = 'select category from categories';

        const [row] = await db.query(sql);
        
        

        row.map((x) =>  categoriesList.push(x.category))

        
        res.json(categoriesList);

    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"No data was found"})
    }
}

export default categoriesList;