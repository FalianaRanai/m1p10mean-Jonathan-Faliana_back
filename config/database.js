const mongoose = require('mongoose');
require("dotenv").config();

const dbName = "beautysalon";
const URL_MONGO = process.env.URL_MONGO;
const mongoURI = `${URL_MONGO}/${dbName}`;
// console.log(mongoURI);


const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log(`Connected to database: ${dbName}`)
    } catch (err) {
      console.error('Error while connecting to database :', err);
    }
  };
  
module.exports = connectToDatabase;