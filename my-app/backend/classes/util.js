import CaseMc from "./caseMemoire.js";
import readline from "readline";
import fs from "fs";
var util = {
  coderInst: function (strLigne, adr, dataTab) {
    let str = "";
    let instrTab = new Array();
    if (strLigne[0][strLigne[0].length - 1] == ":") {
      str = strLigne[0];
      strLigne.shift();
    }
    instrTab.push(
      new CaseMc(adr, this.binaryToHex(util.getCode(strLigne)), str)
    );
    if (util.getFormat(strLigne) == "0") {
      for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
      return instrTab;
    } else if (strLigne[0][strLigne[0].length - 1].toUpperCase() == "I") {
      if (util.modeAdr(strLigne) == "00" && util.getDest(strLigne) == "0") {
        if (strLigne[1].indexOf("[") != -1) {
          adr = this.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 1), "") // remplir 0 remplirZero
          );
        } else {
          let indice = util.chercherDansTableau(dataTab, strLigne[1]);
          adr = this.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
        }
        adr = this.incrementHex(adr, 1);
        if (strLigne[2].indexOf("H") != -1) {
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
          );
        } else instrTab.push(new CaseMc(adr, strLigne[2], ""));
        for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
        return instrTab;
      }
      if (util.modeAdr(strLigne) == "10" && util.getDest(strLigne) == "0") {
        instrTab.push(
          new CaseMc(
            this.incrementHex(adr, 1),
            parseInt(getSubstringBetweenChars(strLigne[1], "+", "]")).toString(
              16
            )
          )
        );
      }
      for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
      return instrTab;
    } else if (util.modeAdr(strLigne) == "00") {
      if (util.getDest(strLigne) == "0") {
        if (strLigne[1].indexOf("[") != -1) {
          adr = this.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 2), "") // remplir 0 remplirZero
          );
        } else { 
          let indice = util.chercherDansTableau(dataTab, strLigne[1]);
          adr = this.incrementHex(adr, 1);
          //instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
          instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
          
        }
      } else {
        if (strLigne[2].indexOf("[") != -1) {
          adr = this.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(1, strLigne[2].length - 2), "") // remplir 0 remplirZero
          );
        } else {
          let indice = util.chercherDansTableau(dataTab, strLigne[2]);
          adr = this.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
        }
      }
    }
    
    //parcourir instTab et mettre le champ Val sur 4 caractere hexa
    for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
    return instrTab;
  },

  chercherDansTableau: function (tableau, valeur) {
    // change the name to chercherEtiq
    let i = 0;
    while (i < tableau.length && tableau[i].getEtiq() != valeur) {
      i++;
    }
    return i;
  }, // fin  chercherDansTableau

   // return element de tableau contant adr 
  chercherAdr: function (tableau, adr) {
    let i = 0;
    while (i < tableau.length && tableau[i].getAdr() != adr) {
      i++;
    }
    return i;
  },// chercherAdr

  // supprimer les espaces dans une chaine de caractere 
  removeExtraSpaces: function (str) {
    return str.replace(/\s+/g, " ");
  }, // fin removeExtraSpaces 

  // incrementer n fois  hex en hexadecimal 
  incrementHex: function (hex, n) {
    let decimal = parseInt(hex, 16);
    for (let i = 0; i < n; i++) { decimal = decimal + 1; }
    return decimal.toString(16).toUpperCase();
  }, //  fin incrementHex

// 
  remplirZero: function (str, n, gd) {
    //gd=0 -> des zeros à gauche , gd=1 -> à droite
    var s = "";
    const length = str.length;
    if (gd == 0) {
      for (let k = 0; k < n - length; k++) { s += "0";}
      return s + str;
    } else {
      if (gd == 1) {
        for (let k = 0; k < n - length; k++) {str += "0"; }
        return str;
      } else { throw new Error("Le troisieme parametre doit etre 0 ou 1."); } }
  }, // fin remplirZero

 // Find position of delimiter
  getDel: function (str, delimiter) {
    let position = str.indexOf(delimiter); 
    if (position !== -1) { // Check if delimiter is found
      str = str.substring(0, position); }// Delete characters after delimiter
    return str;
  }, //fin  getDel
  
  // faire l'addition en hexadecemal 
  additionHexa: function (x, y) {
    return (parseInt(x, 16) + parseInt(y, 16)).toString(16).toUpperCase();
  },// fin  additionHexa


  getSubstringBetweenChars: function (str, startChar, endChar) {
    let startIndex = str.indexOf(startChar);
    if (startIndex === -1) { return ""; }
    startIndex += 1;
    const endIndex = str.indexOf(endChar, startIndex);
    if (endIndex === -1) { return "";   }
    return str.substring(startIndex, endIndex);
  }, // fin getSubstringBetweenChars

  // convertir un nombre binaire en hexadecimal 
  binaryToHex: function (binary) {
    const decimal = parseInt(binary, 2);
    const hex = decimal.toString(16);
    return hex.toUpperCase();
  }, // fin  binaryToHex


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

    rl.on("line", (line) => {
      let ligne_str = line.toString().trim();
      if (ligne_str[0] == 'ORG') {
        if(trouvOrg== true){
          throw new Error("Il faut ecrire une seule fois ORG ") ; 
        }
        if( i != 0){throw new Error("Il faut commencer par ORG ") }
        trouvOrg = true ; 
      }
      else if(ligne_str[0] == 'START'){
        if (trouvOrg == false) throw new Error("Il faut commencer par ORG ") ; 
        if (trouvStop == true ) throw new Error("Il faut commencer par START") ; 
      }
      else if (ligne_str[0] == 'SET') {
        if (trouvOrg == false) throw new Error("Il faut commencer par ORG ") ; 
        if (trouvStart == true) throw new Error("Il faut commencer par SET ") ; 
      }
      else {

      }
      i++ ; 
    });
  rl.on("close", () => { if (trouvStop == false) throw new Error("Il faut terminer par stop ") ; }) ;
  console.log('i:',i);
},
removeEmptyLines: function (file) {
  let lines = file.split('\n');
  lines = lines.filter(line => line.trim() !== '');
  let newFile = lines.join('\n');
  return newFile;
},
}


export default util;
