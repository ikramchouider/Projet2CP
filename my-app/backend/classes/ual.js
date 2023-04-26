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
  add = function (dataTab,instrTab,modeAdr,cpt, dest, format, param1, param2) {
    //addition registre registre et le resultat sera dans reg1 000000 00 0 1 REG1   REG2
    let somme = 0;
    let n = 0;
    let m = 0;
    let i=0 ; 
    if ((modeAdr == "00") && dest == "1" && format == "0") {

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
      }
      switch (param1) {
        case "000":
          n = main.AX.getContenu();
          main.AX.setContenu(util.additionHexa(n, m));
          break;
        case "001":
          n = main.BX.getContenu();
          main.BX.setContenu(util.additionHexa(n, m));
          break;
        case "010":
          n = main.CX.getContenu();
          main.CX.setContenu(util.additionHexa(n, m));
          break;
        case "011":
          n = main.DX.getContenu();
          main.DX.setContenu(util.additionHexa(n, m));
          break;
        case "100":
          n = main.EX.getContenu();
          main.EX.setContenu(util.additionHexa(n, m));
          break;
        case "101":
          n = main.FX.getContenu();
          main.FX.setContenu(util.additionHexa(n, m));
          break;
      }
      return cpt+1 ;

    } 
    else if (modeAdr == "00" && format == "1") {
        //mode d'adr direct et l'instruc sur deux mot
          let i = util.chercherAdr(dataTab,(instrTab[cpt+1].getVal()).slice(1)) ;
             if(i==dataTab.length) {dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(1),0,""));
             } 
          //   m = dataTab[i].getVal() ; 
           if(dest == "0"){
            switch (param1) {
              case "000": m = main.AX.getContenu(); break;
              case "001": m = main.BX.getContenu(); break;
              case "010": m = main.CX.getContenu(); break;
              case "011": m = main.DX.getContenu(); break;
              case "100": m = main.EX.getContenu(); break;
              case "101": m = main.FX.getContenu(); break;
            }
          
          dataTab[i].setVal(util.remplirZero(util.additionHexa(dataTab[i].getVal(),m),4,0)) ; 
          return cpt+2
           } 
            else { 
              switch (param1) {
                case "000":
                  n = main.AX.getContenu();
                  main.AX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
                  break;
                case "001":
                  n = main.BX.getContenu();
                  main.BX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
                  break;
                case "010":
                  n = main.CX.getContenu();
                  main.CX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
                  break;
                case "011":
                  n = main.DX.getContenu();
                  main.DX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
                  break;
                case "100":
                  n = main.EX.getContenu();
                  main.EX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
                  break;
                case "101":
                  n = main.FX.getContenu();
                  main.FX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
                  break;
              }
              return cpt+2 ; 
             
           }

    }
     else if(modeAdr == "01" && format == "0") { 
          if(dest == "0") {
            switch (param2) {
              case "000": m = main.AX.getContenu(); break;
              case "001": m = main.BX.getContenu(); break;
              case "010": m = main.CX.getContenu(); break;
              case "011": m = main.DX.getContenu(); break;
              case "100": m = main.EX.getContenu(); break;
              case "101": m = main.FX.getContenu(); break;

          }
          let i  ; 
          switch (param1) {
            case "001":
              i = util.chercherAdr(dataTab,(main.BX.getContenu()).slice(1)) ; 
              dataTab[i].setVal(util.remplirZero(util.additionHexa((dataTab[i].getVal()).slice(1),m),4,0));
              break;
            
            case "110":
              i = util.chercherAdr(dataTab,main.SI.getContenu()) ;
              main.SI.setContenu(util.remplirZero(util.additionHexa((dataTab[i].getVal()).slice(1),m),4,0));
              break;
            case "111":
              i = util.chercherAdr(dataTab,main.DI.getContenu()) ;
              main.DI.setContenu(util.remplirZero(util.additionHexa((dataTab[i].getVal()).slice(1),m),4,0));
              break;
          }
          return cpt+1
        }

        else {
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
              main.AX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
              break;
            case "001":
              n = main.BX.getContenu();
              main.BX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
              break;
            case "010":
              n = main.CX.getContenu();
              main.CX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
              break;
            case "011":
              n = main.DX.getContenu();
              main.DX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
              break;
            case "100":
              n = main.EX.getContenu();
              main.EX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
              break;
            case "101":
              n = main.FX.getContenu();
              main.FX.setContenu(util.remplirZero(util.additionHexa(n,m),4,0));
              break;
          }

        }
    
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
      }
    }
  };
}
export default UAL;
