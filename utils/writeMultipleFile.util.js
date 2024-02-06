const fs = require("fs");
const path = require("path");

const writeFile = async (req, repository, param = "files") => {
  let nomsFichiers = [];

  if ((req.files && req.files[param]) || req[param]) {
    const files = req.files[param] || req[param];
    // console.log("eto...", files);

    for (let i = 0; i < files.length; i++) {
      // console.log("tsy tonfa eto akory?");
      const file = files[i];
      const { originalname, buffer } = file;
      const extension = path.extname(originalname);
      const basename = path.basename(originalname, extension);
      let nomFichier = `${basename} - ${Date.now()}` + extension;
      console.log(nomFichier);
      nomsFichiers.push(nomFichier);
      const filePath = `./public/${repository}/${nomFichier}`;

      // Utilisez directement le buffer pour écrire le fichier
      fs.writeFileSync(filePath, buffer);

      // Supprimer le fichier temporaire
      if (file.path) {
        fs.unlinkSync(file.path);
      }
    }

  }
  return nomsFichiers;
};

module.exports = writeFile;
