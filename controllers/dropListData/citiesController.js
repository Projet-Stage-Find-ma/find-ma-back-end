


import db from "../../databaseConnection.js";


const citiesList = async(req,res) =>
{


    try{

        let citiesList = [];
        const sql = 'select city from cities';

        const [row] = await db.query(sql);

        row.map( x => citiesList.push(x.city));

        res.json(citiesList);

    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"No data was found"})
    }
}

export default citiesList;