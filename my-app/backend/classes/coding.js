import CaseMc from "./caseMemoire.js";
import util from "./util.js";

var coding = {
    // debut coderInst "codage des instructions " return tableau des mots memoir apres codage de l'instruction 
    coderInst: function (strLigne, adr, dataTab) {
      let str = "";
      let instrTab = new Array();
      if (strLigne[0][strLigne[0].length - 1] == ":") {
        str = strLigne[0];
        strLigne.shift();
      }
      instrTab.push(
        new CaseMc(adr,util.binaryToHex(coding.getCode(strLigne)), str)
      );
      if (coding.getFormat(strLigne) == "0") {
        for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
        return instrTab;
      } else if (strLigne[0][strLigne[0].length - 1].toUpperCase() == "I") {
        if (coding.modeAdr(strLigne) == "00" && coding.getDest(strLigne) == "0") {
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
        if (coding.modeAdr(strLigne) == "10" && coding.getDest(strLigne) == "0") {
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
      } else if (coding.modeAdr(strLigne) == "00") {
        if (coding.getDest(strLigne) == "0") {
          if (strLigne[1].indexOf("[") != -1) {
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 2), "") // remplir 0 remplirZero
            );
          } else { 
            let indice = util.chercherDansTableau(dataTab, strLigne[1]);
            adr = util.incrementHex(adr, 1);
            //instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
            instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
            
          }
        } else {
          if (strLigne[2].indexOf("[") != -1) {
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[2].slice(1, strLigne[2].length - 2), "") // remplir 0 remplirZero
            );
          } else {
            let indice = util.chercherDansTableau(dataTab, strLigne[2]);
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
          }
        }
      } else if (util.modeAdr(strLigne) == "10") {
        if (util.getDest(strLigne) == "0"){ //MOV [BX+3], AX
          let regEtDepl = strLigne[1].slice(1, strLigne[1].length - 1) ;
          let depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        }
        else {  
          let regEtDepl = strLigne[2].slice(1, strLigne[2].length - 1) ;
          let depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        }
      
      //parcourir instTab et mettre le champ Val sur 4 caractere hexa
      for (let j=0; j<instrTab.length;j++){
      instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0))  ;
    }
      return instrTab;
    }}, // fin coder instruction 


      // return code binaire de l'instruction 
      getCode: function (str) {
        let code;
        if (str.length == 3) {
          if (this.regexi(str[1]) && this.regexi(str[2])){
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(str[2]));
          }
          if (!this.regexi(str[1]) && this.regexi(str[2]) ) {
            if(this.regexi(str[1].slice(1,str[1].length-1))) 
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),this.getReg(str[2]));
            else if ((str[1].indexOf("[") != -1 ) && (str[1].indexOf("+") != -1)) {
              let regEtDepl = str[1].slice(1, str[1].length - 1) ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),str[2]);
            }
            else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),"000");}
          }
          if(this.regexi(str[1]) && !this.regexi(str[2]))
          {
            if(this.regexi(str[2].slice(1,str[2].length-1))) 
            {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(str[2].slice(1,str[2].length-1)));}
            else if(this.regexi(str[1].slice(1,str[1].length-1))) 
            {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),this.getReg(str[2]));}
            else if ((str[2].indexOf("[") != -1 ) && (str[2].indexOf("+") != -1)) {
              let regEtDepl = str[2].slice(1, str[2].length - 1) ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),str[1],this.getReg(reg));
            }
            else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),"000");}
      
          }
          } 
        else {
          if(this.regexi(str[1]))
          { 
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),"000");
          }
          else if (this.regexi(str[1].slice(1,str[1].length-1)))
          {
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),"000");
          } else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),"000","000");
        }
        }
          return code;
      }, // fin getcode 

      // return code operation de l'instruction 
      getCop: function (str) {
        let ins;
        switch (str.toUpperCase()) {
          case "MOV": ins = "000000"; break;
          case "ADD": ins = "000001"; break;
          case "ADA": ins = "000010"; break;
          case "SUB": ins = "000011"; break;
          case "SUBA": ins = "000100"; break;
          case "CMP": ins = "000101"; break;
          case "OR": ins = "000110"; break;
          case "AND": ins = "000111"; break;
          case "SHR": ins = "001000"; break;
          case "SHL": ins = "001001"; break;
          case "ROL": ins = "001010"; break;
          case "ROR": ins = "001011"; break;
          case "JZ": ins = "001100"; break;
          case "JNZ": ins = "001101"; break;
          case "JC": ins = "001110"; break;
          case "JS": ins = "010000"; break;
          case "JNC": ins = "001111"; break;
          case "JNS": ins = "010001"; break;
          case "JO": ins = "010010"; break;
          case "JNO": ins = "010011"; break;
          case "JE": ins = "010100"; break;
          case "JNE": ins = "010101"; break;
          case "LOAD": ins = "010110"; break;
          case "STORE": ins = "010111"; break;
          case "INC": ins = "011000"; break;
          case "DEC": ins = "011001"; break;
          case "NOT": ins = "011010"; break;
          case "JMP": ins = "011011"; break;
          case "IN": ins = "011100"; break;
          case "OUT": ins = "011101"; break;
          case "START": ins = "011111"; break;
          case "STOP": ins = "011110"; break;
          case "MOVI": ins = "100000"; break;
          case "ADDI": ins = "100001";break;
          case "ADAI": ins = "100010"; break;
          case "SUBI": ins = "100011"; break;
          case "SBAI": ins = "100100"; break;
          case "CMPI": ins = "100101"; break;
          case "ORI": ins = "100110"; break;
          case "ANDI": ins = "100111"; break;
          case "LOADI": ins = "110110"; break;
          default: ins= "-1"; break;
        }
        return ins;
      }, // fin get code operation 

      // return code de registre 
      getReg: function (reg) {
        let code;
        switch (reg.toUpperCase()) {
          case "AX": code = "000"; break;
          case "BX": code = "001"; break;
          case "CX": code = "010"; break;
          case "DX": code = "011"; break;
          case "EX": code = "100"; break;
          case "FX": code = "101"; break;
          case "SI": code = "110"; break;
          case "DI": code = "111"; break;
          default: code = "000"; break;
        }
        return code;
      }, // fin get code registre 

      // return true si reg est un registre false sinon 
      regexi: function (reg) {
        reg = reg.toUpperCase();
        if ( reg == "AX" || reg == "BX" || reg == "CX" || reg == "DX" || reg == "EX" || reg == "FX" || reg == "DI" ||reg == "SI")
          return true;
        else return false;
      }, // fin regexiste 

      // return true si reg est un registre d'adressage 
      regAdrExi: function (reg) {
        reg = reg.toUpperCase();
        if (reg == "BX" || reg == "SI" || reg == "DI") {
          return true;
        } else return false;
      }, // fin registre adressage existe 

      // Mode adressage 

      // return true si mode adressage direct 
      modeDirect: function (tabIns) {
        if (this.regexi(tabIns[1]) && this.regexi(tabIns[2])) {
          return true;
        }
        if (!(  this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) || this.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1))
          ) && ! this.modeBaseIndx(tabIns) ) {
          return true; }
        if (tabIns[0][tabIns[0].length - 1] == "I" &&(this.regexi(tabIns[1]) || (!this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&
              !this.modeBaseIndx(tabIns))) ) {
          return true; }
      }, // fin mode direct 

      // indirect 

      modeIndirct: function (tabIns) {
        if ((this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&  this.regexi(tabIns[2])) ||(this.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1)) &&
        this.regexi(tabIns[1])))
          return true;
        if (tabIns[0][tabIns[0].length - 1] == "I" && this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
          return true;
        else return false;
      }, // fin mode indirect 

      // mode base ou indexé 
      modeBaseIndx: function (tabIns) {
        if ( this.regexi(tabIns[1]) && tabIns[2].slice(1, tabIns[2].length - 1).indexOf("+") != -1 )
          return true;
        if (this.regexi(tabIns[2]) && tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1 )
          return true;
        if ( tabIns[0][tabIns[0].length - 1] == "I" && tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1 )
          return true;
        else return false;
      }, // fin  mode base ou indexé 

      // return le code de mode d'adressage 
      modeAdr: function (tabIns) {
        if (tabIns.length == 3) {
          if (tabIns[0] == "SHR" || tabIns[0] == "SHL" || tabIns[0] == "ROL" || tabIns[0] == "ROR"
          ) {   console.log("Mode d'Adressage : 00 (direct) ");
            return "00";
          } else if ( (util.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1) ||
            (util.getDel(tabIns[2], "[") != "" && tabIns[2].indexOf("[") != -1)) { console.log("Mode d'Adressage : 11 (Direct Indexé) ");
            return "11";
          } else {
            if (this.modeDirect(tabIns)) { console.log("Mode d'Adressage : 00 (direct) ");
              return "00";
            } else if (this.modeIndirct(tabIns)) { console.log("Mode d'Adressage : 01 (Indirect) ");
              return "01";
            } else if (this.modeBaseIndx(tabIns)) { console.log("Mode d'Adressage : 10 (Basé Indexé) ");
              return "10";
            }
          }
        } else if (tabIns.length == 2) {
          if (tabIns[0] == "LOAD") {
            if (this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
              return "01";
            else if ( this.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1  )
              return "11";
            else return "00";
          } else return "00";
        }
      }, // fin modeAdr

      // return destination 
      getDest: function (str) {
        if (this.regexi(str[1].toUpperCase())) {
          return "1";
        } else {
          return "0";
        }
      }, // fin get destination 


      // return Format 
      getFormat: function (ligne_str) {
        let taille = ligne_str.length;
        if (taille == 2) {
          if ( this.regexi(ligne_str[1]) || this.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)))
            return "0";
          else return "1";
        } else if (taille == 3) {
          if ( (this.regexi(ligne_str[1]) && this.regexi(ligne_str[2])) || (this.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)) &&
          this.regexi(ligne_str[2])) || (this.regAdrExi(ligne_str[2].slice(1, ligne_str[2].length - 1)) && this.regexi(ligne_str[1])) )
            return "0";
          else return "1"; }
      }, // fin getFormat 
 

}

export default coding ;