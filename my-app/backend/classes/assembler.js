import coding from "./coding.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
var assembler = {
errorFunction: function (fichier){
    const fileStream = fs.createReadStream(fichier);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let i=0 ; 
    let trouvOrg= false ; 
    let trouvStart= false ; 
    let trouvStop= false ; 
    let tabNomVariable = [] ; 
    rl.on("line", (line) => {
      if (line != "") {
      let ligne_str = line.toString().trim(); // enlever les espaces  de debut et fin de line
      ligne_str = ligne_str.replace(",", " ");
      ligne_str = util.removeExtraSpaces(ligne_str);
      ligne_str = ligne_str.split(" "); 
      if (ligne_str[0] == 'ORG') {
        if(trouvOrg== true){
          throw new Error("Il faut ecrire une seule fois ORG ") ; 
        }
        if( i != 0){throw new Error("Il faut commencer par ORG ") }
        trouvOrg = true ; 
        if (ligne_str.length != 2){ throw new Error("Il faut specifier l'adresse debut dans ORG") }
        else {
          util.checkNumber(ligne_str[1]) ; 
        }
      }
      else if(ligne_str[0] == 'START'){
        if (trouvOrg == false) throw new Error("Il faut commencer par ORG ") ; 
        if (trouvStop == true ) throw new Error("Il faut commencer par START") ; 
        trouvStart=true ; 

      }
      else if (ligne_str[0] == 'SET') {
        if (trouvOrg == false) throw new Error("Il faut specifier l'adresse debut dans ORG avant de declarer les variables ") ; 
        if (trouvStart == true) throw new Error("Il faut declarer les variables avant START ") ; 
        if (ligne_str.length != 3){ throw new Error("Il faut specifier le nom de la donnée et lui attribuer une valeur ") }
        else {
          util.isVariableNameValid(ligne_str[1]) ; 
          util.checkNumber(ligne_str[2]) ; 
          if (tabNomVariable.indexOf(ligne_str[1]) !== -1) {throw new Error("Variable deja declarée ") ; }
          else  {tabNomVariable.push(ligne_str[1]) ;  }
        }
      }
      else if (ligne_str[0] == 'STOP'){trouvStop = true}
      else {// on est dans le cas d'une instruction 
        if (line.indexOf(":") != -1) {
        if (ligne_str[0][ligne_str[0].length - 1] == ":") {
          if (ligne_str.length == 1) {throw new Error("Il faut mettre l'etiquette dans la meme ligne que l'instruction ")}
          ligne_str.shift();
        }else {throw new Error("Il faut pas laisser des espaces entre le nom de l'etiquette et ':' ") ; }
       }else if( coding.getCop(ligne_str[0]) == -1) {throw new Error("Il faut mettre ':' à la fin du nom de l'etiquette voulue ") ; }
       if ( line.indexOf(",") == -1) {
            if(! util.instUnSeulOp(ligne_str[0])) {throw new Error("Il faut mettre ',' entre les operandes ") ; }
       }
      if(line.indexOf("[") != -1) { 
        if ((line.slice(line.indexOf("[")+1,line.indexOf("]"))) .indexOf(" ") != -1) { throw new Error("Il faut pas laisser des espaces entre '[' et ']' ") ;}
        else if (! coding.regAdrExi(line.slice(line.indexOf("[")+1,line.indexOf("]")))) {throw new Error("Il faut mettre un registre d'adressage ' BX SI DI '  entre '[' et ']' ") ;} 
       }else if( ! coding.regexi(ligne_str[1]) || !coding.regexi(ligne_str[2] ) ){
           if(tabNomVariable.indexOf(ligne_str[1]) == -1 || tabNomVariable.indexOf(ligne_str[2]) ) {
            throw new Error("Il faut declarer les variables  ")
           }
       } 
      }
      i++ ;  }});
  rl.on("close", () => {  if (trouvStop == false) throw new Error("Il faut terminer par 'STOP' ") ; }) ;
    },// fin fonction error 
}

export default assembler;