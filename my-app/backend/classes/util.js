import "./caseMemoire.js";
var util = {
  coderInst: function (strLigne, adr, dataTab) {
    let str = ""; 
    let instrTab = [] ; 
    if ((strLigne[0])[(strLigne[0]).length - 1] == ":") {
      str = strLigne[0] ; 
      strLigne.shift() ; 
    }
    let c = new CaseMc(adr,util.getCode(strLigne),str);
    instrTab.push(c) ; 
    if(util.getFormat(str) == '0' ) return instrTab ;   
    else if (((strLigne[0])[(strLigne[0]).length-1]).toUpperCase() == 'I' ) {
         if (util.modeAdr(strLigne) == '00' && util.getDest(strLigne) == '0') {
          instrTab.push(new CaseMc(this.incrementHex(adr,1),(strLigne[1]).slice(1,(strLigne[1]).length-1),"")) ;
          instrTab.push(new CaseMc(this.incrementHex(adr,1),strLigne[2],"")) ;
         } 
         if(util.modeAdr(strLigne) == '10' && util.getDest(strLigne) == '0'){
          instrTab.push(new CaseMc(this.incrementHex(adr,1),parseInt(getSubstringBetweenChars(strLigne[1],'+',']')).toString(16),"")) ;
         }
    }
  },
  getCode: function (str) {
    let code ; 
    if(str.length == 3){
    if (!util.regexi(str[1]) && util.regexi(str[2]) ){
      code = (util.getCop(str[0])).concat(util.modeAdr(str),util.getFormat(str),util.getDest(str),
      util.getReg(str[2]),'000') ; 
    }
   else  code = (util.getCop(str[0])).concat(util.modeAdr(str),util.getFormat(str),util.getDest(str),
                         util.getReg(str[1]),util.getReg(str[2])) ;
   } else code = (util.getCop(str[0])).concat(util.modeAdr(str),util.getFormat(str),util.getDest(str),
    util.getReg(str[1]),'000') ;
    return code ; 
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
  getReg: function (reg) {
    let code ; 
    switch(reg.toUpperCase()) {
      case 'AX' : code='000'  ; break ; 
      case 'BX' : code ='001' ; break ; 
      case 'CX' : code='010'  ; break ; 
      case 'DX' : code ='011' ; break ; 
      case 'EX' : code='100'  ; break ; 
      case 'FX' : code ='101' ; break ; 
      case 'SI' : code='110'  ; break ; 
      case 'DI' : code ='111' ; break ; 
      default   : code ='000' ; break ; 
    }
    return code ; 
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
      if(tabIns[0]== 'SHR' || tabIns[0]== 'SHL' || tabIns[0]== 'ROL' || tabIns[0]== 'ROR' ) return '00' ; 
      else if ((util.getDel(tabIns[1],"[") != ""  &&  tabIns[1].indexOf('[') != -1) || (util.getDel(tabIns[2],"[") != ""  &&  tabIns[2].indexOf('[') != -1) ) {
        return'11'
 ;       }else {
      if (util.modeDirect(tabIns)){
        return '00' ; 
       }else if(util.modeIndirct(tabIns)){  return '01' ;}
       else if (util.modeBaseIndx(tabIns) ) { return '10' ; } }
    }else if (tabIns.length == 2) {
       if(tabIns[0]== 'LOAD'){
        if (util.regAdrExi((tabIns[1]).slice(1,(tabIns[1]).length-1)) ) return '01' ;
        else if (util.getDel(tabIns[1],"[") != ""  &&  tabIns[1].indexOf('[') != -1 ) return '11'  ; 
        else return '00' ; 

       }
       else return '00' ; 
    }
  },
  getDest: function (str) {
    if (this.regexi(str[2].toUpperCase())){ return "1" ;}
    else {return "0" ;}
  },

  removeExtraSpaces: function (str) {
    return str.replace(/\s+/g, " ");
  },
  incrementHex: function (hex,n) {
    let decimal = parseInt(hex, 16);
    for(let i=0;i<n;i++) {
     decimal = decimal + 1; 
  } return decimal.toString(16).toUpperCase();
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
      if (util.regexi(ligne_str[1]) || util.regAdrExi((ligne_str[1]).slice(1,(ligne_str[1]).length-1))) return "0";
      else return "1";
    } else if (taille == 3) {
      if ((util.regexi(ligne_str[1]) && util.regexi(ligne_str[2])) || 
      (util.regAdrExi((ligne_str[1]).slice(1,(ligne_str[1]).length-1)) && util.regexi(ligne_str[2]) ) ||
      (util.regAdrExi((ligne_str[2]).slice(1,(ligne_str[2]).length-1)) && util.regexi(ligne_str[1]) )) return "0"
      else return "1" ; 
    } 
  },
  getDest: function (str) {
    if (this.regexi(str[1].toUpperCase())){ return "1" ;}
    else {return "0" ;}
  },
 getSubstringBetweenChars: function (str, startChar, endChar) {
    let startIndex = str.indexOf(startChar);
    if (startIndex === -1) {
      return '';
    }
    startIndex += 1;
    const endIndex = str.indexOf(endChar, startIndex);
    if (endIndex === -1) {
      return '';
    }
    return str.substring(startIndex, endIndex);
  },

  
};

export default util;
