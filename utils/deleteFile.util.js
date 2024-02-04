const fs = require("fs");
const path = require("path");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");

const deleteFile = ({
  repository,
  res,
  data,
  controllerName,
  functionName,
  session,
}) => {
  if (data.image) {
    // Chemin du fichier à supprimer
    const filePathToDelete = `./public/${repository}/${data.image}`;

    // Suppression du fichier
    fs.unlink(filePathToDelete, (err) => {
      if (err) {
        console.error(
          `Erreur lors de la suppression du fichier ${data.image}`,
          err
        );
        throw new Error(
          "Erreur lors de la suppression (de l'image) de la donnée"
        );
      } else {
        console.log(`Fichier ${data.image} supprimé avec succès`);
        sendSuccessResponse(res, data, controllerName, functionName, session);
      }
    });
  } else {
    sendSuccessResponse(res, data, controllerName, functionName, session);
  }
};

module.exports = deleteFile;
