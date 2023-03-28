const express = require ('express') ;
const router = express.Router() ;

router.get ('/Acceuil', (req , res) => {
//declarer un objet en JSON
const str =[{
    "contenuCo": "C4A" ,
    "contenuRi": "7AB2" ,
}];
//retourner sur la page accueil les infos en JSON déclarées precedemment str  
res.end(JSON.stringify(str)) ; 
})

module.exports = router ;