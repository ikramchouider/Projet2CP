
class RI {
  unSeulOp;
    remplirRI = (code) => {
    cop = code.substring(0, 5);
    ma  = code.substring(6, 7);
    f  = code.substring(8, 8);
    d  = code.substring(9 , 9);
    reg1 = code.substring(10,12);
    reg2 = code.substring(13,15);
    }
    getCOP
trouverCOP =(cop) => {
    if (cop.substring(0, 0) == '0') { 
  let ins;
  switch (cop.substring(1, 5)) 
  {case "00000" : ins = 'MOV';
   case "00001" : ins = 'ADD';
   case "00010" : ins = 'ADA';
   case "00011" : ins = 'SUB';
   case "00100" : ins = 'SUBA';
   case "00101" : ins = 'CMP';
   case "00110" : ins = 'OR';
   case "00111" : ins = 'AND';
   case "01000" : ins = 'SHR';
   case "01001" : ins = 'SHL';
   case "01010" : ins = 'ROL';
   case "01011" : ins = 'ROR';
   case "01100" : ins = 'JZ';
   case "01101" : ins = 'JNZ';
   case "01110" : ins = 'JC';
   case "01111" : ins = 'JNC';
   case "10000" : ins = 'JS';
   case "10001" : ins = 'JNS';
   case "10010" : ins = 'JO';
   case "10011" : ins = 'JNO';
   case "10100" : ins = 'JE';
   case "10101" : ins = 'JNE';
   case "10110" : ins = 'LOAD';
   case "10111" : ins = 'STORE';
   case "11000" : ins = 'INC';
   case "11001" : ins = 'DEC';
   case "11010" : ins = 'NOT';
   case "11011" : ins = 'JMP';
   case "11100" : ins = 'IN';
   case "11101" : ins = 'OUT';
   case "11110" : ins = 'STOP';
  }
    }
    else {
      switch (cop.substring(1, 5)) 
    {
   case "00000" : ins = 'MOVI';
   case "00001" : ins = 'ADDI';
   case "00010" : ins = 'ADAI';
   case "00011" : ins = 'SUBI';
   case "00100" : ins = 'SBAI';
   case "00101" : ins = 'CMPI';
   case "00110" : ins = 'ORI';
   case "00111" : ins = 'ANDI';
   case "10110" : ins = 'LOADI';
  }
     }
  
}     
trouverQuoiFaire = (ma,f,d) =>{
  if (f==0){
    if ()
  

  }else {

  }

}
// mov ax,bx
// comme entré un code binaire ( String ex RI = 1000000000000000 ) elle permet de reconaitre l'instruction à exec
 decodage = () => {

}
   
  }


  
  