const fs = require("fs").promises;

const deleteFile = async (repository, data) => {
  try {
    if (data) {
      const filesToDelete = [data];

      const filePaths = filesToDelete.map(
        (fileName) => `./public/${repository}/${fileName}`
      );

      await Promise.all(filePaths.map((filePath) => fs.unlink(filePath)));

      console.log("Fichier supprimé avec succès");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression des fichiers :", error);
    throw new Error("Échec de la suppression des fichiers");
  }
};

module.exports = deleteFile;
