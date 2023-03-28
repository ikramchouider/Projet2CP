import { CaseMc } from "./caseMemoire.js";
var util = {
  coderInst: function (strLigne,adr,dataTab) { 
    let c ; 
    let i=0 ; 
    let str = strLigne[0]  ;
       
      if (str[str.length -1] == ":") {
        i=1 ; 
        c = new CaseMc(adr,"",str);
      } 
      let valeur = GetCop(strLigne[i]) ; 
      console.log(valeur) ; 
  },
   getCop: function (str) {
    if (cop.substring(0, 0) == '0') { 
      let ins;
      switch (cop.substring(1, 5)) 
      {case "MOV" : ins = '000000';  break ; 
       case "ADD" : ins = '000001';  break ;
       case "ADA" : ins = '000010';  break ;
       case "SUB" : ins = '000011';  break ;
       case "SUBA" : ins = '000100'; break ;
       case "CMP" : ins = '000101';  break ;
       case "OR" : ins = '000110';   break ;
       case "AND" : ins = '000111';
       case "SHR" : ins = '001000';
       case "SHL" : ins = '001001';
       case "ROL" : ins = '001010';
       case "ROR" : ins = '001011';
       case "JZ" : ins = '001100';
       case "IN" : ins = '011100';
       case "OUT" : ins = '011101';
       case "STOP" : ins = '11110';
       case "MOVI" : ins = '100000';
       case "ADDI" : ins = '100001';
       case "ADAI" : ins = '100010';
       case "SUBI" : ins = '100011';
       case "SBAI" : ins = '100100';
       case "CMPI" : ins = '100101';
       case "ORI" : ins = '100110';
       case "ANDI" : ins = '100111';
       case "LOADI" : ins = '110110';
    } 

  } 
   },

  /*coderOrg: function (ligne) {
    let ligne_str = ligne.toString().trim();
    console.log(ligne_str);
    //const cop = ligne_str.substring(0,4) ;
    //console.log(cop);
    let inst = ligne_str.split(" ");
    if (inst[0] == "ORG") {
      let codeBinaire = "0111110000000000";
      let adr = parseInt(inst[1]);
      if (isNaN(adr)) {
        throw new Error("Parametre entree n'est pas un nombre!");
      }
    } else {
      return null;
    }
  },*/

  coderSet: function (ligne) {},
};

var ligne = "   ORG 100   ";
//util.CoderInst("FSI: ")