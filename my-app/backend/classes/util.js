
import coding from "./coding.js";
import main from "./main.js";
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
  additionHexa: function (x1,x2) {
    let a = util.hexEnBinaire(util.remplirZero(x1,4,0));
    let b = util.hexEnBinaire(util.remplirZero(x2,4,0));
    let sum = '';
    let carry = 0;
    let i = a.length - 1;
    let j = b.length - 1;
  
    while (i >= 0 || j >= 0 || carry > 0) {
    let digitA = i >= 0 ? parseInt(a.charAt(i), 2) : 0;
    let digitB = j >= 0 ? parseInt(b.charAt(j), 2) : 0;
    let digitSum = digitA + digitB + carry;
  
    carry = digitSum >= 2 ? 1 : 0;
    digitSum = digitSum % 2;
    sum = digitSum + sum;

    i--;
      j--;
    }
    return util.binaryToHex(sum) ;
  }, // fin  additionHexa

  /**
+   * elle place l'indicateur zero selon l'operation de l'addition 
+   * @param {1} x1 
+   * @param {2} x2 
+   */
  setIndZeroAddition: function (x1, x2) {
      let resultat = this.additionHexa(x1,x2) ;
      resultat = resultat.slice(-4) ;
      let resultatBin = util.hexEnBinaire(resultat); 
      if(resultatBin.slice(-15)=="000000000000000") {main.setIndicateurZero("1");}
      else {main.setIndicateurZero("0");}
    }  ,
  
    /**
     * place l'indicateur du signe selon l'operation de l'addition
     * @param {*} x1 
     * @param {*} x2 
    */
    setIndSigneAddition: function(x1,x2) {

    x1 = util.remplirZero(x1,4,0) ;
    x2 = util.remplirZero(x2,4,0) ;
    let x1bin = util.hexEnBinaire(x1) ;
    let x2bin = util.hexEnBinaire(x2) ;

    if ((x1bin[0]=="0")&&(x2bin[0]=="0")) {main.setIndicateurSigne("0"); return ;}
    if ((x1bin[0]=="1")&&(x2bin[0]=="1")) {main.setIndicateurSigne("1"); return ;}
   if (((x1bin[0]=="1")&&(x2bin[0]=="0"))) {
     //le signe dans ce cas sera du signe du nombre dont la valeur absolue est la plus grande 
      let x2bin_ = util.remplirZero(x2bin.slice(-15),16,0) ;
      if (parseInt(util.positiveComplementADeux(x1bin),2)>parseInt(x2bin_,2)) //le signe sera du signe de x1bin
      {main.setIndicateurSigne(x1bin[0]); return ;}
      else {main.setIndicateurSigne(x2bin[0]); return ;}
    }
  if ((x1bin[0]=="0")&&(x2bin[0]=="1")) {
      let x1bin_ = util.remplirZero(x1bin.slice(-15),16,0) ;
       if (parseInt(util.positiveComplementADeux(x2bin),2)>parseInt(x1bin_,2)) //le signe sera du signe de x2bin
      {main.setIndicateurSigne(x2bin[0]); return ;}
       else {main.setIndicateurSigne(x1bin[0]); return ;}
  }},

  setIndDebordAddition: function(x1,x2) {

x1 = util.remplirZero(x1,4,0) ;
x2 = util.remplirZero(x2,4,0) ;
let x1bin = util.hexEnBinaire(x1) ;
let x2bin = util.hexEnBinaire(x2) ;
let resultat = (this.additionHexa(x1,x2)).slice(-4) ; //slice(-4) car on doit comparer avec le premier bit du resultat ecrit sur 16bits
resultat = util.hexEnBinaire(resultat) ;
if ((x1bin[0]=="1")&&(x2bin[0]=="1")&&(resultat[0]=="0")) {main.setIndicateurDebord("1") ; return ;}
else if ((x1bin[0]=="0")&&(x2bin[0]=="0")&&(resultat[0]=="1")) {main.setIndicateurDebord("1"); return ;}
else {main.setIndicateurDebord("0"); return ;}
},
    
setIndRetenueAddition: function(x1,x2) {
let resultat = this.additionHexa(x1,x2) ;
if (resultat.length>4) {main.setIndicateurRetenue("1"); return ;}
else {main.setIndicateurRetenue("0"); return ;}
},

/**
 * elle place les indicateurs di signe et zero selon le contenu de l'accumulateur qui est en hexa
 * @param {1} contenuAcc le contenu de l'accumulateur en hexadecimal
 */
setIndicateursAccumulateur: function(contenuAcc) {
let contenuAccBin = util.hexEnBinaire(contenuAcc) ;
if (contenuAccBin[0]=="1") {main.setIndicateurSigne("1");}
else {main.setIndicateurSigne("0");}
if (contenuAcc=="0000"){main.setIndicateurZero("1");}
else {main.setIndicateurZero("0");}
},

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
  
  hexEnBinaire: function (hex) {
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
      const char = parseInt(hex[i], 16).toString(2);
      binary += char.padStart(4, "0");
    }
    return binary;
  },

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

getCodeASCIIHex: function(caractere) {
  return caractere.charCodeAt(0).toString(16);
},
/**
+ * fait la soustraction de n-m tq n et m sont representés en complement à 2, et positionne les indicateurs
+ * @param {1} n 
+ * @param {2} m 
+ */

SoustractionHex: function(n,m) {
    
let resultat ="" ;
let m_ = "" ; //soit m convertit en negatif ou positif selon le cas
m = util.hexEnBinaire(util.remplirZero(m,4,0)) ;
//cas1: si m est positif cela revient a l'addition signée de n + (-m)
if (m[0]=="0") 
{
m_ = util.negationComplementADeux(m) ;
resultat = util.additionHexa(util.remplirZero(n,4,0),util.binaryToHex(m_)) ;
}
else //cas2: si m negatif ie: le bit le plus a gauche est à 1 cela revient a l'addition de n + m
{
m_ = util.positiveComplementADeux(m) ;
resultat = util.additionHexa(util.remplirZero(n,4,0),util.binaryToHex(m_)) ;
}
//positionner les indicateurs
util.setIndDebordAddition(n,util.binaryToHex(m_)) ;
util.setIndRetenueAddition(n,util.binaryToHex(m_)) ; 
util.setIndZeroAddition(n,util.binaryToHex(m_)) ; 
util.setIndSigneAddition(n,util.binaryToHex(m_)) ; 
       
return resultat ;

},

/**
* convertit un nombre binaire negatif (sur 16bits) en sa valeur positive representée en CA2
* @param {1} binaryNum 
* @returns 
*/
positiveComplementADeux: function(binaryNum) {
// inverser les bits
let onesComplement = "";
for (let i = 0; i < binaryNum.length; i++) {
onesComplement += binaryNum[i] === "0" ? "1" : "0";
}
let absValue = parseInt(onesComplement, 2) + 1;
let absBinary = absValue.toString(2).padStart(16, "0");
return absBinary;},

negationComplementADeux: function(binaryNum) {
// Convertir binaryNum en decimal
let decimalNum = parseInt(binaryNum, 2);

// Calculer le nombre negatif et sa representation en CA2
let negation = -decimalNum;
let twosComplement = (negation >>> 0).toString(2).padStart(16, '0');
  
return twosComplement;  
},

AndHex: function(n, m) {
  const decimalN = parseInt(n, 16);
  const decimalM = parseInt(m, 16);
  const result = decimalN & decimalM;
  const hexResult = result.toString(16).toUpperCase();
  return hexResult;
},

OrHex: function(n, m) {
  const decimalN = parseInt(n, 16);
  const decimalM = parseInt(m, 16);
  const result = decimalN | decimalM;
  const hexResult = result.toString(16).toUpperCase();
  return hexResult;
},

NotHex: function(n) {
const decimalN = parseInt(n, 16);
const result = ~decimalN;
const hexResult = result.toString(16).toUpperCase();
return hexResult;
},

decalageLogiqueHexadecDroit: function(hexa, n) {
let decimal = parseInt(hexa, 16); // conversion hexadécimale en décimal
let resultat = decimal >>> n; // décalage logique de n positions vers la droite
main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[16-n]) ; 

return resultat.toString(16); // conversion du résultat en hexadécimal
},

decalageLogiqueHexadecGauche: function(hexa, n) {
let decimal = parseInt(hexa, 16); // conversion hexadécimale en décimal
let resultat = decimal << n; // décalage logique de n positions vers la gauche
main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[0+n-1]) ; 
return resultat.toString(16); // conversion du résultat en hexadécimal
},

rotationHexadecimal: function (code,hexa, n) {
let decimal = parseInt(hexa, 16); // conversion hexadécimale en décimal
let resultat;
if (code == "ROL") {
  resultat = (decimal << n) | (decimal >>> (32 - n)); // rotation à gauche de n positions
  main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[0+n-1]) ;
} else {
  resultat = (decimal >>> -n) | (decimal << (32 + n)); // rotation à droite de n positions
  main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[16-n]) ; 
}
return resultat.toString(16); // conversion du résultat en hexadécimal
},

compareHexValues: function (x, y) {
let decimalX = parseInt(x, 16); // conversion hexadécimale en décimal
let decimalY = parseInt(y, 16); // conversion hexadécimale en décimal

if (decimalX < decimalY) {
  return -1
} else if (decimalX > decimalY) {
  return 1
} else {
  return 0
}
},

hexSigne: function(op) {
      op = util.hexEnBinaire(op) ; 
      if (op[0] == "1")  return "-1" ; 
      else return "1" ; 
 
},
/*
convertToAscii: function(string) {
  let asciiCode = [];
  let str ; 
  for (let i = 0; i < string.length; i++) {
    asciiCode.push((string.charCodeAt(i)).toString(16));
    str=str+asciiCode[i]
  }
  return asciiCode;
} */

test: function (x) {
  x.concat("nour")
}


}


export default util;