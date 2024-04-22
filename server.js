import express from 'express';

import cors from 'cors';


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';



import signup from './controllers/userSignUpController.js';
import login from './controllers/userLoginController.js';
import categoriesList from './controllers/dropListData/categoryController.js';
import subCategoriesList from './controllers/dropListData/subCategoryController.js';
import citiesList from './controllers/dropListData/citiesController.js';
import addFoundObject from './controllers/objects/addFoundObjectController.js';
import getImage from './controllers/testing/getImage.js';


import multer from "multer";
import path from 'path';
import router from './routes/routes.js';




dotenv.config();


const PORT = 3002;


const app = express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api',router)


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });



