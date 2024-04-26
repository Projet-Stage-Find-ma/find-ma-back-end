
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import signup from '../controllers/userSignUpController.js';
import login from '../controllers/userLoginController.js';
import addFoundObject from '../controllers/objects/addFoundObjectController.js';
import getImage from '../controllers/testing/getImage.js';
import getPhoneByIMEI from '../controllers/phone/getphonebyIMEIController.js';
import  getphones  from '../controllers/phone/getphonesController.js';
import getUser from '../controllers/UserInfo/getUserController.js';
import updateUser from '../controllers/UserInfo/modifyUserController.js';
import { generateCode, registerOwnership } from '../controllers/phone/generateCodeController.js';
import addphone from '../controllers/phone/addPhoneController.js';
import updatePhone from '../controllers/phone/updatePhoneController.js';
import getSinglePhone from '../controllers/phone/getSinglePhoneController.js';

import verifyIMEI from '../controllers/phone/verificationIMEIController.js';
import contacterOwner from '../controllers/phone/ContacterOwnerController.js';

import getObjects from '../controllers/objects/getAllObjectsController.js';
import { getCategories, getCities,getColors,getPhones } from '../controllers/dropListData/getParametres.js';
import deletePhone from '../controllers/phone/deletePhoneController.js';

import getItemDetails from '../controllers/objects/getItemDetails.js';



//Multer config
const storage = multer.diskStorage({
    destination: function(req,file,cb)
    {
      cb(null,'uploads')
    },
    filename: function(req,file,cb)
    {
      cb(null, '/' +Date.now() + "-" + file.originalname);
    }
  })
  
const upload = multer({storage:storage})


dotenv.config();
const router = express.Router();


router.post('/signUp',signup);
router.post('/login',login);


router.get('/data/parametres/categories',getCategories)
router.get('/data/parametres/cities',getCities)
router.get('/data/parametres/phones',getPhones)
router.get('/data/parametres/colors',getColors)


router.post("/data/createFoundObject",upload.single('image'),addFoundObject);

//Testing routes
router.get('/data/image',getImage)



//Phone Routes
// router.post("/getPhoneByIMEI",getPhoneByIMEI);
router.post("/getPhoneByIMEI",getPhoneByIMEI);
router.get("/getphones",getphones);
router.post("/addphone",addphone);
router.post("/updatePhone/:id",updatePhone);
router.get("/getSinglephone/:id",getSinglePhone)
router.post("/verifyIMEI",verifyIMEI);
router.post("/contacterOwner",contacterOwner)
router.delete("/deletePhone/:id",deletePhone);
//User Routes
router.get("/getuser",getUser)
router.post('/updateUser',updateUser)

//BlockChaine
router.post("/generateCode",generateCode);
router.post("/buyphone",registerOwnership)



//Fetching Objects
router.get('/data/Objects',getObjects)
router.get('/data/ObjectDetails/:id',getItemDetails)





export default router;