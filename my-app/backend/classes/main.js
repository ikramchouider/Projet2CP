import CaseMc from "./caseMemoire.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
import UAL from "./ual.js" ;
import registre from "./registre.js" ;
import { log } from "console";
var main = {

dataTab: [] , 
ual: new UAL ("0","0") ,
AX: new registre("AX","A") ,
BX: new registre("BX","1") ,
CX: new registre("CX","0") ,
DX: new registre("DX","0") ,
EX: new registre("EX","0") ,
FX: new registre("FX","0") ,

SI: new registre("SI","0") ,
DI: new registre("DI","0") ,

afficherRegistres: function() {
  console.log("AX: ",this.getAX().getContenu());
  console.log("BX: ",this.getBX().getContenu());
  console.log("CX: ",this.getCX().getContenu());
  console.log("DX: ",this.getDX().getContenu());
  console.log("EX: ",this.getEX().getContenu());
  console.log("FX: ",this.getFX().getContenu());
},
getDataTab: function(){
  return this.dataTab ;
},

  getAX: function() {
    return this.AX ;
  },
  getBX: function() {
    return this.BX ;
  },
  getCX: function() {
    return this.CX ;
  },
  getDX: function() {
    return this.DX ;
  },
  getEX: function() {
    return this.EX ;
  },
  getFX: function() {
    return this.FX ;
  },
  coder: function () {
    
    let instrTab = [];
    let indice = 0;
    let co ;
    let adr="" ; 
    console.log("********************");

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
        if(ligne_str[1].indexOf("H") != -1) {
        adr = ligne_str[1].slice(0,ligne_str[1].length - 1);} else console.log("ERROR");
        console.log(adr);
        co = adr;
      } else if (ligne_str[0] == "START") {
      } else if (ligne_str[0] == "SET") {
        this.getDataTab().push(
          new CaseMc(
            indice.toString(16),
            ligne_str[2].slice(0, ligne_str[2].length - 1),
            ligne_str[1]
          )
        );
        this.getDataTab()[indice].afficher();
        indice++;
      } else if (ligne_str[0] == "STOP") {
      } else {
        let tab=util.coderInst(ligne_str,co, this.getDataTab()) ; 
        instrTab = instrTab.concat(tab);
      for (let i = 0; i < instrTab.length; i++) instrTab[i].afficher();
        co = util.incrementHex(co,tab.length);
      }

    });
    
    
    rl.on("close", () => {
    });
  },
};
export default main;

main.coder();


//main.ual.add(main.dataTab,"0","1","000","001");
//main.afficherRegistres();

//dataTab.afficher() ;
