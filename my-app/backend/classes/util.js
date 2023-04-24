
import coding from "./coding.js";
var util = {

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

   // verifie si un nombre est en hexadecimal 
   estHexadecimal: function (chaine) {
    return !isNaN(parseInt(chaine, 16));
  }, // fin estHexadecimal

  
 isVariableNameValid: function (str,nbLigne) {
  let messageError= [] ; 
  if (!str) {  messageError.push(nbLigne+" Il faut que le nom de la variable soit valide  ") ;  } // Vérifier si la chaîne est vide ou null

  // Vérifier si le premier caractère est une lettre, un underscore ou un dollar
  let firstChar = str.charAt(0);
  if (!/^[a-zA-Z_$]/.test(firstChar)) { messageError.push(nbLigne+" Il faut que le nom de la variable soit valide ");  }

  // Vérifier si les autres caractères sont des lettres, des chiffres, des underscores ou des dollars
  for (let i = 1; i < str.length; i++) {
    let char = str.charAt(i);
    if (!/^[a-zA-Z0-9_$]/.test(char)) {  messageError.push(nbLigne+" Il faut que le nom de la variable soit valide ");  } }
  if ( coding.regexi(str)) {   messageError.push(nbLigne+" Il faut que le nom de la variable soit valide , il faut pas que ça soit un nom de registre ");  ; }
  /* La chaîne est valide */
  return messageError ;    },

checkNumber: function(ligne_str,nbLigne) {
  let messageError= [] ; 
  if (ligne_str.indexOf("H") ==  -1 ) {  messageError.push(nbLigne+" Il faut ecrire 'H' qui signifie la base hexadecimal ");    } 
         else { ligne_str = ligne_str.slice(0,ligne_str.length-1) ; 
          if (! this.estHexadecimal(ligne_str)) {  messageError.push(nbLigne+" Il faut donner une valeur hexadecimal"); } }
     return messageError ; 
},
instUnSeulOp: function(str) {
     str = str.toUpperCase() ; 
     if (str== 'ADA' || str == 'ADAI' ||str=="SBA" || str=="SBAI" || str=='STOP' || str=='START' || str=='IN' || str=='OUT' || str=='JMP' || 
     str=='NOT' || str=='DEC' || str=='INC' || str=='STORE' || str=='LOAD' || str=='LOADI' || str=='JNE' || str=='JE' ||
     str== 'JNO' || str == 'JO' || str=='JNS' || str=='JS' || str=='JNC' || str=='JC' || str=='JNZ' || str== 'JZ' ) return true ; 
     else return false ; 
},
}


export default util;
