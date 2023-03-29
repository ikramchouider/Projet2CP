import "./caseMemoire.js";
var util = {
  coderInst: function (strLigne, adr, dataTab) {
    let c;
    let i = 0;
    let str = strLigne[0];

    if (str[str.length - 1] == ":") {
      i = 1;
      c = new CaseMc(adr, "", str);
    }
    let valeur = util.getCop(strLigne[i]);
    console.log(valeur);
  },
  getCop: function (str) {
    let ins;
    switch (str) {
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
      case "IN":
        ins = "011100";
        break;
      case "OUT":
        ins = "011101";
        break;
      case "STOP":
        ins = "11110";
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
    return ins;
  },

  removeExtraSpaces: function (str) {
    return str.replace(/\s+/g, " ");
  },
  incrementHex: function (hex) {
    const decimal = parseInt(hex, 16);
    const incremented = decimal + 1;
    return incremented.toString(16).toUpperCase();
  },
  /*CoderInst: function (strLigne) {
    let c = new CaseMc();
    for (i = 0; i < strLigne.length; i++) {
      while (strLigne[i] != " ") {
        i++;
      }
      if (strLigne[i - 1] != ":") {
      } else {
      }
    }
  },

  codeMov: function(ligne){
    
  }
  coderOrg: function (ligne) {
    let ligne_str = ligne.toString().trim();
    console.log(ligne_str);
    let inst = ligne_str.split(" ");
    let param = inst[1].split("H");
    if (inst[0] == "ORG") {
      let codeBinaire = "0111110000000000";
      let adr = parseInt(inst[1]);
      if ((parseInt(param, 16)<256)||(parseInt(param, 16)>=1040)) {
        throw new Error ("Choissisez une adresse debut compris dans le segment de code [100H,410H]");
      }
      else {
        param = parseInt(param,16).toString(2);
        return (codeBinaire + this.remplirZero(param,16));
      }

    } 
    else 
    {
      return null;
    }
  },

  coderSet: function (ligne) {},
  remplirZero: function(str,n) {
    var s = "";
    for (let k = 0; k<n-str.length;k++){
      s += '0' ;
    }
    return (s+str);
    
  }*/
};

export default util;
