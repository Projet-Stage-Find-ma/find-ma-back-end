import db from "../../databaseConnection.js";


const getCategories = async (req,res) =>
{

    try
    {
        const sql = 'Select label,options from parametres where ParentCategory = ?'
        
        const [data] = await db.query(sql,"Categories");

        console.log(data);
        res.json(data)
    }   
    catch(error)
    {
        console.error(error);
    }

}

const getCities = async(req,res) =>
{
    try 
    {
        const sql = 'Select options from parametres where label = ?';
        const [[{options}]] = await db.query(sql,"Cities");
        console.log(options);
        res.json(options);
    }   
    catch(error)
    {
        console.error(error)
    }
}
const getPhones= async(req,res)=>{
    try{
        const sql = 'Select label,options from parametres where ParentCategory = ?'
        
        const [data] = await db.query(sql,"Phones");

       
        res.json(data)

    }catch(error){
        console.error(error)
    }

}
export{getCategories,getCities,getPhones};



