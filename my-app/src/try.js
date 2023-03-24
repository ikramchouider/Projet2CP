

class RI {
  
  constructor () {
    this.cop = null ;
    this.ma = null ;
    this.f = null ;
    this.d = null ;
    this.reg1 = null;
    this.reg2 = null ;
  } 

    remplirRI = (code) => {
    cop = code.substring(0, 5);
    ma  = code.substring(6, 7);
    f  = code.substring(8, 8);
    d  = code.substring(9 , 9);
    reg1 = code.substring(10,12);
    reg2 = code.substring(13,15);
    }

trouverMa = (ma) => {
  let mode ;
  switch (ma) {
    case "00" : mode = 'Direct' ;
    case "01" : mode = 'Indirect' ;
    case "10" : mode = 'Basé/Indexé' ;
    case "11" : mode = 'Direct Indexé' ;
  }
  console.log ("Le mode d'adressage est: "+mode) ;

}
trouverDest = (d) => {
  if (d==0) {

  }
}
trouverCop = (cop) => {
  var ins ;
  if (cop.substring(0, 1) == '0') {
  switch (cop.substring(1, 6)) 
  {case "00000" : ins = 'MOV'; break ;       
   case "00001" : ins = 'ADD'; break ;
   case "00010" : ins = 'ADA'; break ;
   case "00011" : ins = 'SUB'; break ;
   case "00100" : ins = 'SUBA'; break ;
   case "00101" : ins = 'CMP'; break ;
   case "00110" : ins = 'OR'; break ;
   case "00111" : ins = 'AND'; break ;
   case "01000" : ins = 'SHR'; break ;
   case "01001" : ins = 'SHL'; break ;
   case "01010" : ins = 'ROL'; break ;
   case "01011" : ins = 'ROR'; break ;
   case "01100" : ins = 'JZ'; break ;
   case "01101" : ins = 'JNZ'; break ;
   case "01110" : ins = 'JC'; break ;
   case "01111" : ins = 'JNC'; break ;
   case "10000" : ins = 'JS'; break ;
   case "10001" : ins = 'JNS'; break ;
   case "10010" : ins = 'JO'; break ; 
   case "10011" : ins = 'JNO'; break ; 
   case "10100" : ins = 'JE'; break ; 
   case "10101" : ins = 'JNE'; break ; 
   case "10110" : ins = 'LOAD'; break ; 
   case "10111" : ins = 'STORE'; break ;
   case "11000" : ins = 'INC'; break ; 
   case "11001" : ins = 'DEC'; break ;
   case "11010" : ins = 'NOT'; break ;
   case "11011" : ins = 'JMP'; break ;
   case "11100" : ins = 'IN'; break ;
   case "11101" : ins = 'OUT'; break ; 
   case "11110" : ins = 'STOP'; break ; 
  }
    }
    else {}
    
  return ins ;
}
} ;


  var ri = new RI() ;
  console.log(ri.trouverCop('000001'));



