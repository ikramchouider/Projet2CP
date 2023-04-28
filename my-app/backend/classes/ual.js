import main from "./main.js";
import util from "./util.js";
import registre from "./registre.js";
import CaseMc from "./caseMemoire.js";
class UAL {
  #eUal1;
  #eUal2;
  constructor(eUal1, eUal2) {
    this.#eUal1 = eUal1;
    this.#eUal2 = eUal2;
  }
  
  opeRation = function (codeIns,dataTab,instrTab,modeAdr,cpt, dest, format, param1, param2) {
    //addition registre registre et le resultat sera dans reg1 000000 00 0 1 REG1   REG2
    let somme = 0;
    let n = 0;
    let m = 0;
    let i=0 ; 
    if ((modeAdr == "00") && dest == "1" && format == "0") {
      this.directCourtDist(codeIns,param1,param2)
      return cpt+1 ;

    } 
    else if (modeAdr == "00" && format == "1") {
           this.directLong(codeIns,param1,param2,dataTab,instrTab,cpt,dest) ; 
           return cpt+2 ; 

    }
     else if(modeAdr == "01" && format == "0") { 
          if(dest == "0") {
           this.indirectCourtNonDest(codeIns,param1,param2,dataTab) ; 
        }

        else {
        this.indirectCourtDest(codeIns,param1,param2,dataTab) ; 
        }
        return cpt+1
    
    }
       
  }; 

  mov = function (dataTab,instrTab,cpt ,modeAdr, dest, format, param1, param2) {
    let m = "" ; 
    if (modeAdr == "00" && format == "1") {
        let i = util.chercherAdr(dataTab,(instrTab[cpt+1].getVal()).slice(1)) ;
        if(i==dataTab.length) {dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(1),0,""));
             } 
      if (dest == "0") {
        switch (param1) {
          case "000":
            m = main.AX.getContenu();
            break;
          case "001":
            m = main.BX.getContenu();
            break;
          case "010":
            m = main.CX.getContenu();
            break;
          case "011":
            m = main.DX.getContenu();
            break;
          case "100":
            m = main.EX.getContenu();
            break;
          case "101":
            m = main.FX.getContenu();
            break;
        }
       
      
        dataTab[i].setVal(util.remplirZero(m,4,0)) ;
       }
       else {
        m = dataTab[i].getVal();
        switch (param1) {
            case "000":
              m = main.AX.setContenu(m);
              break;
            case "001":
              m = main.BX.setContenu(m);
              break;
            case "010":
              m = main.CX.setContenu(m);
              break;
            case "011":
              m = main.DX.setContenu(m);
              break;
            case "100":
              m = main.EX.setContenu(m);
              break;
            case "101":
              m = main.FX.setContenu(m);
              break;
          }
       }
       return cpt+2 ;
    }
    else if (modeAdr == "00" && format == "0") {
      switch (param2) {
        case "000":
          m = main.AX.getContenu();
          break;
        case "001":
          m = main.BX.getContenu();
          break;
        case "010":
          m = main.CX.getContenu();
          break;
        case "011":
          m = main.DX.getContenu();
          break;
        case "100":
          m = main.EX.getContenu();
          break;
        case "101":
          m = main.FX.getContenu();
          break;
        case "110":
          m = main.SI.getContenu();
          break;
        case "111":
          m = main.DI.getContenu();
          break;
      }
      switch (param1) {
        case "000":
          main.AX.setContenu(m);
          break;
        case "001":
          main.BX.setContenu(m);
          break;
        case "010":
          main.CX.setContenu(m);
          break;
        case "011":
          main.DX.setContenu(m);
          break;
        case "100":
          main.EX.setContenu(m);
          break;
        case "101":
          main.FX.setContenu(m);
          break;
        case "110":
          main.SI.setContenu(m);
              break;
        case "111":
          main.DI.setContenu(m);
             break;
      }
    }
  };
  // Mode direct format court distination =1 
  directCourtDist = function(code,param1,param2) {
    let n = 0;
    let m = 0;
    let i=0 ; 
    switch (param2) {
        case "000":
          m = main.AX.getContenu();
          break;
        case "001":
          m = main.BX.getContenu();
          break;
        case "010":
          m = main.CX.getContenu();
          break;
        case "011":
          m = main.DX.getContenu();
          break;
        case "100":
          m = main.EX.getContenu();
          break;
        case "101":
          m = main.FX.getContenu();
          break;
        case "110":
         m = main.SI.getContenu();
           break;
          case "111":
          m = main.DI.getContenu();
          break;
      }
      switch (param1) {
        case "000":
          n = main.AX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.AX.setContenu(main.ACC.getContenu());
          break;
        case "001":
          n = main.BX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.BX.setContenu(main.ACC.getContenu());
          break;
        case "010":
          n = main.CX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.CX.setContenu(main.ACC.getContenu());
          break;
        case "011":
          n = main.DX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.DX.setContenu(main.ACC.getContenu());
          break;
        case "100":
          n = main.EX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.EX.setContenu(main.ACC.getContenu());
          break;
        case "101":
          n = main.FX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.FX.setContenu(main.ACC.getContenu());
          break;
        case "110":
          n = main.SI.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.SI.setContenu(main.ACC.getContenu());
          break;
        case "111":
          n = main.DI.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.DI.setContenu(main.ACC.getContenu());
          break;
      }

    } // Finnnn Mode direct format court distination =1 

    // Mode direct format Long distination =0 
    directLong = function(code,param1,param2,dataTab,instrTab,cpt,dest) {
      let n = 0;
      let m = 0;
      let i = util.chercherAdr(dataTab,(instrTab[cpt+1].getVal()).slice(1)) ;
             if(i==dataTab.length) {dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(1),0,""));
             } 
             m = dataTab[i].getVal() ; 
           if(dest == "0"){
            switch (param1) {
              case "000": m = main.AX.getContenu(); break;
              case "001": m = main.BX.getContenu(); break;
              case "010": m = main.CX.getContenu(); break;
              case "011": m = main.DX.getContenu(); break;
              case "100": m = main.EX.getContenu(); break;
              case "101": m = main.FX.getContenu(); break;
              case "110": m = main.SI.getContenu(); break;
              case "111": m = main.DI.getContenu(); break;
            }
            main.ACC.setContenu(this.operation(code,m,dataTab[i].getVal()));
            dataTab[i].setVal(main.ACC.getContenu()) ; 
           } 
            else { 
              switch (param1) {
                case "000":
                  n = main.AX.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.AX.setContenu(main.ACC.getContenu());
                  break;
                case "001":
                  n = main.BX.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.BX.setContenu(main.ACC.getContenu());
                  break;
                case "010":
                  n = main.CX.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.CX.setContenu(main.ACC.getContenu());
                  break;
                case "011":
                  n = main.DX.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.DX.setContenu(main.ACC.getContenu());
                  break;
                case "100":
                  n = main.EX.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.EX.setContenu(main.ACC.getContenu());
                  break;
                case "101":
                  n = main.FX.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.FX.setContenu(main.ACC.getContenu());
                  break;
                case "110":
                  n = main.SI.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.SI.setContenu(main.ACC.getContenu());
                  break;
                case "111":
                  n = main.DI.getContenu();
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.DI.setContenu(main.ACC.getContenu());
                  break;
              }
               
           }
    }
    indirectCourtNonDest = function(code,param1,param2,dataTab) {
      let m = 0 ; 
      let n = 0; 
      switch (param2) {
        case "000": m = main.AX.getContenu(); break;
        case "001": m = main.BX.getContenu(); break;
        case "010": m = main.CX.getContenu(); break;
        case "011": m = main.DX.getContenu(); break;
        case "100": m = main.EX.getContenu(); break;
        case "101": m = main.FX.getContenu(); break;
        case "110": m = main.SI.getContenu(); break;
        case "111": m = main.DI.getContenu(); break;

    }
    let i  ; 
    switch (param1) {
      case "001":
        i = util.chercherAdr(dataTab,(main.BX.getContenu()).slice(1)) ; 
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        main.BX.setContenu(main.ACC.getContenu());
        break;
      
      case "110":
        i = util.chercherAdr(dataTab,main.SI.getContenu()) ;
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        main.SI.setContenu(main.ACC.getContenu());
        break;
      case "111":
        i = util.chercherAdr(dataTab,main.DI.getContenu()) ;
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        main.DI.setContenu(main.ACC.getContenu());
        break;
    }
    }
    indirectCourtDest = function(code,param1,param2,dataTab) {
      let n=0 ; 
      let m=0 ; 
      let i=0 ; 
      switch (param2) {
        case "001":
          i = util.chercherAdr(dataTab,(main.BX.getContenu()).slice(1)) ;
          m = (dataTab[i].getVal()).slice(1)  
          break;
        
        case "110":
          i = util.chercherAdr(dataTab,main.SI.getContenu()) ;
          m = (dataTab[i].getVal()).slice(1) 
          break;
        case "111":
          i = util.chercherAdr(dataTab,main.DI.getContenu()) ;
          m = (dataTab[i].getVal()).slice(1) 
          break;
      }

      switch (param1) {
        case "000":
          n = main.AX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.AX.setContenu(main.ACC.getContenu());
          break;
        case "001":
          n = main.BX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.BX.setContenu(main.ACC.getContenu());
          break;
        case "010":
          n = main.CX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.CX.setContenu(main.ACC.getContenu());
          break;
        case "011":
          n = main.DX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.DX.setContenu(main.ACC.getContenu());
          break;
        case "100":
          n = main.EX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.EX.setContenu(main.ACC.getContenu());
          break;
        case "101":
          n = main.FX.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.FX.setContenu(main.ACC.getContenu());
          break;
        case "110":
          n = main.SI.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.SI.setContenu(main.ACC.getContenu());
          break;
        case "111":
          n = main.DI.getContenu();
          main.ACC.setContenu(this.operation(code,n,m));
          main.DI.setContenu(main.ACC.getContenu());
          break;
      }

    }
    operation = function(code,n,m ) {
      let res=0 ; 
      switch (code.toUpperCase()) {
        case "MOV": res=n ;break;
        case "ADD": res=util.remplirZero(util.additionHexa(n,m),4,0) ; break;
        case "SUB": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break;
        case "SUBA": ins = "000100"; break;
        case "CMP": ins = "000101"; break;
        case "OR": res=util.remplirZero(util.OrHex(n,m),4,0) ; break;
        case "AND": res=util.remplirZero(util.AndHex(n,m),4,0) ; break; 
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
      return res;
    }
  
  
}


export default UAL;
