
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

  //conversion en hexadecimal
  let x1bin = util.hexEnBinaire(x1) ;
  let x2bin = util.hexEnBinaire(x2) ;

  let carry = 0;
  let result = '';
  
  // Add digits from right to left
  for (let i = x1bin.length - 1; i >= 0; i--) {
    let digit1 = parseInt(x1bin.charAt(i));
    let digit2 = parseInt(x2bin.charAt(i));
    let sum = digit1 + digit2 + carry;
    
    if (sum > 1) {
      sum -= 2;
      carry = 1;
    } else {
      carry = 0;
    }
    result = sum + result;
  }
  
  // Add final carry bit, if there is one
  if (carry) {
    result = carry + result;
  }
  
  result = this.binaryToHex(result) ;

  if ((util.hexSigne(util.remplirZero(x1,4,0))=="-1")&&(util.hexSigne(util.remplirZero(x2,4,0))=="-1")&&(util.hexSigne(util.remplirZero(result.slice(-4),4,0))=="1")) 
  {main.setIndicateurDebord("1"); console.log("Debord:"+ "1");} 
  else if ((util.hexSigne(util.remplirZero(x1,4,0))=="1")&&(util.hexSigne(util.remplirZero(x2,4,0))=="1")&&(util.hexSigne(util.remplirZero(result.slice(-4),4,0))=="-1"))
  {main.setIndicateurDebord("1"); console.log("Debord:"+ "1");}
  else {main.setIndicateurDebord("0"); console.log("Debord:"+ "0");}

  if(carry==0){main.setIndicateurRetenue("1");}
  else {main.setIndicateurRetenue("0");}

  if (this.hexEnBinaire(result.slice(-4))[0]=="1"){main.setIndicateurSigne("1");}
  else{main.setIndicateurSigne("0");}

  console.log("Retenue:"+ carry);
  console.log("Signe:"+ this.hexEnBinaire(result.slice(-4))[0]);
  

  return result;
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

SoustractionHex: function(n,m) {
    const decimalA = parseInt(n, 16);
    const decimalB = parseInt(m, 16);
    let decimalResult = decimalA - decimalB;
    if (decimalResult < 0) {
      decimalResult += 4294967296; // 2^32
    }
    decimalResult &= 0xFFFF;
    const hexResult = decimalResult.toString(16);
    return hexResult;
}, 

/*SoustractionHex: function (n, m) {
  // Convertit n et m en nombres décimaux
  const decimalA = parseInt(n, 16);
  const decimalB = parseInt(m, 16);
  
  // Effectue la soustraction
  let decimalResult = decimalA - decimalB;
  
  // Si le résultat est négatif, ajoute 2^32 pour obtenir une représentation correcte en hexadécimal
  if (decimalResult < 0) {
    decimalResult += 4294967296; // 2^32
  }
  
  // Convertit le résultat en hexadécimal et le renvoie sous forme de chaîne de caractères
  const hexResult = decimalResult.toString(16);
  return hexResult;
}, */

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