import CaseMc from "./caseMemoire.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
import UAL from "./ual.js";
import registre from "./registre.js";
import RI from "./ri.js";
import { log } from "console";
import { INSPECT_MAX_BYTES } from "buffer";
var main = {
  dataTab: [],
  ual: new UAL("0", "0"),
  AX: new registre("AX", "0"),
  BX: new registre("BX", "0"),
  CX: new registre("CX", "0"),
  DX: new registre("DX", "0"),
  EX: new registre("EX", "0"),
  FX: new registre("FX", "0"),
  SI: new registre("SI", "0"),
  DI: new registre("DI", "0"),
  CO: new registre("CO", "0"),
  ri: new RI(),

  
  getDataTab: function () {
    return this.dataTab;
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
  coder: function () {
    let instrTab = [];
    let indice = 0;
    let co;
    let adr = "";
    
    const fileStream = fs.createReadStream("./test.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
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
      } else if (ligne_str[0] == "SET") {
        this.getDataTab().push(
          new CaseMc(
            util.remplirZero(indice.toString(16),3,0),
            ligne_str[2].slice(0, ligne_str[2].length - 1),
            ligne_str[1]
          )
        );
        indice++;
      } else if (ligne_str[0] == "STOP") {
      } else {
        let tab = util.coderInst(ligne_str, co, this.getDataTab());
        instrTab = instrTab.concat(tab);
        co = util.incrementHex(co, tab.length);
      }
    });

    rl.on("close", () => {
      console.log("***  Data Segment *** ");
      for (let i = 0; i < this.getDataTab().length; i++)
        this.getDataTab()[i].afficher();
      console.log("********************** ");
      console.log("");
      console.log("***  Code Segment *** ");
      for (let i = 0; i < instrTab.length; i++) instrTab[i].afficher();
      console.log("********************** ");
      this.Execute(instrTab);
      main.afficherRegistres() ;
      console.log("***  Data Segment *** ");
      for (let i = 0; i < this.getDataTab().length; i++)
        this.getDataTab()[i].afficher();
      console.log("********************** ");
      console.log("");

    });
    //return instrTab ;
  },
  Execute: function (instrTab) {
    let j = 0 ;
    let i = 0 ;
    while (j < instrTab.length) {
      console.log(j);
      let instrBin = util.remplirZero(parseInt((instrTab[j].getVal()), 16).toString(2),16,0);
      this.setRI(instrBin) ;
      console.log(this.getRI().getCOP()) ;
      switch (this.getRI().getCOP()) {
        case "000000": i = this.ual.mov(this.getDataTab(),instrTab,j,this.getRI().getMA(),this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
        j = i ; break ;
        case "000001":
          i = this.ual.add(this.getDataTab(),this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2());
          j=i ; break ;
      }
      //j++ ;
    }
    
  },
  afficherRegistres: function () {
    console.log("AX: ", this.getAX().getContenu());
    console.log("BX: ", this.getBX().getContenu());
    console.log("CX: ", this.getCX().getContenu());
    console.log("DX: ", this.getDX().getContenu());
    console.log("EX: ", this.getEX().getContenu());
    console.log("FX: ", this.getFX().getContenu());

  },
  
 
};

main.coder() ;

export default main;





