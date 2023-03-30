import CaseMc from "./caseMemoire.js";
import util from "./util.js";
import readline from "readline";
import fs from "fs";
var main = {
  coder: function () {
    let dataTab = [];
    let instrTab = [] ; 
    let indice = 0;
    let co = "ABC";
    console.log("********************");

    const fileStream = fs.createReadStream("./test.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      console.log("********************");
      let ligne_str = line.toString().trim();
      ligne_str=ligne_str.replace(","," ") ; 
      ligne_str = util.removeExtraSpaces(ligne_str);
      ligne_str = ligne_str.split(" ");
      console.log(ligne_str);
      if (ligne_str[0] == "ORG") {
        const adr = ligne_str[1];
        let co = adr;
        console.log(adr);
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
        instrTab.concat(util.coderInst(ligne_str, parseInt(co, 16), dataTab)) ; 
        co = util.incrementHex(co,(util.coderInst(ligne_str, parseInt(co, 16), dataTab)).length) ; 
      } 

      console.log(`Ligne: ${line}`);
    });

    rl.on("close", () => {
      console.log("Fin de la lecture du fichier.");
    });
  },
};


main.coder();
