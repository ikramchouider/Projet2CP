var util = {
    coder : function() {
              const readline = require('readline');
              const fs = require('fs');
              

               const fileStream = fs.createReadStream('./test.txt');

               const rl = readline.createInterface({
               input: fileStream,
               crlfDelay: Infinity
                });

              rl.on('line', (line) => {
              console.log(`Ligne: ${line}`);
              
               });

             rl.on('close', () => {
console.log('Fin de la lecture du fichier.');
           });
              }
}

util.coder() ;
