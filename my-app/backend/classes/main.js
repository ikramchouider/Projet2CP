import CaseMc from "./caseMemoire.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
import { log } from "console";
var main = {
  coder: function () {
    let dataTab = [];
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
        dataTab.push(
          new CaseMc(
            indice.toString(16),
            ligne_str[2].slice(0, ligne_str[2].length - 1),
            ligne_str[1]
          )
        );
        dataTab[indice].afficher();
        indice++;
      } else if (ligne_str[0] == "STOP") {
      } else {
        let tab=util.coderInst(ligne_str,co, dataTab) ; 
        instrTab = instrTab.concat(tab);
      for (let i = 0; i < instrTab.length; i++) instrTab[i].afficher();
        co = util.incrementHex(co,tab.length);
      }

    });

    rl.on("close", () => {
    });
  },
};

main.coder();
