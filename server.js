require('module-alias/register');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const app = express();
const router = express.Router();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// ++++++++++++++++++++++++++ MIDDLEWARES +++++++++++++++++++++++++++++
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

// Crée des logs
app.use(morgan('dev'));

// Configure le serveur pour servir des fichiers statiques
app.use(express.static('public'));

// ++++++++++++++++++++++++++ DATABASE ++++++++++++++++++++++++++
const connectToDatabase = require("@config/database");
connectToDatabase();

// ++++++++++++++++++++++++++ ROUTES ++++++++++++++++++++++++++
// const baseRoutes = require("@routes/base.routes");
// const sousCategorieRoutes = require("@routes/sousCategorie.routes");
// const categorieRoutes = require("@routes/categorie.routes");
// const clientRoutes = require("@routes/client.routes");
// const roleRoutes = require("@routes/role.routes");
// const userRoutes = require("@routes/user.routes");
// const userTokenRoutes = require("@routes/userToken.routes");
// const annonceRoutes = require("@routes/annonce.routes");

// app.use("/", baseRoutes);
// app.use("/SousCategorie", sousCategorieRoutes);
// app.use("/Categorie", categorieRoutes);
// app.use("/Client", clientRoutes);
// app.use("/Role", roleRoutes);
// app.use("/User", userRoutes);
// app.use("/UserToken", userTokenRoutes);
// app.use("/Annonce", annonceRoutes);

//  Gérer les paths introuvables
app.use((req, res)=>{
    console.log("Page introuvable");
    res.send({ status: 404, message: "Page introuvable" });
});

// ++++++++++++++++++++++++++ LAUNCH ++++++++++++++++++++++++++
app.listen(PORT,()=>{
    console.log(`server is up and running on port ${PORT}`);
})