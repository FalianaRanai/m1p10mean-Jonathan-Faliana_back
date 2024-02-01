// Verifie si, dans un objet, des arguments contenues dans une liste de strings existent
const verifyArgumentExistence = (arrayOfPropertiesName, object) =>{
    for(let i = 0; i < arrayOfPropertiesName.length; i++){
        if(!object[arrayOfPropertiesName[i]]){
            throw new Error(`${arrayOfPropertiesName[i]} is ${object[arrayOfPropertiesName[i]]} (undefined or null)`);
        }
    }
};

module.exports = verifyArgumentExistence;