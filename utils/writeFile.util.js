const fs = require("fs");
const path = require('path');

const writeFile = (req, repository) =>{

  // console.log("request: ", req.files['file']);

  let nomFichier = "";
  if(req.file || req.files['file']){

    let file = req.file ? req.file : req.files['file'][0];
    // console.log("mba tafiditra ato v aloha?");

    const { originalname, buffer } = file;
    const extension = path.extname(originalname);
    const basename = path.basename(originalname, extension);
    nomFichier = `${basename} - ${Date.now()}`+extension;

    const filePath = `./public/${repository}/${nomFichier}`;

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("File uploaded successfully");
      }
    });

  }
  return nomFichier;
}

module.exports = writeFile;