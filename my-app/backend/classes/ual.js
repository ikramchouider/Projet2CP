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
  
  opeRation = function (codeIns,dataTab,indicateurTab,instrTab,modeAdr,cpt, dest, format, param1, param2) {
    //addition registre registre et le resultat sera dans reg1 000000 00 0 1 REG1   REG2
    let somme = 0;
    let n = 0;
    let m = 0;
    let i=0 ; 
    if(codeIns[0]== "J") {
      return this.jmp(code,indicateurTab,cpt)  ; 
    }
    else if(codeIns== "SHR" || codeIns== "SHL" ) {
      this.decalageRotationLogique(codeIns,param1,instrTab,cpt) ; 
      return cpt+2 ; 
    }
    else if(codeIns== "ADA" || codeIns== "SBA" ) {
      if((modeAdr == "00") && dest == "1" && format == "0" ){
        this.immediaAccDirectCourt(code,param1) ; 
        return cpt+1 ; 
  
      }
      else if((modeAdr == "00") && dest == "0" && format == "1"){
        this.immediaAccDirectLong(codeIns,dataTab,instrTab,cpt) ; 
        return cpt+2 ; 
      }
    }
    else if(codeIns== "ADAI" || codeIns== "SBAI"){
  main.ACC.setContenu(this.operation(codeIns,main.ACC.getContenu(),instrTab[cpt+1].getVal())) ; 
    }
    else if(codeIns[codeIns.length-1] == "I" ){
    if((modeAdr == "00") && dest == "1" && format == "1" ){
      this.immediaDirectLongDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt)
      return cpt+2 ; 

    }
    else if((modeAdr == "00") && dest == "0" && format == "1"){
      this.immediaDirectLongNonDest(codeIns.slice(0,codeIns.length-1),instrTab,cpt)
      return cpt+3 ; 
    }
    else if((modeAdr == "01") && dest == "0" && format == "1") {
      this.immediaInDirectLongNonDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt) ; 
      return cpt+2
    }
    else if((modeAdr == "10") && dest == "0" && format == "1") {
      console.log(param1);
      this.immediaBaseIndexeLongNonDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt) ; 
      return cpt+3 ; 
    }
    }
    else if ((modeAdr == "00") && dest == "1" && format == "0") {
      this.directCourtDist(codeIns,param1,param2) ; 
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
    else if(modeAdr == "10" && format == "1"){
    if(dest == "1") {
      this.BaseIndexeLongDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
   }else{
    this.BaseIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ;
   }
   return cpt+2 ; 
  }
  }; 

  
  // Mode direct format court distination =1 
  directCourtDist = function(code,param1,param2) {
    let n = 0;
    let m = 0;
    let i=0 ; 
    switch (param2) {
        case "000":  m = main.AX.getContenu(); break;
        case "001":  m = main.BX.getContenu(); break;
        case "010":  m = main.CX.getContenu(); break;
        case "011":  m = main.DX.getContenu(); break;
        case "100":  m = main.EX.getContenu(); break;
        case "101":  m = main.FX.getContenu(); break;
        case "110":  m = main.SI.getContenu(); break;
        case "111": m = main.DI.getContenu();  break;
      }
      switch (param1) {
        case "000":
          n = main.AX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.AX.setContenu(main.ACC.getContenu());
          break;
        case "001":
          n = main.BX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.BX.setContenu(main.ACC.getContenu());
          break;
        case "010":
          n = main.CX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.CX.setContenu(main.ACC.getContenu());
          break;
        case "011":
          n = main.DX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.DX.setContenu(main.ACC.getContenu());
          break;
        case "100":
          n = main.EX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.EX.setContenu(main.ACC.getContenu());
          break;
        case "101":
          n = main.FX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.FX.setContenu(main.ACC.getContenu());
          break;
        case "110":
          n = main.SI.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.SI.setContenu(main.ACC.getContenu());
          break;
        case "111":
          n = main.DI.getContenu();
          main.ACC.setContenu(n);
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
              case "000": m = main.AX.getContenu(); main.ACC.setContenu(m); break;
              case "001": m = main.BX.getContenu(); main.ACC.setContenu(m); break;
              case "010": m = main.CX.getContenu(); main.ACC.setContenu(m); break;
              case "011": m = main.DX.getContenu(); main.ACC.setContenu(m); break;
              case "100": m = main.EX.getContenu(); main.ACC.setContenu(m); break;
              case "101": m = main.FX.getContenu(); main.ACC.setContenu(m); break;
              case "110": m = main.SI.getContenu(); main.ACC.setContenu(m); break;
              case "111": m = main.DI.getContenu(); main.ACC.setContenu(m); break;
            }
            main.ACC.setContenu(this.operation(code,dataTab[i].getVal(),m));
            dataTab[i].setVal(main.ACC.getContenu()) ; 
           } 
            else { 
              switch (param1) {
                case "000":
                  n = main.AX.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.AX.setContenu(main.ACC.getContenu());
                  break;
                case "001":
                  n = main.BX.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.BX.setContenu(main.ACC.getContenu());
                  break;
                case "010":
                  n = main.CX.getContenu();main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.CX.setContenu(main.ACC.getContenu());
                  break;
                case "011":
                  n = main.DX.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.DX.setContenu(main.ACC.getContenu());
                  break;
                case "100":
                  n = main.EX.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.EX.setContenu(main.ACC.getContenu());
                  break;
                case "101":
                  n = main.FX.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.FX.setContenu(main.ACC.getContenu());
                  break;
                case "110":
                  n = main.SI.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.SI.setContenu(main.ACC.getContenu());
                  break;
                case "111":
                  n = main.DI.getContenu();
                  main.ACC.setContenu(n);
                  main.ACC.setContenu(this.operation(code,n,m));
                  main.DI.setContenu(main.ACC.getContenu());
                  break;
              }
               
           }
    }

    // Mode indirect format Court distination =0 
    indirectCourtNonDest = function(code,param1,param2,dataTab) {
      let m = 0 ; 
      let n = 0; 
      switch (param1) {
        case "000": m = main.AX.getContenu(); main.ACC.setContenu(m); break;
        case "001": m = main.BX.getContenu(); main.ACC.setContenu(m); break;
        case "010": m = main.CX.getContenu(); main.ACC.setContenu(m); break;
        case "011": m = main.DX.getContenu(); main.ACC.setContenu(m); break;
        case "100": m = main.EX.getContenu(); main.ACC.setContenu(m); break;
        case "101": m = main.FX.getContenu(); main.ACC.setContenu(m); break;
        case "110": m = main.SI.getContenu(); main.ACC.setContenu(m); break;
        case "111": m = main.DI.getContenu(); main.ACC.setContenu(m); break;

    }
    let i  ; 
    switch (param2) {
      case "001":
        i = util.chercherAdr(dataTab,(main.BX.getContenu()).slice(1)) ; 
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
      
      case "110":
        i = util.chercherAdr(dataTab,main.SI.getContenu()) ;
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
      case "111":
        i = util.chercherAdr(dataTab,main.DI.getContenu()) ;
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
    }
    dataTab[i].setVal(main.ACC.getContenu()) ; 
    } //Fin Mode indirect format Court distination =0 

    //Mode indirect format Court distination =1
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
          n = main.AX.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.AX.setContenu(main.ACC.getContenu());
          break;
        case "001":
          n = main.BX.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.BX.setContenu(main.ACC.getContenu());
          break;
        case "010":
          n = main.CX.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.CX.setContenu(main.ACC.getContenu());
          break;
        case "011":
          n = main.DX.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.DX.setContenu(main.ACC.getContenu());
          break;
        case "100":
          n = main.EX.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.EX.setContenu(main.ACC.getContenu());
          break;
        case "101":
          n = main.FX.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.FX.setContenu(main.ACC.getContenu());
          break;
        case "110":
          n = main.SI.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.SI.setContenu(main.ACC.getContenu());
          break;
        case "111":
          n = main.DI.getContenu(); main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation(code,n,m));
          main.DI.setContenu(main.ACC.getContenu());
          break;
      }

    } // fin Mode indirect format Court distination =1

    //Mode BaseIndexe format Long  distination =1
    BaseIndexeLongDest = function(code,param1,param2,dataTab,instrTab,cpt) {
      let n = instrTab[cpt+1].getVal() ; 
      let m=0 ; 
      let i=0 ; 
      switch (param2) {
        case "001":
          main.ACC.setContenu(main.BX.getContenu());  m=util.additionHexa(n,main.BX.getContenu().slice(1)) ; main.ACC.setContenu(m); break;
        case "110":
          main.ACC.setContenu(main.SI.getContenu());  m=util.additionHexa(n,main.SI.getContenu().slice(1)) ; main.ACC.setContenu(m); break;
        case "111":
          main.ACC.setContenu(main.DI.getContenu());  m=util.additionHexa(n,main.DI.getContenu().slice(1)) ; main.ACC.setContenu(m); break;
      }
      
      i = util.chercherAdr(main.getDataTab(),util.remplirZero(m,3,0)) ;
      m=main.getDataTab()[i].getVal() ; 
      switch (param1) {
        case "000": n = main.AX.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.AX.setContenu(main.ACC.getContenu());
          break;
        case "001": n = main.BX.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.BX.setContenu(main.ACC.getContenu());
          break;
        case "010": n = main.CX.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.CX.setContenu(main.ACC.getContenu());
          break;
        case "011": n = main.DX.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.DX.setContenu(main.ACC.getContenu());
          break;
        case "100": n = main.EX.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.EX.setContenu(main.ACC.getContenu());
          break;
        case "101": n = main.FX.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.FX.setContenu(main.ACC.getContenu());
          break;
        case "110": n = main.SI.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.SI.setContenu(main.ACC.getContenu());
          break;
        case "111": n = main.DI.getContenu(); main.ACC.setContenu(this.operation(code,n,m)); main.DI.setContenu(main.ACC.getContenu());
          break;
      }

    } // FinMode BaseIndexe format Long  distination =1
    //Mode BaseIndexe format Long  distination =0
    BaseIndexeLongNonDest = function(code,param1,param2,dataTab,instrTab,cpt) {
      let m = instrTab[cpt+1].getVal() ; 
      let n=0 ;
      
        dataTab[i].setVal(m) ;
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
  } //JMP 
   //  comparaison direct 
  cmpDirect = function (code,param1,param2,indicateurTab,cpt) {
   let m=0 ;
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
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "001":
        n = main.BX.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "010":
        n = main.CX.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "011":
        n = main.DX.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "100":
        n = main.EX.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "101":
        n = main.FX.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "110":
        n = main.SI.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
      case "111":
        n = main.DI.getContenu();
        main.ACC.setContenu(n);
        this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
        break;
    }
      
  }  // FIN   comparaison direct

   //  comparaison Imm
  cmpImm = function (code,param1,instrTab,cpt) {
    let m= instrTab[cpt+1].getVal() ; 
     switch(param1) {
       case "000":
         n = main.AX.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
       case "001":
         n = main.BX.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
       case "010":
         n = main.CX.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m),code) ; 
         break;
       case "011":
         n = main.DX.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
       case "100":
         n = main.EX.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
       case "101":
         n = main.FX.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
       case "110":
         n = main.SI.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
       case "111":
         n = main.DI.getContenu();
         main.ACC.setContenu(n);
         this.mettreAjourIndicateur(this.operation(code,n,m)) ; 
         break;
     }
       
   } //  DIN comparaison Imm
   // mettre a jour les indicateurs 
   mettreAjourIndicateur = function(val) {
      if (val >0) {
        main.setIndicateurZero(0) ;
        main.setIndicateurSigne(0) ; 
        main.setIndicateurRetenue(0) ; 
        main.setIndicateurDebord(0) ;  

      } else if(val < 0) {
        main.setIndicateurZero(0) ;
        main.setIndicateurSigne(1) ; 
        main.setIndicateurRetenue(1) ; 
        main.setIndicateurDebord(0) ;
      }else {

        main.setIndicateurZero(1) ;
        main.setIndicateurSigne(0) ; 
        main.setIndicateurRetenue(0) ; 
        main.setIndicateurDebord(0) ;

      }
   } // FIN mettre a jour les indicateurs 
    operation = function(code,n,m ) {
      let res=0 ; 
      switch (code.toUpperCase()) {
        case "MOV": res=util.remplirZero(m,4,0);break; 
        case "ADD": res=util.remplirZero(util.additionHexa(n,m),4,0) ; break;
        case "SUB": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break;
        case "SUBA": ins = "000100"; break; 
        case "CMP": ins = "000101"; break;
        case "OR": res=util.remplirZero(util.OrHex(n,m),4,0) ; break;
        case "AND": res=util.remplirZero(util.AndHex(n,m),4,0) ; break; 
        case "SHR": res=util.remplirZero(util.decalageLogiqueHexadecDroit(n,m),4,0);  break; 
        case "SHL": res=util.remplirZero(util.decalageLogiqueHexadecGauche(n,m),4,0);   break; 
        case "ROL": res=rotationHexadecimal("ROL",n,m); break;
        case "ROR": res=rotationHexadecimal("ROR",n,m); break;
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
        case "MOVI": res=util.remplirZero(m,4,0); break;
        case "ADDI": res=util.remplirZero(util.additionHexa(n,m),4,0);break;
        case "ADAI": res=util.remplirZero(util.additionHexa(n,m),4,0); break;
        case "ADA": res=util.remplirZero(util.additionHexa(n,m),4,0) ; break ; 
        case "SUBI": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break;
        case "SBA": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ;
        case "SBAI": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break;
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