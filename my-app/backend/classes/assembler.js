import coding from "./coding.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
import { log } from "console";
var assembler = {
errorFunction: function (fichier){ 
    const fileStream = fs.createReadStream(fichier);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let i=0 ; 
    let nbLigne = 0 ; 
    let nbError=0 ; 
    let trouvOrg= false ; 
    let trouvStart= false ; 
    let trouvStop= false ; 
    let tabNomVariable = [] ; 
    let messageError= [] ; 
    rl.on("line", (line) => {
      nbLigne ++ ; 
      if (line != "") {
      let ligne_str = line.toString().trim(); // enlever les espaces  de debut et fin de line
      ligne_str = ligne_str.replace(",", " ");
      ligne_str = util.removeExtraSpaces(ligne_str);
      ligne_str = ligne_str.split(" "); 
      if (ligne_str[0] == 'ORG') {
        if(trouvOrg== true){
          messageError.push(nbLigne+" Il faut ecrire une seule fois ORG ") ; 
        }
        if( i != 0){
          messageError.push(nbLigne+" Il faut commencer par ORG ") ; 
          }
        trouvOrg = true ; 
        if (ligne_str.length != 2){ 
          messageError.push(nbLigne+" Il faut specifier l'adresse debut dans ORG") ; 
          }
        else {
         messageError=messageError.concat(util.checkNumber(ligne_str[1],nbLigne) ); 
        }
      }
      else if(ligne_str[0] == 'START'){
        if (trouvOrg == false){ 
            messageError.push(nbLigne+" Il faut commencer par ORG " ) ;    }
        if (trouvStop == true ){  messageError.push(nbLigne+" Il faut commencer par START" ) ;   }
        trouvStart=true ; 

      }
      else if (ligne_str[0] == 'SET') {
        if (trouvOrg == false) {  messageError.push(nbLigne+" Il faut specifier l'adresse debut dans ORG avant de declarer les variables ") ;    }
        if (trouvStart == true){   messageError.push(nbLigne+" Il faut declarer les variables avant START ") ;  }
        if (ligne_str.length != 3){  messageError.push(nbLigne+" Il faut specifier le nom de la donnée et lui attribuer une valeur ") ;  }
        else {
          messageError=messageError.concat(util.isVariableNameValid(ligne_str[1],nbLigne)); 
          messageError=messageError.concat(util.checkNumber(ligne_str[2],nbLigne)); 
          if (tabNomVariable.indexOf(ligne_str[1]) !== -1) {  messageError.push(nbLigne+" Variable deja declarée ") ; }
          else  {tabNomVariable.push(ligne_str[1]) ;  }
        }
      }
      else if (ligne_str[0] == 'STOP'){if (trouvStop) {messageError.push(nbLigne+" Il faut ecrire STOP une seul fois ") ;}
        trouvStop = true}
      else {// on est dans le cas d'une instruction 
        if (line.indexOf(":") != -1) {
        if (ligne_str[0][ligne_str[0].length - 1] == ":") {
          if (ligne_str.length == 1) { messageError.push(nbLigne+" Il faut mettre l'etiquette dans la meme ligne que l'instruction ") ;  }
          ligne_str.shift();
        }else {  messageError.push(nbLigne+" Il faut pas laisser des espaces entre le nom de l'etiquette et ':' ") ;  }
       }else if( coding.getCop(ligne_str[0]) == -1) {  messageError.push(nbLigne+" Il faut mettre ':' à la fin du nom de l'etiquette voulue " ) ;  }
       if ( line.indexOf(",") == -1) {
            if(! util.instUnSeulOp(ligne_str[0])) {   messageError.push(nbLigne+" Il faut mettre ',' entre les operandes " ) ;  }
       }
      if(line.indexOf("[") != -1) { 
        if ((line.slice(line.indexOf("[")+1,line.indexOf("]"))) .indexOf(" ") != -1) {  messageError.push(nbLigne+" Il faut pas laisser des espaces entre '[' et ']' " ) ;  }
        else if (! coding.regAdrExi(line.slice(line.indexOf("[")+1,line.indexOf("]")))) { messageError.push(nbLigne+" Il faut mettre un registre d'adressage ' BX SI DI '  entre '[' et ']' " ) ; } 
       }else if( ! coding.regexi(ligne_str[1]) || !coding.regexi(ligne_str[2] ) ){
           if(tabNomVariable.indexOf(ligne_str[1]) == -1 || tabNomVariable.indexOf(ligne_str[2]) ) {
             messageError.push(nbLigne+" Il faut declarer les variables  " ) ; 
           }
       } 
      }
      i++ ;  }});
  rl.on("close", () => { 
     if (trouvStop == false) {  messageError.push(nbLigne+" Il faut terminer par 'STOP' " ) ; }
     for(let j=0;j<messageError.length;j++) console.log(j+1,':',messageError[j]);
    console.log("Nombre d'erreur : ",messageError.length);
     }  ) ;

    },// fin fonction error 

}

export default assembler;