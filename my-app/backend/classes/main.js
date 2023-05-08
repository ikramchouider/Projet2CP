import CaseMc from "./caseMemoire.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
import UAL from "./ual.js";
import registre from "./registre.js";
import RI from "./ri.js";
import { log } from "console";
import { INSPECT_MAX_BYTES } from "buffer";
import coding from "./coding.js";
import assembler from "./assembler.js";
var main = {
  dataTab: [],
  instrTab :[],
  tabEtiq : [],
  nbMot : [] ,
  Nbinst :0 ,
  indic: new registre("INDIC","0000") , 
  ual: new UAL("0", "0"),
  AX: new registre("AX", "0000"),
  BX: new registre("BX", "0000"),
  CX: new registre("CX", "0000"),
  DX: new registre("DX", "0000"),
  EX: new registre("EX", "0000"),
  FX: new registre("FX", "0000"),
  SI: new registre("SI", "0000"),
  DI: new registre("DI", "0000"),
  CO: new registre("CO", "000"),
  ACC: new registre("ACC", "0000"),
  ri: new RI(),

  
  getinstrTab: function () {
    return this.instrTab;
  },
  getDataTab: function () {
    return this.dataTab;
  },
  getIndic: function () {
    return this.indic;
  },
  getRI: function () {
    return this.ri;
  },
  getCO: function () {
    return this.CO;
  },
  setCO: function (val) {
    this.CO = this.CO;
  },
  setRI: function (val) {
    this.ri.setRI(val);
  },
  getAX: function () {
    return this.AX;
  },
  getBX: function () {
    return this.BX;
  },
  getCX: function () {
    return this.CX;
  },
  getDX: function () {
    return this.DX;
  },
  getEX: function () {
    return this.EX;
  },
  getFX: function () {
    return this.FX;
  },
  getSI: function () {
    return this.SI;
  },
  getDI: function () {
    return this.DI;
  },
  getACC: function () {
    return this.ACC;
  },
  getIndicateurZero: function () {
    return util.hexEnBinaire(this.getIndic().getContenu()).slice(-1);
  },
  getIndicateurSigne: function () {
    return util.hexEnBinaire(this.getIndic().getContenu())[14];
  },
  getIndicateurDebord: function () {
    return util.hexEnBinaire(this.getIndic().getContenu())[12];
  },
  getIndicateurRetenue: function () {
    return util.hexEnBinaire(this.getIndic().getContenu())[13];  
  },
  setIndicateurZero: function (val) {
    let contenuBin = util.hexEnBinaire(this.getIndic().getContenu()) ;
    contenuBin = (contenuBin.substring(0,15)).concat(val) ;
    this.indic.setContenu(util.remplirZero((util.binaryToHex(contenuBin)),4,0)) ; 
  },
  setIndicateurSigne: function (val) {
    let contenuBin = util.hexEnBinaire(this.getIndic().getContenu()) ;
    contenuBin = (contenuBin.substring(0,14)).concat(val,contenuBin.slice(-1)) ;
    this.indic.setContenu(util.remplirZero((util.binaryToHex(contenuBin)),4,0)) ;
  },
  setIndicateurRetenue: function (val) {
    let contenuBin = util.hexEnBinaire(this.getIndic().getContenu()) ;
    contenuBin = (contenuBin.substring(0,13)).concat(val,contenuBin.slice(-2)) ;
    this.indic.setContenu(util.remplirZero((util.binaryToHex(contenuBin)),4,0)) ;
  },
  setIndicateurDebord: function (val) {
    let contenuBin = util.hexEnBinaire(this.getIndic().getContenu()) ;
    contenuBin = (contenuBin.substring(0,12)).concat(val,contenuBin.slice(-3)) ;
    this.indic.setContenu(util.remplirZero((util.binaryToHex(contenuBin)),4,0)) ;
  },
  coder: function () {
    let indice = 0;
    let co;
    let adr = "";

   
   /* assembler.errorFunction("./test.txt") ; 
    console.log(console.log(assembler.getMessageError().length));
    for(let j=0;j<assembler.getMessageError().length;j++) console.log(assembler.getMessageError()[j]);*/
   const fileStream = fs.createReadStream("./test.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      if(line != "") {
      console.log("********************");
      let ligne_str = line.toString().trim();
      ligne_str = ligne_str.replace(",", " ");
      ligne_str = util.removeExtraSpaces(ligne_str);
      ligne_str = ligne_str.split(" ");
      console.log(ligne_str);
      if (ligne_str[0] == "ORG") {
        if (ligne_str[1].indexOf("H") != -1) {
          adr = ligne_str[1].slice(0, ligne_str[1].length - 1);
        } else console.log("ERROR");
        co = adr;
        this.setCO(co);
      } else if (ligne_str[0] == "START") {
      } else if (ligne_str[0] == "SETZ") {
        this.getDataTab().push(
          new CaseMc(
            util.remplirZero(indice.toString(16),3,0),"0000",
            ligne_str[1]
          )
        );
        indice++;
        for (let k=1; k < parseInt(ligne_str[2]); k++) {
          this.getDataTab().push(
            new CaseMc(
              util.remplirZero(indice.toString(16),3,0),"0000",
              ""
            )
          );
          indice++;
        }
      }
       else if (ligne_str[0] == "SET") {
        this.getDataTab().push(
          new CaseMc(
            util.remplirZero(indice.toString(16),3,0),
            util.remplirZero( ligne_str[2].slice(0, ligne_str[2].length - 1),4,0),
            ligne_str[1]
          )
        );
        indice++;
 //     } else if (ligne_str[0] == "STOP") {
      } else {
        let tab = coding.coderInst(ligne_str, co, this.getDataTab());
       main.nbMot.push([main.instrTab.length,tab.length]) ; //+co 
        main.instrTab=main.getinstrTab().concat(tab) ;
        co = util.incrementHex(co, tab.length);
      } 
    }
    });

    rl.on("close", () => {
      console.log("***  Data Segment *** ");
      for (let i = 0; i < this.getDataTab().length; i++)
        this.getDataTab()[i].afficher();
      console.log("********************** ");
      console.log("");
      console.log("***  Code Segment *** ");
      for (let i = 0; i < main.getinstrTab().length; i++) main.getinstrTab()[i].afficher();
      console.log("********************** ");
      this.Execute(main.getinstrTab());
      main.afficherRegistres() ;
      main.afficherIndicateurs() ;
      console.log("***  Data Segment *** ");
      for (let i = 0; i < this.getDataTab().length; i++)
        this.getDataTab()[i].afficher();
      console.log("********************** ");
      console.log(""); 

    }); 
   
  },
  Execute: function (instrTab) {
    let j = 0 ;
    let i = 0 ;
    this.Nbinst=0 ; 
    while (j < instrTab.length) {
      let instrBin = util.remplirZero(parseInt((instrTab[j].getVal()), 16).toString(2),16,0);
      this.setRI(instrBin) ;
      this.Nbinst =  main.nbMot[util.chercherDansTableauDeuxDimension(main.nbMot,j)][1] ; 
     
      switch (this.getRI().getCOP()) {
        case "000000": i = this.ual.opeRation("MOV",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
        j = i ; break ;
        case "100000": i = this.ual.opeRation("MOVI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
        j = i ; break ;
        case "000001":
        i = this.ual.opeRation("ADD",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
        j=i ; break ;
        case "000011":
        i = this.ual.opeRation("SUB",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
        j=i ; break ;
          case "000111":
            i = this.ual.opeRation("AND",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
          case "000110":
            i = this.ual.opeRation("OR",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
          case "011010":
            i = this.ual.opeRation("NOT",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
          case "100001":
            i = this.ual.opeRation("ADDI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
          case "100011":
            i = this.ual.opeRation("SUBI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
            case "001001":
              i = this.ual.opeRation("SHL",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "001000":
              i = this.ual.opeRation("SHR",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "100100":
              i = this.ual.opeRation("SBAI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "011000":
              i = this.ual.opeRation("INC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "011001":
              i = this.ual.opeRation("DEC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "000101":
              i = this.ual.opeRation("CMP",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "100101":
              i = this.ual.opeRation("CMPI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "011011":
              i = this.ual.opeRation("JMP",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "001100":
              i = this.ual.opeRation("JZ",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ; 
            case "001101":
              i = this.ual.opeRation("JNZ",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "001110":
              i = this.ual.opeRation("JC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "001111":
              i = this.ual.opeRation("JNC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010000":
              i = this.ual.opeRation("JS",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010001":
              i = this.ual.opeRation("JNS",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010010":
              i = this.ual.opeRation("JO",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010011":
              i = this.ual.opeRation("JNO",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010100":
              i = this.ual.opeRation("JE",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010101":
              i = this.ual.opeRation("JNE",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010110":
              i = this.ual.opeRation("LOAD",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "110110":
              i = this.ual.opeRation("LOADI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "010111":
              i = this.ual.opeRation("STORE",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "000010":
              i = this.ual.opeRation("ADA",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "100010":
              i = this.ual.opeRation("ADAI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
              j=i ; break ;
            case "000100": 
            i = this.ual.opeRation("SBA",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
            case "011110": 
            i = this.ual.opeRation("STOP",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
            j=i ; break ;
            default:
              break ; 

      }
      //j++ ;
      //this.Nbinst ++ ; 
    } 
  },

  afficherIndicateurs: function () {
    console.log("I_ZERO: ", this.getIndicateurZero());
    console.log("I_SIGNE: ", this.getIndicateurSigne());
    console.log("I_RETENUE: ", this.getIndicateurRetenue());
    console.log("I_DEBORD: ", this.getIndicateurDebord());
  },
 
    afficherRegistres: function () {
    console.log("AX: ", this.getAX().getContenu());
    console.log("BX: ", this.getBX().getContenu());
    console.log("CX: ", this.getCX().getContenu());
    console.log("DX: ", this.getDX().getContenu());
    console.log("EX: ", this.getEX().getContenu());
    console.log("FX: ", this.getFX().getContenu());
    console.log("SI: ", this.getSI().getContenu());
    console.log("DI: ", this.getDI().getContenu());
    console.log("ACC: ", this.getACC().getContenu());

  },
  
 
};

main.coder() ;

export default main;





