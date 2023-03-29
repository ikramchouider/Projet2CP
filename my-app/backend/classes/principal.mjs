import { util }  from "./util.js";
import  { CaseMc } from "./caseMemoire.js";
import readline  from 'readline';
import fs from 'fs';
var utile = {
    code : function() {
              let dataTab = [] ;
              let indice = 0 ; 
             
              

               const fileStream = fs.createReadStream('./test.txt');

               const rl = readline.createInterface({
               input: fileStream,
               crlfDelay: Infinity
                });

              rl.on('line', (line) => {
                console.log("********************") ; 
                let co ; 
                let Ligne_str = line.toString().trim();
                Ligne_str = Ligne_str.split(" ");
                console.log(Ligne_str[0]) ; 
                if(Ligne_str[0] == 'ORG') { const adr=Ligne_str[1] ; co = adr ; console.log(adr) ; }
                else if (Ligne_str[0] == 'START'){  }
                else if (Ligne_str[0] == 'SET' )  { 
                          dataTab.push(new CaseMc(indice.toString(16),Ligne_str[2],Ligne_str[1]) ) ;
                                                    let k=dataTab[0] ; console.log(dataTab[0].afficher);
                                                     indice ++ ;   }
                else if (Ligne_str[0] == 'STOP') { }
                else { 
                util.coderInst(Ligne_str,co,dataTab) ; co ++ ;  }   
               });

             rl.on('close', () => {
             
           });
              }
}

utile.code() ;