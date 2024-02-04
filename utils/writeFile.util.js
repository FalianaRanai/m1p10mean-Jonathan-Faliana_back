const fs = require("fs");
const path = require('path');

const writeFile = async (req, repository, param = "file") => {
  let nomFichier = "";

  if (req[param] || (req.files && req.files[param] && req.files[param][0])) {
    const file = req[param] || req.files[param][0];
    // console.log(file);

    const { originalname, buffer } = file;
    const extension = path.extname(originalname);
    const basename = path.basename(originalname, extension);
    nomFichier = `${basename} - ${Date.now()}` + extension;

    const filePath = `./public/${repository}/${nomFichier}`;
    console.log(filePath);

    // Utilisez directement le buffer pour écrire le fichier
    fs.writeFileSync(filePath, buffer);

    // Supprimer le fichier temporaire
    if (file.path) {
      fs.unlinkSync(file.path);
    }
  }

  return nomFichier;
};

module.exports = writeFile;
