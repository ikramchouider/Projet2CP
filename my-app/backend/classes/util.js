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
    console.log("code",util.getCode(strLigne));
    instrTab.push(
      new CaseMc(adr, this.binaryToHex(util.getCode(strLigne)), str)
    );
    if (util.getFormat(strLigne) == "0") {
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
          instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
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
          instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
        }
      }
    }
    return instrTab;
  },

  chercherDansTableau: function (tableau, valeur) {
    // change the name to chercherEtiq
    let i = 0;
    while (i < tableau.length && tableau[i].getEtiq() != valeur) {
      i++;
    }
    return i;
  },

  chercherAdr: function (tableau, adr) {
    let i = 0;
    while (i < tableau.length && tableau[i].getAdr() != adr) {
      i++;
    }
    return i;
  },

  getCode: function (str) {
    let code;
    if (str.length == 3) {
      if (!util.regexi(str[1]) && util.regexi(str[2])) {
        code = util
          .getCop(str[0])
          .concat(
            util.modeAdr(str),
            util.getFormat(str),
            util.getDest(str),
            util.getReg(str[2]),
            "000"
          );
      } else
        code = util
          .getCop(str[0])
          .concat(
            util.modeAdr(str),
            util.getFormat(str),
            util.getDest(str),
            util.getReg(str[1]),
            util.getReg(str[2])
          );
    } else
      code = util
        .getCop(str[0])
        .concat(
          util.modeAdr(str),
          util.getFormat(str),
          util.getDest(str),
          util.getReg(str[1]),
          "000"
        );
    return code;
  },
  getCop: function (str) {
    let ins;
    switch (str.toUpperCase()) {
      case "MOV":
        ins = "000000";
        break;
      case "ADD":
        ins = "000001";
        break;
      case "ADA":
        ins = "000010";
        break;
      case "SUB":
        ins = "000011";
        break;
      case "SUBA":
        ins = "000100";
        break;
      case "CMP":
        ins = "000101";
        break;
      case "OR":
        ins = "000110";
        break;
      case "AND":
        ins = "000111";
        break;
      case "SHR":
        ins = "001000";
        break;
      case "SHL":
        ins = "001001";
        break;
      case "ROL":
        ins = "001010";
        break;
      case "ROR":
        ins = "001011";
        break;
      case "JZ":
        ins = "001100";
        break;
      case "JNZ":
        ins = "001101";
        break;
      case "JC":
        ins = "001110";
        break;
      case "JS":
        ins = "010000";
        break;
      case "JNC":
        ins = "001111";
        break;
      case "JNS":
        ins = "010001";
        break;
      case "JO":
        ins = "010010";
        break;
      case "JNO":
        ins = "010011";
        break;
      case "JE":
        ins = "010100";
        break;
      case "JNE":
        ins = "010101";
        break;
      case "LOAD":
        ins = "010110";
        break;
      case "STORE":
        ins = "010111";
        break;
      case "INC":
        ins = "011000";
        break;
      case "DEC":
        ins = "011001";
        break;
      case "NOT":
        ins = "011010";
        break;
      case "JMP":
        ins = "011011";
        break;
      case "IN":
        ins = "011100";
        break;
      case "OUT":
        ins = "011101";
        break;
      case "START":
        ins = "101000";
        break;
      case "STOP":
        ins = "011110";
        break;
      case "MOVI":
        ins = "100000";
        break;
      case "ADDI":
        ins = "100001";
        break;
      case "ADAI":
        ins = "100010";
        break;
      case "SUBI":
        ins = "100011";
        break;
      case "SBAI":
        ins = "100100";
        break;
      case "CMPI":
        ins = "100101";
        break;
      case "ORI":
        ins = "100110";
        break;
      case "ANDI":
        ins = "100111";
        break;
      case "LOADI":
        ins = "110110";
        break;
    }
    console.log("COP : ", ins);
    return ins;
  },
  getReg: function (reg) {
    let code;
    switch (reg.toUpperCase()) {
      case "AX":
        code = "000";
        break;
      case "BX":
        code = "001";
        break;
      case "CX":
        code = "010";
        break;
      case "DX":
        code = "011";
        break;
      case "EX":
        code = "100";
        break;
      case "FX":
        code = "101";
        break;
      case "SI":
        code = "110";
        break;
      case "DI":
        code = "111";
        break;
      default:
        code = "000";
        break;
    }
    console.log("Reg", code);
    return code;
  },
  regexi: function (reg) {
    reg = reg.toUpperCase();
    if (
      reg == "AX" ||
      reg == "BX" ||
      reg == "CX" ||
      reg == "DX" ||
      reg == "EX" ||
      reg == "FX" ||
      reg == "DI" ||
      reg == "SI"
    )
      return true;
    else return false;
  },
  modeDirect: function (tabIns) {
    if (util.regexi(tabIns[1]) && util.regexi(tabIns[2])) {
      return true;
    }
    if (
      !(
        util.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) ||
        util.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1))
      ) &&
      !util.modeBaseIndx(tabIns)
    ) {
      return true;
    }
    if (
      tabIns[0][tabIns[0].length - 1] == "I" &&
      (util.regexi(tabIns[1]) ||
        (!util.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&
          !util.modeBaseIndx(tabIns)))
    ) {
      return true;
    }
  },
  regAdrExi: function (reg) {
    reg = reg.toUpperCase();
    if (reg == "BX" || reg == "SI" || reg == "DI") {
      return true;
    } else return false;
  },
  modeIndirct: function (tabIns) {
    if (
      (util.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&
        util.regexi(tabIns[2])) ||
      (util.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1)) &&
        util.regexi(tabIns[1]))
    )
      return true;
    if (
      tabIns[0][tabIns[0].length - 1] == "I" &&
      util.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1))
    )
      return true;
    else return false;
  },
  modeBaseIndx: function (tabIns) {
    if (
      util.regexi(tabIns[1]) &&
      tabIns[2].slice(1, tabIns[2].length - 1).indexOf("+") != -1
    )
      return true;
    if (
      util.regexi(tabIns[2]) &&
      tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1
    )
      return true;
    if (
      tabIns[0][tabIns[0].length - 1] == "I" &&
      tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1
    )
      return true;
    else return false;
  },
  modeAdr: function (tabIns) {
    if (tabIns.length == 3) {
      if (
        tabIns[0] == "SHR" ||
        tabIns[0] == "SHL" ||
        tabIns[0] == "ROL" ||
        tabIns[0] == "ROR"
      ) {
        console.log("Mode d'Adressage : 00 (direct) ");
        return "00";
      } else if (
        (util.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1) ||
        (util.getDel(tabIns[2], "[") != "" && tabIns[2].indexOf("[") != -1)
      ) {
        console.log("Mode d'Adressage : 11 (Direct Indexé) ");
        return "11";
      } else {
        if (util.modeDirect(tabIns)) {
          console.log("Mode d'Adressage : 00 (direct) ");
          return "00";
        } else if (util.modeIndirct(tabIns)) {
          console.log("Mode d'Adressage : 01 (Indirect) ");
          return "01";
        } else if (util.modeBaseIndx(tabIns)) {
          console.log("Mode d'Adressage : 10 (Basé Indexé) ");
          return "10";
        }
      }
    } else if (tabIns.length == 2) {
      if (tabIns[0] == "LOAD") {
        if (util.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
          return "01";
        else if (
          util.getDel(tabIns[1], "[") != "" &&
          tabIns[1].indexOf("[") != -1
        )
          return "11";
        else return "00";
      } else return "00";
    }
  },
  getDest: function (str) {
    if (this.regexi(str[2].toUpperCase())) {
      return "1";
    } else {
      return "0";
    }
  },

  removeExtraSpaces: function (str) {
    return str.replace(/\s+/g, " ");
  },
  incrementHex: function (hex, n) {
    let decimal = parseInt(hex, 16);
    for (let i = 0; i < n; i++) {
      decimal = decimal + 1;
    }
    return decimal.toString(16).toUpperCase();
  },

  remplirZero: function (str, n, gd) {
    //gd=0 -> des zeros à gauche , gd=1 -> à droite
    var s = "";
    const length = str.length;
    if (gd == 0) {
      for (let k = 0; k < n - length; k++) {
        s += "0";
      }
      return s + str;
    } else {
      if (gd == 1) {
        for (let k = 0; k < n - length; k++) {
          str += "0";
        }
        return str;
      } else {
        throw new Error("Le troisieme parametre doit etre 0 ou 1.");
      }
    }
  },
  getDel: function (str, delimiter) {
    let position = str.indexOf(delimiter); // Find position of delimiter

    if (position !== -1) {
      // Check if delimiter is found
      str = str.substring(0, position); // Delete characters after delimiter
    }
    return str;
  },
  getFormat: function (ligne_str) {
    let taille = ligne_str.length;
    if (taille == 2) {
      if (
        util.regexi(ligne_str[1]) ||
        util.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1))
      )
        return "0";
      else return "1";
    } else if (taille == 3) {
      if (
        (util.regexi(ligne_str[1]) && util.regexi(ligne_str[2])) ||
        (util.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)) &&
          util.regexi(ligne_str[2])) ||
        (util.regAdrExi(ligne_str[2].slice(1, ligne_str[2].length - 1)) &&
          util.regexi(ligne_str[1]))
      )
        return "0";
      else return "1";
    }
  },
  getDest: function (str) {
    if (this.regexi(str[1].toUpperCase())) {
      return "1";
    } else {
      return "0";
    }
  },
  additionHexa: function (x, y) {
    return (parseInt(x, 16) + parseInt(y, 16)).toString(16).toUpperCase();
  },
  getSubstringBetweenChars: function (str, startChar, endChar) {
    let startIndex = str.indexOf(startChar);
    if (startIndex === -1) {
      return "";
    }
    startIndex += 1;
    const endIndex = str.indexOf(endChar, startIndex);
    if (endIndex === -1) {
      return "";
    }
    return str.substring(startIndex, endIndex);
  },
  binaryToHex: function (binary) {
    const decimal = parseInt(binary, 2);
    const hex = decimal.toString(16);
    return hex.toUpperCase();
  },
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

//console.log(util.remplirZero("1001",8,)) ;

export default util;
