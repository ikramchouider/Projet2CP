
import { CaseMc } from "./caseMemoire.js";
var main = {
    coder : function() {
              let dataTab = [] ;
              let indice = 0 ; 
              console.log("********************") ;
            
              const readline = require('readline');
              const fs = require('fs');
              

               const fileStream = fs.createReadStream('./test.txt');

               const rl = readline.createInterface({
               input: fileStream,
               crlfDelay: Infinity
                });

              rl.on('line', (line) => {
                console.log("********************") ; 
                let ligne_str = line.toString().trim();
                ligne_str = ligne_str.split(" ");
                if(Ligne_str[0] == 'ORG') { const adr=Ligne_str[1] ; let co = adr ; console.log(adr) ; }
                else if (Ligne_str[0] == 'START'){  }
                else if (Ligne_str[0] == 'SET' )  { 
                   dataTab.push(new CaseMc(indice.toString(16),Ligne_str[2],Ligne_str[1]) ) ;
                                                      indice ++ ; console.log(dataTab) ; }                            
                else if (Ligne_str[0] == 'STOP') { }
                else {CoderIns(ligne_str,co,dataTab) ; co ++ ;  }   

              console.log(`Ligne: ${line}`);
               });

             rl.on('close', () => {
             console.log('Fin de la lecture du fichier.');
           });
              }
}

main.coder() ;