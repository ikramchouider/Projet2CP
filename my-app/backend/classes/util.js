import "./caseMemoire.js";
var util = {
  coderInst: function (strLigne, adr, dataTab) {
    let c;
    let i = 0;
    let str = strLigne[0] ; 
    console.log(strLigne[0]) ; 
    if (str[str.length - 1] == ":") {
      i = 1;
      c = new CaseMc(adr, "", str);
    }
    let valeur = util.getCop(strLigne[i]);

    console.log('mode:',util.modeAdr(strLigne)) ; 
    

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
      case "JNZ":
        ins = "001101";
        break ;
      case "JC":
        ins = "001110" ;
        break ;
      case "JS":
        ins = "010000" ;
        break;
        case "JNC":
          ins = "001111" ;
          break;
        case "JNS":
          ins = "010001" ;
          break ;
        case "JO" :
          ins = "010010" ;
          break ;
        case "JNO" :
          ins = "010011" ;
          break ;
        case "JE":
          ins = "010100";
          break;
        case "JNE":
          ins ="010101" ;
          break ;
  case "LOAD" :
          ins ="010110";
          break ;
        case "STORE":
          ins = "010111" ;
          break ;
        case "INC":
          ins = "011000" ;
          break ;
        case "DEC":
          ins = "011001";
          break ;
        case "NOT" :
          ins = "011010";
          break ;
        case "JMP":
          ins = "011011";
          break ;
        case "IN":
          ins = "011100";
          break;
        case "OUT":
          ins = "011101";
          break;
  case "START" :
          ins = "101000"
          break ;
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
          ins = "100110"
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
  regexi: function (reg){
    reg=reg.toUpperCase() ;
     if(reg == 'AX' || reg == 'BX' || reg == 'CX' || reg=='DX' || reg=='EX' || reg =='FX' || reg=='DI' || reg=='SI')
     return true ; 
     else return false ; 
  },
  modeDirect: function (tabIns){
    if (util.regexi(tabIns[1]) && util.regexi(tabIns[2]))  { return true ;}
    if (!(util.regAdrExi((tabIns[1]).slice(1,(tabIns[1]).length-1)) ||
    util.regAdrExi((tabIns[2]).slice(1,(tabIns[2]).length-1)) ) && ! util.modeBaseIndx(tabIns) ){ return true ;}
    if ( (tabIns[0])[(tabIns[0]).length-1] == 'I' && 
    (util.regexi(tabIns[1]) || (!(util.regAdrExi((tabIns[1]).slice(1,(tabIns[1]).length-1) )) 
    && ! util.modeBaseIndx(tabIns)) )) { return true ;} 

      
  },
  regAdrExi: function (reg) {
    reg=reg.toUpperCase() ;
   if (reg =='BX' || reg =='SI' || reg =='DI') { return true  ; } 
   else return false ; 
  },
  modeIndirct: function (tabIns) {
   if ( (util.regAdrExi((tabIns[1]).slice(1,(tabIns[1]).length-1)) && util.regexi(tabIns[2]) ) || (util.regAdrExi((tabIns[2]).slice(1,(tabIns[2]).length-1)) && util.regexi(tabIns[1])  ) )
     return true ; 
    if((tabIns[0])[(tabIns[0]).length-1] == 'I' &&  util.regAdrExi((tabIns[1]).slice(1,(tabIns[1]).length-1) ))
       return true ; 
     else return false ; 
  },
  modeBaseIndx: function (tabIns) {
        if(util.regexi(tabIns[1]) && (((tabIns[2]).slice(1,(tabIns[2]).length-1)).indexOf("+") !=-1 )) return true ; 
        if(util.regexi(tabIns[2]) && ( ((tabIns[1]).slice(1,(tabIns[1]).length-1)).indexOf("+") != -1)) return true ; 
        if ( (tabIns[0])[(tabIns[0]).length-1] == 'I' && ( ((tabIns[1]).slice(1,(tabIns[1]).length-1)).indexOf("+") != -1) ) return true ; 
        else return false ;
  },
  modeAdr: function (tabIns){      
    if (tabIns.length ==3) { 
      if ((util.getDel(tabIns[1],"[") != ""  &&  tabIns[1].indexOf('[') != -1) || (util.getDel(tabIns[2],"[") != ""  &&  tabIns[2].indexOf('[') != -1) ) {
        return'11'
 ;       }else {
      if (util.modeDirect(tabIns)){
        return '00' ; 
       }else if(util.modeIndirct(tabIns)){  return '01' ;}
       else if (util.modeBaseIndx(tabIns) ) { return '10' ; } }
    }
  },
  getDest: function (str) {
    if (this.regexi(str[2].toUpperCase())){ return "1" ;}
    else {return "0" ;}
  },

  removeExtraSpaces: function (str) {
    return str.replace(/\s+/g, " ");
  },
  incrementHex: function (hex) {
    const decimal = parseInt(hex, 16);
    const incremented = decimal + 1;
    return incremented.toString(16).toUpperCase();
  },

  remplirZero: function(str,n,gd) { //gd=0 -> des zeros à gauche , gd=1 -> à droite
    var s = "";
    const length = str.length ;
    if (gd==0) {
    for (let k = 0; k<n-length;k++){
      s += '0' ;
    }
    return (s+str);
  }
    else { 
      if (gd==1) {
        for (let k = 0; k<n-length;k++) {
          str += '0' ;
        }
        return (str) ;
      }
      else {
        throw new Error ('Le troisieme parametre doit etre 0 ou 1.') ;
      }
    }
  },
  getDel: function(str,delimiter) {
    
    let position = str.indexOf(delimiter); // Find position of delimiter
    
    if (position !== -1) { // Check if delimiter is found
      str = str.substring(0, position); // Delete characters after delimiter
    }
    return str ; 
  },
  getFormat: function (ligne_str) {
    let taille = ligne_str.length;
    if (taille == 2) {
      if (regexi(ligne_str[1])) return "0";
      else return "1";
    } else if (taille == 3) {
      //if (regexi(ligne_str[1]) && regexi(ligne_str[2]))
    } else return "0";
  },
  getDest: function (str) {
    if (this.regexi(str[2].toUpperCase())){ return "1" ;}
    else {return "0" ;}
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
  

  remplirZero: function(str,n) {
    var s = "";
    for (let k = 0; k<n-str.length;k++){
      s += '0' ;
    }
    return (s+str);
    
  }*/
};

export default util;
