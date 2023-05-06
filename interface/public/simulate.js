/*************************************************************************
Ce fichier contient des opérations elementaires à notre appliquation que ca 
soit la logique de l'exécution ou encore les evenements
*************************************************************************/

// l'objet dans lequel on a la fonction des erreurs 
export var assembler = {

    // First Function : assembler.errorFunction 
    errorFunction: function (contents) {
  
      let i = 0;
      let e,t;
      let nbLigne = 0;
      let nbError = 0;
      let trouvOrg = false;   // pour pouvoir detecter si on a écrit le ORG 2 fois  : error 
      let trouvStart = false; // pour pouvoir detecter si on a écrit le START 2 fois / avant org ou bien on la pas éctit du tout  : error 
      let trouvStop = false;  // pour pouvoir detecter si on a écrit le STOP au milieu mais pas à la fin : error 
      let dirtybit = false;   // Au cas où on a besoin d'arreter le traitement à cause d'une erreur qui va empecher ce dernier
      let dirtystart = false;
      let dirtyetiq = false;
      let dirtyline = false;
      let dirtyvar = false;
      let dirtyspace=false;
      let dirtyetiq2= false;
      let jumpbit = false;
      let tabNomVariable = [];
      const messageDiv = document.getElementById("messageDiv");
      const nblg = document.getElementById("NbLigne")
      messageDiv.style.background= '#010232';
      nblg.style.background='#010232';
  
      messageDiv.innerHTML = ""; 
        let lines = contents.split('\n');
        console.log(contents);
        lines = lines.filter(line => line.trim() !== '');    // remove the empty lines from my filecontents : the table lines which represents the lines of the file 
        let fileLength = lines.length;                     // file length without  the empty lines 
        for (const line of lines) {
          nbLigne++;
          if (line != "") {
            let ligne_str = line.toString().trim();          // Enlever les espaces  de debut et fin de line
            ligne_str = ligne_str.replace(",", " ");         // Remplacer les ',' par des blancs pour les traitements qui suivent 
            ligne_str = util.removeExtraSpaces(ligne_str);   // Enlever plus d'un blanc ( remove extra spaces )
            ligne_str = ligne_str.split(" ");                // Diviser la ligne en mots séparés par des blans pour pouvoir les manipuler mot par mot . les mots sont mits dans un tableau
  
  
  
            // Tester les conditions sur ORG
            if (ligne_str[0].toUpperCase() == 'ORG') 
            {
              if (trouvOrg == true) {
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut ecrire une seule fois ORG </span></p>";
                nbError++;
              }
              if (i != 0 && !dirtystart && !trouvOrg) {
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut commencer par ORG </span></p>";
                nbError++;
              }
              if (ligne_str.length != 2 ) {
                if(!trouvOrg){
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color:#9ca3af; '> : Il faut specifier l'adresse debut dans ORG </span></p>";
                nbError++;
                dirtystart=true;
                }
              } else {
                e = util.checkNumber(ligne_str[1], nbLigne);
                nbError+=e;
              }
              trouvOrg=true;
            } // fin conditions sur ORG
  
  
            // tester les conditions sur START 
            else if (ligne_str[0].toUpperCase() == 'START') 
             {
              if (trouvOrg == false) {
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut ecrire ORG au départ , avant d'arriver à START </span></p>";
                nbError++;
              }
              if (trouvStop == true) {
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il ne faut pas que STOP soit écrit avant d'arriver à START </span></p>";
                nbError++;
              }
              trouvStart = true;
  
            } // fin conditions sur START
  
  
            else if (ligne_str[0].toUpperCase() == 'SET')  // tester les conditions sur SET
            {
               e = util.isVariableNameValid(ligne_str[1], nbLigne);
              if (e != 0) {
                nbError+=e; 
                t=nbLigne;
                dirtybit = true; 
              }
              
              if (trouvOrg == false) { 
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut specifier l'adresse debut dans ORG avant de declarer les variables </span></p>";
                nbError++;
              }
  
              if (trouvStart == true){ 
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut declarer les variables avant START  </span></p>";
                nbError++;
              }
  
              if (ligne_str.length != 3 && (!dirtybit || t != nbLigne)) {
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut specifier le nom de la donnée et lui attribuer une valeur  </span></p>";
                nbError++;
                dirtyvar= true;
                t=nbLigne;
              }
  
              if (ligne_str.length == 3 ) {
                e = util.checkNumber(ligne_str[2], nbLigne);
                nbError+=e;
                console.log("taille du tab var : ",tabNomVariable.length);
                if (tabNomVariable.indexOf(ligne_str[1]) !== -1) { 
                  messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Variable deja declarée !  </span></p>";
                  nbError++;
                } else { 
                 tabNomVariable.push(ligne_str[1]); 
                }
              }
  
              
            }// fin conditions sur SET
  
  
            else if (ligne_str[0].toUpperCase() == 'STOP') // tester les conditions sur STOP
            { 
              if (trouvStop) {
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut ecrire STOP une seule fois  </span></p>";
                nbError++;
              }
              trouvStop = true;
            } 
            else if (!trouvStop && (nbLigne == fileLength)) {
              messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut terminer par STOP  </span></p>";
              nbError++;
            }
            // fin condition sur stop
  
  
  
            else // on est dans le cas d'une instruction  
            {
  
              if ((ligne_str[0])[0].toUpperCase() == "J"){
                jumpbit = true;
                t = nbLigne;
              }
  
              if (trouvStart==false){
                messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut mettre START dans votre programme après la déclaration des variables   </span></p>";
                nbError++;
      
               }
              // traitement des étiquettes 
              if (line.indexOf(":") != -1)    // On a trouvé les ':'
              {
                if (ligne_str[0][ligne_str[0].length - 1] == ":")   // les ':' et l'etiquette sont collés
                {
                   if (ligne_str.length == 1)  // on a sauter de ligne après l'etiquette 
                  {
                   dirtyetiq = true;
                   t=nbLigne;
                   messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut mettre l'etiquette dans la meme ligne que l'instruction </span></p>";
                   nbError++;
                  } else { // l'etiq est correcte on a juste à décaler pour travailler avec la suite en tant que instruction normale
                    ligne_str.shift(); 
  
                    // début traitement ins normale
  
                    if (ligne_str[0].indexOf('I') != -1){
                      if (coding.regexi(ligne_str[2]) || !util.estHexadecimal(ligne_str[2].slice(0,ligne_str[2].length-1))) {
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut donner une valeur immédiate  </span></p>";
                        nbError++;
                      }
                      console.log("are you inside this ?");
                      if (ligne_str[2].indexOf("H")== -1){
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut écrire le 'H' qui signifie la base Hexadécimal  </span></p>";
                        nbError++;
                      }
                      
                    }
                    if (coding.getCop(ligne_str[0]) == -1 && !dirtyline) { 
                    messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut que ca soit une instruction parmi le jeu d'instructions  </span></p>";
                   nbError++;
                    }
  
                   if (line.indexOf(",") == -1 && !dirtyline) {
                      if (!util.instUnSeulOp(ligne_str[0])) { 
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> :  Il faut mettre ',' entre les operandes  </span></p>";
                        nbError++;
                      }
                    }
               
                    if (line.indexOf("[") != -1 && !dirtyline) {
                      if ((line.slice(line.indexOf("[") + 1, line.indexOf("]"))).indexOf(" ") != -1) {
                         messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut pas laisser des espaces entre '[' et ']'   </span></p>";
                         nbError++;
                         dirtyspace=true;
                         t=nbLigne;
                        }
                      else if (coding.regexi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) {
                        if (!coding.regAdrExi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) { 
                          messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> :  Il faut mettre un registre d'adressage ' BX SI DI '  entre '[' et ']'   </span></p>";
                          nbError++;
                          dirtyspace=true;
                          t=nbLigne;
                        }
                      }
                    }
               if (!dirtyline){
                    if (!coding.regexi(ligne_str[1]) && ligne_str[1].indexOf("[") == -1 ){
                      if (tabNomVariable.indexOf(ligne_str[1]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                       console.log("first herre the first param is not a reg");
                        nbError++;
                      }
                    }else if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) && (ligne_str[0].indexOf('I')==-1)){
                      if (tabNomVariable.indexOf(ligne_str[2]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                        console.log("first herre the second param is not a reg");
                        nbError++;
                      }
                    }
  
  
                  }
                    // fin traitement ins normale 
  
                  }
  
                } else {    // les ':' et l'etiquette ne sont pas collés 
                  if (ligne_str[0].indexOf(":") != -1){
                    messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut  laisser un espace entre l'etiquette et l'instruction  </span></p>";
                  nbError++;
                   }else {
                  messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut pas laisser des espaces entre le nom de l'etiquette et ':'  </span></p>";
                  nbError++;}
                  if (ligne_str.length == 2)  // on a sauter de ligne après l'etiquette 
                  {
                  dirtyetiq = true;
                  messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut mettre l'etiquette dans la meme ligne que l'instruction </span></p>";
                  nbError++;
                  }else { //pas de saut de ligne 
                    ligne_str.shift(); 
                    ligne_str.shift();
                  }
                }
              } // fin condition ':' trouvé
  
             else if (!dirtyetiq ) { // on a pas trouvé une étiq avec ':' 
                if (ligne_str.length > 3 && line.indexOf("[") == -1) {
                   messageDiv.innerHTML += "<p class='errormsg'><span style='color:rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut mettre ':' à la fin du nom de l'etiquette voulue  </span></p>";
                   nbError++;
                   dirtyetiq2= true;
                  } else if (ligne_str.length==1){
                    messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut mettre ':' à la fin du nom de l'etiquette voulue et ne pas sauter de ligne après l'étiquette ! </span></p>";
                    dirtyline=true;
                    nbError++;
                   }
  
                    if ( coding.getCop(ligne_str[0]) == -1 && !dirtyline) { 
                    messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> :  Il faut que ca soit une instruction parmi le jeu d'instructions  </span></p>";
                   nbError++;
                    }
  
  
                    if (ligne_str[0].indexOf('I') != -1){
                      if (coding.regexi(ligne_str[2]) || !util.estHexadecimal(ligne_str[2].slice(0,ligne_str[2].length-1))) {
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut donner une valeur immédiate  </span></p>";
                        nbError++;
                      }
                      if (ligne_str[2].indexOf("H")== -1){
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut écrire le 'H' qui signifie la base Hexadécimal  </span></p>";
                        nbError++;
                      }
                  
  
                    }
  
                   if (line.indexOf(",") == -1 && !dirtyline) {
                      if (!util.instUnSeulOp(ligne_str[0])) { 
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut mettre ',' entre les operandes  </span></p>";
                        nbError++;
                      }
                    }
               
                    if (line.indexOf("[") != -1 && !dirtyline) {
                      if ((line.slice(line.indexOf("[") + 1, line.indexOf("]"))).indexOf(" ") != -1) {
                         messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut pas laisser des espaces entre '[' et ']'   </span></p>";
                         nbError++;
                         dirtyspace=true;
                         t=nbLigne;
                        }
                      else if (coding.regexi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) {
                        if (!coding.regAdrExi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) { 
                          messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut mettre un registre d'adressage ' BX SI DI '  entre '[' et ']'   </span></p>";
                          nbError++;
                          dirtyspace=true;
                          t=nbLigne;
                        }
                      }
                    }
               if (!dirtyline){
                    if (!coding.regexi(ligne_str[1]) && ligne_str[1].indexOf("[") == -1 ){
                      if (tabNomVariable.indexOf(ligne_str[1]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                       console.log("first herre the first param is not a reg");
                        nbError++;
                      }
                    }else if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) && (ligne_str[0].indexOf('I')==-1)){
                      if (tabNomVariable.indexOf(ligne_str[2]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                        console.log("first herre the second param is not a reg");
                        nbError++;
                      }
                    }
  
  
                  }
  
  
              }
            }  // fin traitement instructions
           
            i++;
          } 
        };
        console.log("taille du tab var : ",tabNomVariable.length);
        if (nbError!=0){     
         messageDiv.innerHTML += "<p class='errormsg'><span style='color: #9ca3af; '>Nombre d'erreur : <span style='color: rgb(150, 10, 10);'> " + nbError + "</span></span></p>";
      } else {
        messageDiv.innerHTML += "<p class='errormsg'><span style='color: #9ca3af; '>Nombre d'erreur : <b><span style='color: green;'> " + nbError + "</span></b></span></p>";
      }
        console.log("Nombre d'erreur : ",nbError);
      //};
     // reader.readAsText(file);
  
    },// fin fonction error
  
    fromFileInputToTextZone: function (fileId, textZoneId) {
  
      const fileInput = document.getElementById(fileId);
       
      /*if (fileInput.files.length === 0) {
        alert("Please select a file to import.");
        return;
      }else 
      alert("fichier importé avec succès ! cliquer sur afficher contenu pour travailler sur son contenu ")*/
      const file = fileInput.files[0];
      const reader = new FileReader();
      const textDiv = document.getElementById(textZoneId);
      textDiv.style.backgroundColor="#010232";
      //textDiv.style.color="white";
      reader.onload = (event) => {
        const contents = event.target.result;
        let lines = contents.split('\n');
        lines = lines.filter(line => line.trim() !== '');    
        const fileLength = lines.length;                     
        let textContent = "";
        for (const line of lines) {
          textContent += line + "\n";
        }
        textDiv.textContent = textContent;
      };
      reader.readAsText(file);
    },
     
   fromFileNameToTextZone: function (contents){
    const textDiv = document.getElementById("code");
    messageDiv.innerHTML = ""; 
    console.log("contents from fromFileNameToTextZone     : \n"+ contents);
    let lines = contents.split('\n');
    lines = lines.filter(line => line.trim() !== '');    
    let textContent = "";
    for (const line of lines) {
      textContent += line + "\n";
    }
    textDiv.textContent = textContent;
  
  },
  
    fromTextZoneToPASSE_File: function(){
      
    },
  
  }
  // fin obj assembler
  
  
  
  
  
  // class case mémoire
  class CaseMc {
    #val;
    #adr;
    #etiq;
  
    constructor(adr, val, etiq) {
      this.#adr = adr;
      this.#val = val;
      this.#etiq = etiq;
    }
    setVal(val) {
      this.#val = val;
    }
    getVal() {
      return this.#val;
    }
    getEtiq() {
      return this.#etiq;
    }
    getAdr() {
      return this.#adr;
    }
    afficher() {
      console.log(`ETIQ: ${this.#etiq}         @${this.#adr}   ${this.#val}`);
    }
  
    afficherHTML(){
      messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> ETIQ: </span>"+"<span style='color: white;'>"+ this.#etiq+"</span>"+"<span style='color: #A32185;'>"+"   @"+"</span>"+"<span style='color: white;'>"+ this.#adr+"  "+ this.#val +"</span>"+" </p>";
  
    }
  
    /*getCOP() {
      let val = this.hexToBinary(this.getVal());
      return code.substring(0, 6);
    }*/
  
    hexToBinary(hex) {
      return parseInt(hex, 16).toString(2);
    }
  }
  //fin classe case mémoire
  
  
  
  
  // coding.js no need to import it   
  export var coding = {
    // debut coderInst "codage des instructions " return tableau des mots memoir apres codage de l'instruction 
    coderInst: function (strLigne, adr, dataTab) 
    {
      
      let str = "";
      let instrTab = new Array();
      if (strLigne[0][strLigne[0].length - 1] == ":") {
        if(main.tabEtiq.length > 0) {
          let indice  = util.chercherDansTableau(main.tabEtiq,strLigne[0].slice(0,strLigne[0].length-1)) ; 
          if(indice<main.tabEtiq.length){
            let adresse = main.tabEtiq[indice].getAdr();
            let indice2 = util.chercherAdr(main.instrTab,adresse)
            main.instrTab[indice2].setVal(util.remplirZero(adr,4,0)) ;
            
          }
  
        }
        str = strLigne[0].slice(0,strLigne[0].length-1);
        strLigne.shift();
      }
      
  
      instrTab.push(
        new CaseMc(adr,util.binaryToHex(coding.getCode(strLigne)),str)
      );
      
      if(strLigne.length >2) {
        if(strLigne[0].toUpperCase() == "SHL" || strLigne[0].toUpperCase() == "SHR" || strLigne[0].toUpperCase() == "ROL" || strLigne[0].toUpperCase() == "ROR" ) {
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr,strLigne[2], ""));
          for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
          return  instrTab ; 
        }
      else if (coding.getFormat(strLigne) == "0") {
        for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
        return instrTab;
      } else if (strLigne[0][strLigne[0].length - 1].toUpperCase() == "I") {
  
        if (coding.modeAdr(strLigne) == "00" && coding.getDest(strLigne) == "0") {
          if (strLigne[1].indexOf("[") != -1) {
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 2), "") // remplir 0 remplirZero
            );
            console.log("val=  "+strLigne[1].slice(1, strLigne[1].length - 1));
          } else {
            let indice = util.chercherDansTableau(dataTab, strLigne[1]);
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
          }
        //  adr = util.incrementHex(adr, 1);
          if (strLigne[2].indexOf("H") != -1) {
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
            );
          } else { adr = this.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr, strLigne[2], ""));}
          for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
          return instrTab;
        }
        else if((coding.modeAdr(strLigne) == "00" && coding.getDest(strLigne) == "1") ||  (coding.modeAdr(strLigne)== "01")) {
          adr = util.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
          );
        }
        else if (coding.modeAdr(strLigne) == "10" && coding.getDest(strLigne) == "0") {
          adr = util.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr,parseInt(util.getSubstringBetweenChars(strLigne[1], "+", "]")).toString(16 ),""));
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
            );
        }
        for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
        return instrTab;
      } else if (coding.modeAdr(strLigne) == "00") {
        if (coding.getDest(strLigne) == "0") {
          if (strLigne[1].indexOf("[") != -1) {
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 2), "") // remplir 0 remplirZero
            );
          } else { 
            let indice = util.chercherDansTableau(dataTab, strLigne[1]);
            adr = util.incrementHex(adr, 1);
            //instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
            instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
            
          }
        } else {
          if (strLigne[2].indexOf("[") != -1) {
            adr = util.incrementHex(adr, 1);
            instrTab.push(
              new CaseMc(adr, strLigne[2].slice(1, strLigne[2].length - 2), "") // remplir 0 remplirZero
            );
          } else {
            let indice = util.chercherDansTableau(dataTab, strLigne[2]);
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
          }
        }
      } else {if (coding.modeAdr(strLigne) == "10") {
        if (coding.getDest(strLigne) == "0"){ //MOV [BX+3], AX
          let regEtDepl = strLigne[1].slice(1, strLigne[1].length - 1) ;
          let depl = "";
          if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
              else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        }
        else {  
          let regEtDepl = strLigne[2].slice(1, strLigne[2].length - 1) ;
          let depl = "";
          if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
          else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        }
    } else if (coding.modeAdr(strLigne) == "11") {
       if(coding.getDest(strLigne) == "1") {
        let indice = util.chercherDansTableau(dataTab, strLigne[2].slice(0,strLigne[2].indexOf("[")));
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
        let regEtDepl = strLigne[2].slice(strLigne[2].indexOf("[")+1, strLigne[2].length - 1) ;
          let depl = "";
          if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
          else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
       }else {
        let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
  
          let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
          let depl = "";
          if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
          else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
  
       }
          
    }}
  
  for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
  return instrTab;
      } else {
        if ((strLigne[0])[0] == "J"){
           
           adr = util.incrementHex(adr, 1);
             let indice = util.chercherDansTableau(main.instrTab,strLigne[1]) ; 
             if(indice<(main.instrTab).length){
               instrTab.push(new CaseMc(adr,util.remplirZero(main.instrTab[indice].getAdr(),3,0)),"");
             }else{
               instrTab.push(new CaseMc(adr,"","")) ; 
               main.tabEtiq.push(new CaseMc(adr,"",strLigne[1])) ; 
             }
           
        }
        else if(this.getFormat(strLigne) == "1" ) {
          if(strLigne[0][strLigne[0].length - 1].toUpperCase() != "I"){
          if (strLigne[1].indexOf("[") != -1 ) {
            if(strLigne[1][0] != "[") {
              let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
              adr = util.incrementHex(adr, 1);
              instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
              let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
               let depl = "";
              if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
               else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
               adr = util.incrementHex(adr, 1);
               instrTab.push(new CaseMc(adr, depl.toString(16), ""));
  
            }
            else{
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 2), "")); // remplir 0 remplirZero 
            }
          } else {
            let indice = util.chercherDansTableau(dataTab, strLigne[1]);
           
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr, dataTab[indice].getAdr(), ""));
          }
          for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
          return  instrTab ; 
        }
        else {
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr,strLigne[1].slice(0, strLigne[1].length - 1), ""));
          for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
          return  instrTab ; 
        }}
      } 
      for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }
      return instrTab;
    
  }, // fin coder instruction 
  
  
      // return code binaire de l'instruction 
      getCode: function (str) {
        let code; 
        if (str.length == 3) {
          if (this.regexi(str[1]) && this.regexi(str[2])){
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(str[2]));
            
          }
          else if (!this.regexi(str[1]) && this.regexi(str[2]) ) {
            if(this.regexi(str[1].slice(1,str[1].length-1))) 
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),this.getReg(str[1].slice(1,str[1].length-1)));
            else if ((str[1].indexOf("[") != -1 ) && (str[1].indexOf("+") != -1)) {
              let modeAdr= this.modeAdr(str) ; 
              if(str[1][0] != "["){
                   let regEtDepl = (str[1].slice(str[1].indexOf("["),str[1].length)).slice(1, str[1].length - 1) ;
                   let reg = "" ;
                   if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
                   else {reg = regEtDepl.slice(-2);}
                   code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(str[2]),this.getReg(reg));
              } 
              else{
              let regEtDepl = str[1].slice(1, str[1].length - 1) ;
              let reg = "" ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(str[2]),this.getReg(reg));
            }
            }
            else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),"000");}
          }
          else if(this.regexi(str[1]) && !this.regexi(str[2]))
          {
            if(this.regexi(str[2].slice(1,str[2].length-1))) 
            {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(str[2].slice(1,str[2].length-1)));}
            
            else if ((str[2].indexOf("[") != -1 ) && (str[2].indexOf("+") != -1)) {
              let modeAdr= this.modeAdr(str) ; 
              if(str[2][0] != "["){
                let reg = "";
              let regEtDepl = (str[2].slice(str[2].indexOf("["),str[2].length)) .slice(1, str[2].length - 1) ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(reg));
           }else {
              let reg = "";
              let regEtDepl = str[2].slice(1, str[2].length - 1) ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(reg));
           }
            }
            else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),"000");} 
      
          }
          else{
            if((str[1].indexOf("+") == -1)&&(str[2].indexOf("+") == -1)) {
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),"000");
          }
            else {
              let regEtDepl = str[1].slice(1, str[1].length - 1) ;
              let reg ; 
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
              else {reg = regEtDepl.slice(-2);}
              
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
            }
            }
          } 
        else {
          
          if(this.regexi(str[1]))
          { 
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),"000");
          }
          else if (this.regexi(str[1].slice(1,str[1].length-1)))
          {
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),"000");
          } 
          else if(str[1][0] != "[" && str[1].indexOf("[") != -1) {
            let reg = "";
            let regEtDepl = (str[1].slice(str[1].indexOf("["),str[1].length)) .slice(1, str[1].length - 1) ;
            if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
            else {reg = regEtDepl.slice(-2);}
            code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
            
           }
            
          else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),"000","000");
        }
  
        }
          console.log(code);
          return code;
      }, // fin getcode 
  
      // return code operation de l'instruction 
      getCop: function (str) {
        let ins;
        switch (str.toUpperCase()) {
          case "MOV": ins = "000000"; break;
          case "ADD": ins = "000001"; break;
          case "ADA": ins = "000010"; break;
          case "SUB": ins = "000011"; break;
          case "SBA": ins = "000100"; break;
          case "CMP": ins = "000101"; break;
          case "OR": ins = "000110"; break;
          case "AND": ins = "000111"; break;
          case "SHR": ins = "001000"; break;
          case "SHL": ins = "001001"; break;
          case "ROL": ins = "001010"; break;
          case "ROR": ins = "001011"; break;
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
          case "MOVI": ins = "100000"; break;
          case "ADDI": ins = "100001";break;
          case "ADAI": ins = "100010"; break;
          case "SUBI": ins = "100011"; break;
          case "SBAI": ins = "100100"; break;
          case "CMPI": ins = "100101"; break;
          case "ORI": ins = "100110"; break;
          case "ANDI": ins = "100111"; break;
          case "LOADI": ins = "110110"; break;
          default: ins= "-1"; break;
        }
        return ins;
      }, // fin get code operation 
  
      // return code de registre 
      getReg: function (reg) {
        let code;
        switch (reg.toUpperCase()) {
          case "AX": code = "000"; break;
          case "BX": code = "001"; break;
          case "CX": code = "010"; break;
          case "DX": code = "011"; break;
          case "EX": code = "100"; break;
          case "FX": code = "101"; break;
          case "SI": code = "110"; break;
          case "DI": code = "111"; break;
          default: code = "000"; break;
        }
        return code;
      }, // fin get code registre 
  
      // return true si reg est un registre false sinon 
      regexi: function (reg) {
        reg = reg.toUpperCase();
        if ( reg == "AX" || reg == "BX" || reg == "CX" || reg == "DX" || reg == "EX" || reg == "FX" || reg == "DI" ||reg == "SI")
          return true;
        else return false;
      }, // fin regexiste 
  
      // return true si reg est un registre d'adressage 
      regAdrExi: function (reg) {
        reg = reg.toUpperCase();
        if (reg == "BX" || reg == "SI" || reg == "DI") {
          return true;
        } else return false;
      }, // fin registre adressage existe 
  
      // Mode adressage 
  
      // return true si mode adressage direct 
      modeDirect: function (tabIns) {
        if (this.regexi(tabIns[1]) && this.regexi(tabIns[2])) {
          return true;
        }
        if (!(  this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) || this.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1))
          ) && ! this.modeBaseIndx(tabIns) ) {
          return true; }
        if (tabIns[0][tabIns[0].length - 1] == "I" &&(this.regexi(tabIns[1]) || (!this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&
              !this.modeBaseIndx(tabIns))) ) {
          return true; }
      }, // fin mode direct 
  
      // indirect 
  
      modeIndirct: function (tabIns) {
        if ((this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&  this.regexi(tabIns[2])) ||(this.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1)) &&
        this.regexi(tabIns[1])))
          return true;
        if (tabIns[0][tabIns[0].length - 1] == "I" && this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
          return true;
        else return false;
      }, // fin mode indirect 
  
      // mode base ou indexé 
      modeBaseIndx: function (tabIns) {
        if ( this.regexi(tabIns[1]) && tabIns[2].slice(1, tabIns[2].length - 1).indexOf("+") != -1 )
          return true;
        if (this.regexi(tabIns[2]) && tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1 )
          return true;
        if ( tabIns[0][tabIns[0].length - 1] == "I" && tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1 )
          return true;
        else return false;
      }, // fin  mode base ou indexé 
  
      // return le code de mode d'adressage 
      modeAdr: function (tabIns) {
        if (tabIns.length == 3) {
          if (tabIns[0] == "SHR" || tabIns[0] == "SHL" || tabIns[0] == "ROL" || tabIns[0] == "ROR"
          ) {   
            return "00";
          } else if ( (util.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1) ||
            (util.getDel(tabIns[2], "[") != "" && tabIns[2].indexOf("[") != -1)) { 
            return "11";
          } else {
            if (this.modeDirect(tabIns)) { 
              return "00";
            } else if (this.modeIndirct(tabIns)) { 
              return "01";
            } else if (this.modeBaseIndx(tabIns)) { 
              return "10";
            }
          }
        } else if (tabIns.length == 2) {
          if (tabIns[0] == "LOAD") {
            if (this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
              return "01";
            else if ( util.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1  )
              return "11";
            else return "00";
          } else return "00";
        }
      }, // fin modeAdr
  
      // return destination 
      getDest: function (str) {
        if (this.regexi(str[1].toUpperCase())) {
          return "1";
        } else {
          return "0";
        }
      }, // fin get destination 
  
  
      // return Format 
      getFormat: function (ligne_str) {
        let taille = ligne_str.length;
        if (taille == 2) {
          if ( this.regexi(ligne_str[1]) || this.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)))
            return "0";
          else return "1";
        } else if (taille == 3) {
          if ( (this.regexi(ligne_str[1]) && this.regexi(ligne_str[2])) || (this.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)) &&
          this.regexi(ligne_str[2])) || (this.regAdrExi(ligne_str[2].slice(1, ligne_str[2].length - 1)) && this.regexi(ligne_str[1])) )
            return "0";
          else return "1"; }
      }, // fin getFormat 
  
  
  }
  
  
  
  
  
  
  
  
  
  
  // l'objet registre du fichier registre.js
  class registre {
    #nom;
    #contenu; //en hexa
  
    constructor(nom, contenu) {
      this.#nom = nom;
      this.#contenu = contenu;
    }
    setNom(nom) {
      this.#nom = nom;
    }
    getNom() {
      return this.#nom ; 
    }
    setContenu(contenu) {
        this.#contenu = contenu;
      }
    getContenu() {
        return this.#contenu ; 
      }
    afficher() {
      console.log(`nom ${this.#nom}  contenu ${this.#contenu}`);
    }
  }
  // fin objet registre 
  
  
  
  
  
  
  // util.js no need to import it 
  export var util = {
  
    chercherDansTableau: function (tableau, valeur) {
      // change the name to chercherEtiq
      let i = 0;
      while (i < tableau.length && tableau[i].getEtiq() != valeur) {
        i++;
      }
      return i;
    }, // fin  chercherDansTableau
  
    // return element de tableau contant adr 
    chercherAdr: function (tableau, adr) {
      let i = 0;
      while (i < tableau.length && tableau[i].getAdr() != adr) {
        i++;
      }
      return i;
    },// chercherAdr
  
    // supprimer les espaces dans une chaine de caractere 
    removeExtraSpaces: function (str) {
      return str.replace(/\s+/g, " ");
    }, // fin removeExtraSpaces 
  
    // incrementer n fois  hex en hexadecimal 
    incrementHex: function (hex, n) {
      let decimal = parseInt(hex, 16);
      for (let i = 0; i < n; i++) { decimal = decimal + 1; }
      return decimal.toString(16).toUpperCase();
    }, //  fin incrementHex
  
    // 
    remplirZero: function (str, n, gd) {
      //gd=0 -> des zeros à gauche , gd=1 -> à droite
      var s = "";
      const length = str.length;
      if (gd == 0) {
        for (let k = 0; k < n - length; k++) { s += "0"; }
        return s + str;
      } else {
        if (gd == 1) {
          for (let k = 0; k < n - length; k++) { str += "0"; }
          return str;
        } else { throw new Error("Le troisieme parametre doit etre 0 ou 1."); }
      }
    }, // fin remplirZero
  
    // Find position of delimiter
    getDel: function (str, delimiter) {
      let position = str.indexOf(delimiter);
      if (position !== -1) { // Check if delimiter is found
        str = str.substring(0, position);
      }// Delete characters after delimiter
      return str;
    }, //fin  getDel
  
    // faire l'addition en hexadecemal 
    additionHexa: function (x, y) {
      return (parseInt(x, 16) + parseInt(y, 16)).toString(16).toUpperCase();
    },// fin  additionHexa
  
  
    getSubstringBetweenChars: function (str, startChar, endChar) {
      let startIndex = str.indexOf(startChar);
      if (startIndex === -1) { return ""; }
      startIndex += 1;
      const endIndex = str.indexOf(endChar, startIndex);
      if (endIndex === -1) { return ""; }
      return str.substring(startIndex, endIndex);
    }, // fin getSubstringBetweenChars
  
  
  
    // convertir un nombre binaire en hexadecimal 
    binaryToHex: function (binary) {
      const decimal = parseInt(binary, 2);
      const hex = decimal.toString(16);
      return hex.toUpperCase();
    }, // fin  binaryToHex
  
  
  
    // verifie si un nombre est en hexadecimal 
    estHexadecimal: function (chaine) {
      return !isNaN(parseInt(chaine, 16));
    }, // fin estHexadecimal
  
  
  
    // Verifie si le nom de la variable est valide
    isVariableNameValid: function (str, nbLigne) {
      let nbError=0;
      let messageDiv = document.getElementById("messageDiv");
      if (!str) {
        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide [chaine vide ] </span></p>";
        nbError++;
      } // Vérifier si la chaîne est vide ou null
  
      // Vérifier si le premier caractère est une lettre, un underscore ou un dollar
      let firstChar = str.charAt(0);
      if (!/^[a-zA-Z_$]/.test(firstChar)) {
        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide [premier caractère invalide ] </span></p>";
        nbError++;
      }
  
      // Vérifier si les autres caractères sont des lettres, des chiffres, des underscores ou des dollars
      for (let i = 1; i < str.length; i++) {
        let char = str.charAt(i);
        if (!/^[a-zA-Z0-9_$]/.test(char)) {
          messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide [caractères invalides ] </span></p>";
          nbError++;
        }
      }
  
      //verifier si ce n'est pas sun nom de registre 
      if (coding.regexi(str)) {
        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide , il ne faut pas que ça soit un nom de registre </span></p>";
        nbError++;
      }
  
      // sinon :   La chaîne est valide 
  
      return nbError;
    }, // fin nom variable valide
  
  
  
  
    // Verifie si le nombre est en hexadecimal et est valide
    checkNumber: function (ligne_str, nbLigne) {
      let nbError=0;
      let messageDiv = document.getElementById("messageDiv");
      if (ligne_str.indexOf("H") == -1) {
        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut ecrire 'H' qui signifie la base hexadecimal </span></p>";
        nbError++;
      } else {
        ligne_str = ligne_str.slice(0, ligne_str.length - 1);
        if (!this.estHexadecimal(ligne_str)) {
          messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut donner une valeur hexadecimal valide </span></p>";
          nbError++;
        }
      }
      return nbError;
    },// fin verification nombre 
  
  
  
  // verifie si l'instruction est à un seul opérande
    instUnSeulOp: function (str) {
      str = str.toUpperCase();
      if (str == 'ADA' || str == 'ADAI' || str == "SBA" || str == "SBAI" || str == 'STOP' || str == 'START' || str == 'IN' || str == 'OUT' || str == 'JMP' ||
        str == 'NOT' || str == 'DEC' || str == 'INC' || str == 'STORE' || str == 'LOAD' || str == 'LOADI' || str == 'JNE' || str == 'JE' ||
        str == 'JNO' || str == 'JO' || str == 'JNS' || str == 'JS' || str == 'JNC' || str == 'JC' || str == 'JNZ' || str == 'JZ') return true;
      else return false;
    },// fin instruction à un seul opérande
  
  
  
    // récupère le code ASCII d'un caractère et le retourne en HEX
    getCodeASCIIHex: function (caractere) {
      return caractere.charCodeAt(0).toString(16);
    },// fin get code ASCII
  
  
     /**
  +   * elle place l'indicateur zero selon l'operation de l'addition 
  +   * @param {1} x1 
  +   * @param {2} x2 
  +   */
  setIndZeroAddition: function (x1, x2) {
    let resultat = this.additionHexa(x1,x2) ;
    resultat = resultat.slice(-4) ;
    let resultatBin = util.hexEnBinaire(resultat); 
    if(resultatBin.slice(-15)=="000000000000000") {main.setIndicateurZero("1");}
    else {main.setIndicateurZero("0");}
  }  ,
  
  /**
   * place l'indicateur du signe selon l'operation de l'addition
   * @param {*} x1 
   * @param {*} x2 
  */
  setIndSigneAddition: function(x1,x2) {
  
  x1 = util.remplirZero(x1,4,0) ;
  x2 = util.remplirZero(x2,4,0) ;
  let x1bin = util.hexEnBinaire(x1) ;
  let x2bin = util.hexEnBinaire(x2) ;
  
  if ((x1bin[0]=="0")&&(x2bin[0]=="0")) {main.setIndicateurSigne("0"); return ;}
  if ((x1bin[0]=="1")&&(x2bin[0]=="1")) {main.setIndicateurSigne("1"); return ;}
  if (((x1bin[0]=="1")&&(x2bin[0]=="0"))) {
   //le signe dans ce cas sera du signe du nombre dont la valeur absolue est la plus grande 
    let x2bin_ = util.remplirZero(x2bin.slice(-15),16,0) ;
    if (parseInt(util.positiveComplementADeux(x1bin),2)>parseInt(x2bin_,2)) //le signe sera du signe de x1bin
    {main.setIndicateurSigne(x1bin[0]); return ;}
    else {main.setIndicateurSigne(x2bin[0]); return ;}
  }
  if ((x1bin[0]=="0")&&(x2bin[0]=="1")) {
    let x1bin_ = util.remplirZero(x1bin.slice(-15),16,0) ;
     if (parseInt(util.positiveComplementADeux(x2bin),2)>parseInt(x1bin_,2)) //le signe sera du signe de x2bin
    {main.setIndicateurSigne(x2bin[0]); return ;}
     else {main.setIndicateurSigne(x1bin[0]); return ;}
  }},
  
  setIndDebordAddition: function(x1,x2) {
  
  x1 = util.remplirZero(x1,4,0) ;
  x2 = util.remplirZero(x2,4,0) ;
  let x1bin = util.hexEnBinaire(x1) ;
  let x2bin = util.hexEnBinaire(x2) ;
  let resultat = (this.additionHexa(x1,x2)).slice(-4) ; //slice(-4) car on doit comparer avec le premier bit du resultat ecrit sur 16bits
  resultat = util.remplirZero((util.hexEnBinaire(resultat)),16,0) ;
  if ((x1bin[0]=="1")&&(x2bin[0]=="1")&&(resultat[0]=="0")) {main.setIndicateurDebord("1") ; return ;}
  else if ((x1bin[0]=="0")&&(x2bin[0]=="0")&&(resultat[0]=="1")) {main.setIndicateurDebord("1"); return ;}
  else {main.setIndicateurDebord("0"); return ;}
  },
  
  setIndRetenueAddition: function(x1,x2) {
  let resultat = this.additionHexa(x1,x2) ;
  if (resultat.length>4) {main.setIndicateurRetenue("1"); return ;}
  else {main.setIndicateurRetenue("0"); return ;}
  },
  
  /**
  * elle place les indicateurs di signe et zero selon le contenu de l'accumulateur qui est en hexa
  * @param {1} contenuAcc le contenu de l'accumulateur en hexadecimal
  */
  setIndicateursAccumulateur: function(contenuAcc) {
  let contenuAccBin = util.hexEnBinaire(contenuAcc) ;
  if (contenuAccBin[0]=="1") {main.setIndicateurSigne("1");}
  else {main.setIndicateurSigne("0");}
  if (contenuAcc=="0000"){main.setIndicateurZero("1");}
  else {main.setIndicateurZero("0");}
  },
      
      getSubstringBetweenChars: function (str, startChar, endChar) {
          let startIndex = str.indexOf(startChar);
          if (startIndex === -1) { return ""; }
          startIndex += 1;
          const endIndex = str.indexOf(endChar, startIndex);
          if (endIndex === -1) { return "";   }
          return str.substring(startIndex, endIndex);
        }, // fin getSubstringBetweenChars
  
  
  
    hexEnBinaire: function (hex) {
      let binary = "";
      for (let i = 0; i < hex.length; i++) {
        const char = parseInt(hex[i], 16).toString(2);
        binary += char.padStart(4, "0");
      }
      return binary;
    },
  
  
    // convertir un nombre binaire en hexadecimal 
    binaryToHex: function (binary) {
      const decimal = parseInt(binary, 2);
      const hex = decimal.toString(16);
      return hex.toUpperCase();
    }, // fin  binaryToHex
  
  
  /**
  + * fait la soustraction de n-m tq n et m sont representés en complement à 2, et positionne les indicateurs
  + * @param {1} n 
  + * @param {2} m 
  + */
  
  SoustractionHex: function(n,m) {
      
    let resultat ="" ;
    let m_ = "" ; //soit m convertit en negatif ou positif selon le cas
    m = util.hexEnBinaire(util.remplirZero(m,4,0)) ;
    //cas1: si m est positif cela revient a l'addition signée de n + (-m)
    if (m[0]=="0") 
    {
    m_ = util.negationComplementADeux(m) ;
    resultat = util.additionHexa(util.remplirZero(n,4,0),util.binaryToHex(m_)) ;
    }
    else //cas2: si m negatif ie: le bit le plus a gauche est à 1 cela revient a l'addition de n + m
    {
    m_ = util.positiveComplementADeux(m) ;
    resultat = util.additionHexa(util.remplirZero(n,4,0),util.binaryToHex(m_)) ;
    }
    //positionner les indicateurs
    util.setIndDebordAddition(n,util.binaryToHex(m_)) ;
    util.setIndRetenueAddition(n,util.binaryToHex(m_)) ; 
    util.setIndZeroAddition(n,util.binaryToHex(m_)) ; 
    util.setIndSigneAddition(n,util.binaryToHex(m_)) ; 
           
    return resultat ;
    
    },
    
    /**
    * convertit un nombre binaire negatif (sur 16bits) en sa valeur positive representée en CA2
    * @param {1} binaryNum 
    * @returns 
    */
    positiveComplementADeux: function(binaryNum) {
    // inverser les bits
    let onesComplement = "";
    for (let i = 0; i < binaryNum.length; i++) {
    onesComplement += binaryNum[i] === "0" ? "1" : "0";
    }
    let absValue = parseInt(onesComplement, 2) + 1;
    let absBinary = absValue.toString(2).padStart(16, "0");
    return absBinary;},
    
    negationComplementADeux: function(binaryNum) {
    // Convertir binaryNum en decimal
    let decimalNum = parseInt(binaryNum, 2);
    
    // Calculer le nombre negatif et sa representation en CA2
    let negation = -decimalNum;
    let twosComplement = (negation >>> 0).toString(2).padStart(16, '0');
      
    return twosComplement;  
    },
    
    AndHex: function(n, m) {
      const decimalN = parseInt(n, 16);
      const decimalM = parseInt(m, 16);
      const result = decimalN & decimalM;
      const hexResult = result.toString(16).toUpperCase();
      return hexResult;
    },
    
    OrHex: function(n, m) {
      const decimalN = parseInt(n, 16);
      const decimalM = parseInt(m, 16);
      const result = decimalN | decimalM;
      const hexResult = result.toString(16).toUpperCase();
      return hexResult;
    },
    
    NotHex: function(n) {
    const decimalN = parseInt(n, 16);
    const result = ~decimalN;
    const hexResult = result.toString(16).toUpperCase();
    return hexResult;
    },
    
    decalageLogiqueHexadecDroit: function(hexa, n) {
    let decimal = parseInt(hexa, 16); // conversion hexadécimale en décimal
    let resultat = decimal >>> n; // décalage logique de n positions vers la droite
    main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[16-n]) ; 
    
    return resultat.toString(16); // conversion du résultat en hexadécimal
    },
    
    decalageLogiqueHexadecGauche: function(hexa, n) {
    let decimal = parseInt(hexa, 16); // conversion hexadécimale en décimal
    let resultat = decimal << n; // décalage logique de n positions vers la gauche
    main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[0+n-1]) ; 
    return resultat.toString(16); // conversion du résultat en hexadécimal
    },
    
    rotationHexadecimal: function (code,hexa, n) {
    let decimal = parseInt(hexa, 16); // conversion hexadécimale en décimal
    let resultat;
    if (code == "ROL") {
      resultat = (decimal << n) | (decimal >>> (32 - n)); // rotation à gauche de n positions
      main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[0+n-1]) ;
    } else {
      resultat = (decimal >>> -n) | (decimal << (32 + n)); // rotation à droite de n positions
      main.setIndicateurRetenue(this.hexEnBinaire(util.remplirZero(hexa,4,0))[16-n]) ; 
    }
    return resultat.toString(16); // conversion du résultat en hexadécimal
    },
    
    compareHexValues: function (x, y) {
    let decimalX = parseInt(x, 16); // conversion hexadécimale en décimal
    let decimalY = parseInt(y, 16); // conversion hexadécimale en décimal
    
    if (decimalX < decimalY) {
      return -1
    } else if (decimalX > decimalY) {
      return 1
    } else {
      return 0
    }
    },
    
    hexSigne: function(op) {
          op = util.hexEnBinaire(op) ; 
          if (op[0] == "1")  return "-1" ; 
          else return "1" ; 
     
    },
    /*
    convertToAscii: function(string) {
      let asciiCode = [];
      let str ; 
      for (let i = 0; i < string.length; i++) {
        asciiCode.push((string.charCodeAt(i)).toString(16));
        str=str+asciiCode[i]
      }
      return asciiCode;
    } */
  
  
  
  }// fin de l'objet " Util"
  
  
  
  
  
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
        return this.jmp(codeIns,indicateurTab,cpt)  ; 
      }
      else if(codeIns == "STORE") {
        this.store(cpt) ; 
       }
      else if(codeIns== "CMP") {
        if ((modeAdr == "00") && dest == "1" && format == "0") {
          this.cmpDirect(codeIns,param1,param2); 
          return cpt+1 ;}
        if ((modeAdr == "01") && dest == "1" && format == "0") {
          this.cmpIndiret(codeIns,param1,param2); 
          return cpt+1 ;}
  
      }
      else if(codeIns== "CMPI") {
        if ((modeAdr == "00") && dest == "1" && format == "1") {
          this.cmpImm(codeIns,param1,instrTab,cpt); 
          return cpt+2 ;}
      }
      else if(codeIns== "SHR" || codeIns== "SHL" || codeIns== "ROR" || codeIns== "ROL" ) {
        this.decalageRotationLogique(codeIns,param1,instrTab,cpt) ; 
        return cpt+2 ; 
      }
      else if(codeIns== "ADA" || codeIns== "SBA" || codeIns== "LOAD") {
        if((modeAdr == "00") && dest == "1" && format == "0" ){
          this.immediaAccDirectCourt(codeIns,param1) ; 
          return cpt+1 ; 
    
        }
        else if((modeAdr == "00") && dest == "0" && format == "1"){
          this.immediaAccDirectLong(codeIns,dataTab,instrTab,cpt) ; 
          return cpt+2 ; 
        }else if((modeAdr == "01") && dest == "0" && format == "0"){
          this.LoadinDirectCourt(param1) ; 
          return cpt+1 ; 
        }
        else if((modeAdr == "11") && dest == "0" && format == "1")
        this.LoadDirectIndexe(param1,dataTab,instrTab,cpt) 
  
      }
      else if(codeIns== "ADAI" || codeIns== "SBAI" ||  codeIns== "LOADI"){
    main.ACC.setContenu(this.operation(codeIns,main.ACC.getContenu(),instrTab[cpt+1].getVal())) ; 
  
      }
      else if(codeIns[codeIns.length-1] == "I"  || codeIns=="INC" || codeIns=="DEC" ){
      if((modeAdr == "00") && dest == "1"  ){
        if(codeIns=="INC" || codeIns=="DEC") {
          this.immediaDirectLongDest(codeIns,param1,instrTab,cpt) ; 
          return cpt+1 ; }
        else{ 
          this.immediaDirectLongDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt)
          return cpt+2 ; }
  
      }
      else if((modeAdr == "00") && dest == "0" ){
        this.immediaDirectLongNonDest(codeIns.slice(0,codeIns.length-1),instrTab,cpt)
        return cpt+3 ; 
      }
      else if((modeAdr == "01") && dest == "0" ) {
        this.immediaInDirectLongNonDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt) ; 
        return cpt+2
      }
      else if((modeAdr == "10") && dest == "0" ) {
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
    } else if(modeAdr == "11" && format == "1") {
      if(dest == "1") {
        this.directIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
     }else{
      this.directIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
     }
     return cpt+3 ; 
      
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
            this.mettreAjourIndicateur(main.ACC.getContenu()) ;
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
               if(i==dataTab.length) {dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(1),0,"")); } 
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
          i = util.chercherAdr(dataTab,(main.SI.getContenu()).slice(1)) ;
          main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
          break;
        case "111":
          i = util.chercherAdr(dataTab,(main.DI.getContenu()).slice(1)) ;
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
            i = util.chercherAdr(dataTab,(main.SI.getContenu()).slice(1)) ;
            m = (dataTab[i].getVal()).slice(1) 
            break;
          case "111":
            i = util.chercherAdr(dataTab,(main.DI.getContenu()).slice(1)) ;
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
        
        switch (param2) {
          case "001": main.ACC.setContenu(main.BX.getContenu()); m=util.additionHexa(m.toString(16),main.BX.getContenu()) ; main.ACC.setContenu(m);  break;
          case "110": main.ACC.setContenu(main.SI.getContenu()); m=util.additionHexa(m.toString(16),main.SI.getContenu()) ; main.ACC.setContenu(m);  break;
          case "111": main.ACC.setContenu(main.DI.getContenu()); m=util.additionHexa(m.toString(16),main.DI.getContenu()) ; main.ACC.setContenu(m);  break;
        }
        let i = util.chercherAdr(dataTab,util.remplirZero(m,3,0)) ;
        if(i==dataTab.length) {dataTab.push(new CaseMc((util.remplirZero(m,3,0)),0,"")); } 
        m=dataTab[i].getVal() ;  
        switch (param1) {
          case "000": n = main.AX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "001": n = main.BX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "010": n = main.CX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "011": n = main.DX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "100": n = main.EX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "101": n = main.FX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "110": n = main.SI.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "111": n = main.DI.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
        }
        dataTab[i].setVal(main.ACC.getContenu()) ; 
      } // Fin Mode BaseIndexe format Long  distination =0
      // Mode direct indexe format Long  distination =0
      directIndexeLongNonDest = function(code,param1,param2,dataTab,instrTab,cpt) {
        let m = instrTab[cpt+1].getVal() ; 
        
        let n=0 ;
        
        switch (param2) {
          case "001": main.ACC.setContenu(main.BX.getContenu()); m=util.additionHexa(m.toString(16),main.BX.getContenu()) ; main.ACC.setContenu(m);  break;
          case "110": main.ACC.setContenu(main.SI.getContenu()); m=util.additionHexa(m.toString(16),main.SI.getContenu()) ; main.ACC.setContenu(m);  break;
          case "111": main.ACC.setContenu(main.DI.getContenu()); m=util.additionHexa(m.toString(16),main.DI.getContenu()) ; main.ACC.setContenu(m);  break;
        }
  
        let adretiq = instrTab[cpt+2].getVal() ; 
        let i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
        i = parseInt(dataTab[i].getVal(), 16) + parseInt(m, 16);   
        m=dataTab[i].getVal() ;  
        switch (param1) {
          case "000": n = main.AX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "001": n = main.BX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "010": n = main.CX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "011": n = main.DX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "100": n = main.EX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "101": n = main.FX.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "110": n = main.SI.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
          case "111": n = main.DI.getContenu(); main.ACC.setContenu(n); main.ACC.setContenu(this.operation(code,m,n));
            break;
        }
        dataTab[i].setVal(main.ACC.getContenu()) ; 
      } // FIN  Mode direct indexe format Long  distination =0
  
      // Mode direct indexe format Long  distination =1
  
      directIndexeLongDest = function(code,param1,param2,dataTab,instrTab,cpt) {
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
        
        let adretiq = instrTab[cpt+2].getVal() ; 
        i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
        i = parseInt(dataTab[i].getVal(), 16) + parseInt(m, 16);   
        m=dataTab[i].getVal() ;   
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
  
      }  // FIN Mode direct indexe format Long  distination =1
      
  
  
      //Mode immediate direct  format Long  distination =1
      immediaDirectLongDest = function(code,param1,instrTab,cpt) {
        let m=0 ; 
        if(code == "INC"){
          m=1 ; 
          code ="ADDI"
        }else if(code == "DEC"){
          m=1 ; 
          code ="SUBI"
        }
        else{
         m = instrTab[cpt+1].getVal() ;
        }
        let n=0 ;
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
   
  
      }  //Mode immediate direct  format Long  distination =1
       //Mode immediate direct  format Long  distination =0
      immediaDirectLongNonDest = function(code,instrTab,cpt) {
        let m = instrTab[cpt+1].getVal() ;
        let i = util.chercherAdr(main.getDataTab(),m.slice(1)) ;
        m=main.getDataTab()[i].getVal() ;
        main.ACC.setContenu(m);
        let n= instrTab[cpt+2].getVal() ; ; 
        main.ACC.setContenu(this.operation(code,m,n)); 
        main.getDataTab()[i].setVal(main.ACC.getContenu()) ;
      }  // Fin Mode immediate direct  format Long  distination =0 
  
        //Mode immediate indirect  format Long  distination =0 
      immediaInDirectLongNonDest = function(code,param1,instrTab,cpt) {
        let n = instrTab[cpt+1].getVal() ;
        let i ; 
        let m=0 ; 
        switch (param1) {
          case "001":
            i = util.chercherAdr(main.getDataTab(),main.BX.getContenu().slice(1)) ;
             m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
             m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.getDataTab()[i].setVal(m);
           break;
          case "110": 
          i = util.chercherAdr(main.getDataTab(),main.SI.getContenu().slice(1)) ;
          m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
          m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.getDataTab()[i].setVal(m);
          break ; 
          case "111": i = util.chercherAdr(main.getDataTab(),main.DI.getContenu().slice(1)) ;
          m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
          m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.getDataTab()[i].setVal(m); break ; 
        } 
      } // FIN Mode immediate indirect  format Long  distination =0 
  
      //  Mode immediate BaseIndexe  format Long  distination =0 
      immediaBaseIndexeLongNonDest = function(code,param1,instrTab,cpt) {
        let m=0 ; 
        let i=0 ;
        let n=instrTab[cpt+2].getVal() ;
        switch (param1) {
          case "001": main.ACC.setContenu(main.BX.getContenu().slice(1));
            m = util.additionHexa(main.BX.getContenu().slice(1),instrTab[cpt+1].getVal()) ; main.ACC.setContenu(m);
            i = util.chercherAdr(main.dataTab,util.remplirZero(m,3,0)) ;
             m=main.dataTab[i].getVal() ; main.ACC.setContenu(m); 
             m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.dataTab[i].setVal(m);
           break;
          case "110": 
          main.ACC.setContenu(main.SI.getContenu().slice(1));
          m = util.additionHexa(main.SI.getContenu().slice(1),instrTab[cpt+1].getVal()) ; main.ACC.setContenu(m);
          i = util.chercherAdr(main.dataTab,util.remplirZero(m,3,0)) ;
           m=main.dataTab[i].getVal() ; main.ACC.setContenu(m);
           m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.dataTab[i].setVal(m);
          break ; 
          case "111": main.ACC.setContenu(main.DI.getContenu().slice(1));
          m = util.additionHexa(main.DI.getContenu().slice(1),instrTab[cpt+1].getVal()) ; main.ACC.setContenu(m);
          i = util.chercherAdr(main.dataTab,util.remplirZero(m,3,0)) ;
           m=main.dataTab[i].getVal() ; main.ACC.setContenu(m); 
           m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.dataTab[i].setVal(m);
        } 
      }  // Fin Mode immediate BaseIndexe  format Long  distination =0 
  
      //  Mode immediate AccDirect  format COURT  
      immediaAccDirectCourt = function(code,param1) {
        switch (param1) {
          case "000": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.AX.getContenu()));
           break;
          case "001": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.BX.getContenu()));
           break;
           case "010": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.CX.getContenu()));
           break; 
           case "011": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.DX.getContenu()));
           break;
           case "100": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.EX.getContenu()));
           break;
           case "101": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.FX.getContenu()));
           break ; 
          case "110": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.SI.getContenu()));
          break;
          case "111": main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),main.DI.getContenu()));
           break;
          
        } 
      } // FIN  Mode immediate AccDirect  format COURT  
  
      //  Mode immediate AccDirect  format Long  
      immediaAccDirectLong = function(code,dataTab,instrTab,cpt) {
        let n = instrTab[cpt+1].getVal() ;
        let i = util.chercherAdr(dataTab,n.slice(1)) ;
        n=dataTab[i].getVal() ; 
         main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),n)); 
  
      } //  FIN Mode immediate AccDirect  format Long 
      
  
      LoadinDirectCourt = function(param1) {
        let i=0 ; let m=0 ; 
        switch (param1) {
          case "001":
            i = util.chercherAdr(main.getDataTab(),main.BX.getContenu().slice(1)) ;
             m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
           break;
          case "110": 
          i = util.chercherAdr(main.getDataTab(),main.SI.getContenu().slice(1)) ;
          m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
          break ; 
          case "111": i = util.chercherAdr(main.getDataTab(),main.DI.getContenu().slice(1)) ;
          m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m);  break ; 
        } 
  
      }
  
      LoadDirectIndexe = function(param1,dataTab,instrTab,cpt) {
        let n = instrTab[cpt+1].getVal() ; 
        let m=0 ; 
        let i=0 ; 
        switch (param1) {
          case "001":
            main.ACC.setContenu(main.BX.getContenu());  m=util.additionHexa(n,main.BX.getContenu().slice(1)) ; main.ACC.setContenu(m);  break;
          case "110":
            main.ACC.setContenu(main.SI.getContenu());  m=util.additionHexa(n,main.SI.getContenu().slice(1)) ; main.ACC.setContenu(m); break;
          case "111":
            main.ACC.setContenu(main.DI.getContenu());  m=util.additionHexa(n,main.DI.getContenu().slice(1)) ; main.ACC.setContenu(m); break;
        }
        
        let adretiq = instrTab[cpt+2].getVal() ; 
        i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
        i = parseInt(dataTab[i].getVal(), 16) + parseInt(m, 16) ;   
        m=dataTab[i].getVal() ;  
        main.ACC.setContenu(m);
      }
      //  decalage / Rotation Logique
      decalageRotationLogique= function(code,param1,instrTab,cpt) {
        switch (param1) {
          case "000": main.ACC.setContenu(main.AX.getContenu()) ;
          main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
          main.AX.setContenu(main.ACC.getContenu() ) ; 
          
           break;
          case "001": main.ACC.setContenu(main.BX.getContenu()) ; 
          main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
          main.BX.setContenu(main.ACC.getContenu() ) ;
           break;
           case "010": main.ACC.setContenu(main.CX.getContenu()) ; 
           main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
           main.CX.setContenu(main.ACC.getContenu() ) ;
           break; 
           case "011":main.ACC.setContenu(main.DX.getContenu()) ; 
           main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
           main.DX.setContenu(main.ACC.getContenu() ) ;
           break;
           case "100": main.ACC.setContenu(main.EX.getContenu()) ; 
           main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
           main.EX.setContenu(main.ACC.getContenu() ) ;
           break;
           case "101": main.ACC.setContenu(main.FX.getContenu()) ; 
           main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
           main.FX.setContenu(main.ACC.getContenu() ) ;
           break ; 
          case "110": main.ACC.setContenu(main.SI.getContenu()) ; 
          main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
          main.SI.setContenu(main.ACC.getContenu() ) ;
          break;
          case "111": main.ACC.setContenu(main.DI.getContenu()) ; 
          main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),instrTab[cpt+1].getVal()));
          main.DI.setContenu(main.ACC.getContenu() ) ;
           break;
          
        } 
        console.log(main.getIndicateurRetenue());
      }   //  FIN decalage / Rotation Logique
       // JMP 
       jmp = function (code,indicateurTab,cpt) {
        let i = main.getinstrTab()[cpt+1].getVal() ; 
        i= util.chercherAdr(main.getinstrTab(),i.slice(1)) ; 
      switch ( code.toUpperCase())  {
      case "JMP": return i;   
      case "JZ": if( main.getIndicateurZero() == "1")
          return i; else return cpt+2 ; 
      case "JNZ": if(main.getIndicateurZero() != "1")
      return i; else return cpt+2 ;
      case "JC": if(main.getIndicateurRetenue() == "1")
      return i; else return cpt+2 ; 
      case "JNC": if(main.getIndicateurRetenue() != "1") 
      return i; else return cpt+2 ; 
  
      case "JS": if(main.getIndicateurSigne() == "1") return i; else return cpt+2 ;
      case "JNS": if(main.getIndicateurSigne() != "1")  return i; else return cpt+2 ;
      case "JO": if(main.getIndicateurDebord() == "1")  return i; else return cpt+2 ;
      case "JNO": if(main.getIndicateurDebord() != "1")  return i ; else return cpt+2 ;
      case "JE": if(main.getIndicateurZero() == "1" )  return i ; else return cpt+2 ; 
      case "JNE": if(main.getIndicateurZero() != "1" ) return i ; else return cpt+2 ;  
    }
  } //JMP 
     //  comparaison direct 
    cmpDirect = function (code,param1,param2) {
     let m=0 ;
     let n=0 ; 
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
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "001":
          n = main.BX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "010":
          n = main.CX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "011":
          n = main.DX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "100":
          n = main.EX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "101":
          n = main.FX.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "110":
          n = main.SI.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m));
          break;
        case "111":
          n = main.DI.getContenu();
          main.ACC.setContenu(n);
          main.ACC.setContenu(this.operation("SUB",n,m)); 
          break;
      }
  
     // console.log(n," ",m);
      if(util.compareHexValues(n,m)>0) { 
        main.setIndicateurZero("0") ; main.setIndicateurSigne("0") ; main.setIndicateurRetenue("0") ;
      }else if(util.compareHexValues(n,m)<0) {
        main.setIndicateurZero("0") ; main.setIndicateurSigne("1") ; main.setIndicateurRetenue("0") ;
      }
      else { 
        main.setIndicateurZero("1") ; main.setIndicateurSigne("0") ; main.setIndicateurRetenue("0") ;
        main.setIndicateurDebord("0"); 
      }
  
        
    }  // FIN   comparaison direct
  
  
  
    cmpIndiret = function (code,param1,param2) {
      let m=0 ;
       let i=0 ; 
       let n=0 ; 
      switch (param2) {
        case "001":
          i = util.chercherAdr(main.getDataTab(),main.BX.getContenu().slice(1)) ;
           m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
         break;
        case "110": 
        i = util.chercherAdr(main.getDataTab(),main.SI.getContenu().slice(1)) ;
        m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
        break ; 
        case "111": i = util.chercherAdr(main.getDataTab(),main.DI.getContenu().slice(1)) ;
        m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
        break;
      } 
  
       switch (param1) {
         case "000":
           n = main.AX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "001":
           n = main.BX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "010":
           n = main.CX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "011":
           n = main.DX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           case "111":
           n = main.DI.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m)); 
           break;
       }
       if(util.compareHexValues(n,m)>0) {
         main.setIndicateurZero("0") ; main.setIndicateurSigne("0") ; main.setIndicateurRetenue("0") ;
       }else if(util.compareHexValues(n,m)<0) {
         main.setIndicateurZero("0") ; main.setIndicateurSigne("1") ; main.setIndicateurRetenue("0") ;
       }
       else { 
         main.setIndicateurZero("1") ; main.setIndicateurSigne("0") ; main.setIndicateurRetenue("0") ;
         main.setIndicateurDebord("0"); 
       }
   
         
     } 
  
  
     //  comparaison Imm
    cmpImm = function (code,param1,instrTab,cpt) {
      let m= instrTab[cpt+1].getVal() ; 
      let n=0 ; 
       switch(param1) {
         case "000":
           n = main.AX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "001":
           n = main.BX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "010":
           n = main.CX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "011":
           n = main.DX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "100":
           n = main.EX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m)); 
           break;
         case "101":
           n = main.FX.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "110":
           n = main.SI.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
         case "111":
           n = main.DI.getContenu();
           main.ACC.setContenu(n);
           main.ACC.setContenu(this.operation("SUB",n,m));
           break;
       }
       if(util.compareHexValues(n,m)>0) {
        main.setIndicateurZero("0") ; main.setIndicateurSigne("0") ; main.setIndicateurRetenue("0") ;
      }else if(util.compareHexValues(n,m)<0) {
        main.setIndicateurZero("0") ; main.setIndicateurSigne("1") ; main.setIndicateurRetenue("0") ;
      }
      else { 
        main.setIndicateurZero("1") ; main.setIndicateurSigne("0") ; main.setIndicateurRetenue("0") ;
        main.setIndicateurDebord("0"); 
      }
         
     } //  DIN comparaison Imm
  
     store = function(cpt) {
      let i = main.getinstrTab()[cpt+1].getVal() ; 
      i= util.chercherAdr(main.getDataTab(),i.slice(1)) ; 
      main.getDataTab()[i].setVal(main.ACC.getContenu())  ; 
     } 
  
     NotDirect = function(code,param1) {
      let m = 0 ; 
      let n = 0;   
      switch (param1) { 
        case "000": m = main.AX.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.AX.setContenu(main.ACC.getContenu()); break;
        case "001": m = main.BX.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.BX.setContenu(main.ACC.getContenu()); break;
        case "010": m = main.CX.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.CX.setContenu(main.ACC.getContenu()); break;
        case "011": m = main.DX.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.DX.setContenu(main.ACC.getContenu()); break;
        case "100": m = main.EX.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.EX.setContenu(main.ACC.getContenu()); break;
        case "101": m = main.FX.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.FX.setContenu(main.ACC.getContenu()); break;
        case "110": m = main.SI.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.SI.setContenu(main.ACC.getContenu()); break;
        case "111": m = main.DI.getContenu(); main.ACC.setContenu(m); main.ACC.setContenu(this.operation(code,n,m)); main.DI.setContenu(main.ACC.getContenu()); break;
  
    }
     }
  
     // mettre a jour les indicateurs          
     mettreAjourIndicateur = function(val) {   
      let binaryRes = (util.remplirZero(util.hexEnBinaire(val),16,0)).slice(-16) ;
      if(val=="0000"){main.setIndicateurZero("1") ;}
      else {main.setIndicateurZero("0");}
      if (val.length>4){main.setIndicateurDebord("1"); main.setIndicateurRetenue("1");}
      else {
        main.setIndicateurDebord("0"); 
        main.setIndicateurRetenue("0");
        
      }
      if (binaryRes[0]== "1") {main.setIndicateurSigne("1");}
      else {main.setIndicateurSigne("0");}
  
     } // FIN mettre a jour les indicateurs 
      operation = function(code,n,m ) {
        let res=0 ; 
        switch (code.toUpperCase()) {
          case "MOV": res=util.remplirZero(m,4,0); this.mettreAjourIndicateur(res);  break; 
          case "ADD": res=util.remplirZero(util.additionHexa(n,m),4,0); 
          util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndZeroAddition(n,m) ; 
          break;
          case "SUB": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ;
          break;
          case "CMP": res=util.compareHexValues(n,m) ; util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "OR": res=util.remplirZero(util.OrHex(n,m),4,0) ; util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "AND": res=util.remplirZero(util.AndHex(n,m),4,0) ;  util.setIndicateursAccumulateur(res.slice(-4)); break; 
          case "SHR": res=util.remplirZero(util.decalageLogiqueHexadecDroit(n,m),4,0); util.setIndicateursAccumulateur(res.slice(-4));   break; 
          case "SHL": res=util.remplirZero(util.decalageLogiqueHexadecGauche(n,m),4,0); util.setIndicateursAccumulateur(res.slice(-4));   break; 
          case "ROL": res=rotationHexadecimal("ROL",n,m); util.setIndicateursAccumulateur(res.slice(-4));   break;
          case "ROR": res=rotationHexadecimal("ROR",n,m); util.setIndicateursAccumulateur(res.slice(-4));  break;
          case "JZ": ins = "001100"; this.mettreAjourIndicateur(res); break;
          case "JNZ": ins = "001101"; this.mettreAjourIndicateur(res); break;
          case "JC": ins = "001110"; this.mettreAjourIndicateur(res); break;
          case "JS": ins = "010000"; this.mettreAjourIndicateur(res); break;
          case "JNC": ins = "001111"; this.mettreAjourIndicateur(res); break;
          case "JNS": ins = "010001"; this.mettreAjourIndicateur(res);  break;
          case "JO": ins = "010010"; this.mettreAjourIndicateur(res); break;
          case "JNO": ins = "010011"; this.mettreAjourIndicateur(res);  break;
          case "JE": ins = "010100"; this.mettreAjourIndicateur(res); break;
          case "JNE": ins = "010101"; this.mettreAjourIndicateur(res); break;
          case "LOAD": res= util.remplirZero(m,4,0); util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "STORE": ins = "010111"; this.mettreAjourIndicateur(res); break;
          case "INC": ins = "011000";  this.mettreAjourIndicateur(res); break;
          case "DEC": ins = "011001";  this.mettreAjourIndicateur(res);break;
          case "NOT":  res= util.remplirZero(util.NotHex(n),4,0) ;  break;
          case "JMP": ins = "011011"; this.mettreAjourIndicateur(res); break;
          case "IN": ins = "011100"; this.mettreAjourIndicateur(res); break;
          case "OUT": ins = "011101"; break;
          case "START": ins = "011111"; break;
          case "STOP": ins = "011110"; break;
          case "MOVI": res=util.remplirZero(m,4,0); util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "ADDI": res=util.remplirZero(util.additionHexa(n,m),4,0); 
          util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndZeroAddition(n,m) ; 
          break;
          case "ADAI": res=util.remplirZero(util.additionHexa(n,m),4,0); 
          util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndZeroAddition(n,m) ; 
          break;
          case "ADA": res=util.remplirZero(util.additionHexa(n,m),4,0) ;  
          util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndZeroAddition(n,m) ; 
          break; 
          case "SUBI": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break;
          case "SBA": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break ;
          case "SBAI": res=util.remplirZero(util.SoustractionHex(n,m),4,0) ; break;
          case "CMPI": res=util.compareHexValues(n,m) ; util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "ORI": res=util.remplirZero(util.OrHex(n,m),4,0) ; util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "ANDI":res=util.remplirZero(util.AndHex(n,m),4,0) ; util.setIndicateursAccumulateur(res.slice(-4)); break;
          case "LOADI": res= util.remplirZero(m,4,0); util.setIndicateursAccumulateur(res.slice(-4)); break;
          default: ins= "-1"; break;
        }
        return res.slice(-4);
        
      }
    
    
  }
  
  
  
  
  
  
  
  export class RI {
    #cop;
    #ma;
    #f;
    #d;
    #reg1;
    #reg2;
    constructor() {
      
    }
    setRI = (code) => {
      this.#cop = code.substring(0, 6); // capable de changer le 5 à 6 etc ..
      this.#ma = code.substring(6, 8);
      this.#f = code.substring(8, 9);
      this.#d = code.substring(9, 10);
      this.#reg1 = code.substring(10, 13);
      this.#reg2 = code.substring(13, 16);
    };
    getCOP() {
      return this.#cop;
    };
    getMA = () => {
      return this.#ma;
    };
    getF = () => {
      return this.#f;
    };
    getD = () => {
      return this.#d;
    };
    getReg1 = () => {
      return this.#reg1;
    };
    getreg2 = () => {
      return this.#reg2;
    };
  }
  
  
  
  
  
  
  
  
  // l'objet main : ce n'est pas le main il contient juste des opérations élémentaires 
  var main = {
    dataTab: [],
    instrTab :[],
    tabEtiq : [],
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
    coder: function (contents) {
  
      const messageDiv= document.getElementById("messageDiv");
      messageDiv.innerHTML = ""; 
      let indice = 0;
      let co;
      let adr = "";
      let lines = contents.split('\n');
      console.log(contents);
      lines = lines.filter(line => line.trim() !== '');    // remove the empty lines from my filecontents : the table lines which represents the lines of the file 
      let fileLength = lines.length;  
      let nbLigne = 0;                     // file length without  the empty lines 
      for (const line of lines) {
        nbLigne++;
        if (line != "") {
        console.log("********************");
        let ligne_str = line.toString().trim();
        ligne_str = ligne_str.replace(",", " ");
        ligne_str = util.removeExtraSpaces(ligne_str);
        ligne_str = ligne_str.split(" ");
        if (ligne_str[0] == "ORG") {
          if (ligne_str[1].indexOf("H") != -1) {
            adr = ligne_str[1].slice(0, ligne_str[1].length - 1);
          } 
          co = adr;
          this.setCO(co);
        } else if (ligne_str[0] == "START") {
        } else if (ligne_str[0] == "SET") {
          this.getDataTab().push(
            new CaseMc(
              util.remplirZero(indice.toString(16),3,0),
              util.remplirZero( ligne_str[2].slice(0, ligne_str[2].length - 1),4,0),
              ligne_str[1]
            )
          );
          indice++;
        } else if (ligne_str[0] == "STOP") {
        } else {
          let tab = coding.coderInst(ligne_str, co, this.getDataTab());
          main.instrTab=main.getinstrTab().concat(tab) ;
          co = util.incrementHex(co, tab.length);
        } 
      }
     }
  
  
  messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***  Data Segment *** </span></p>";
      console.log("***  Data Segment *** ");
  
      for (let i = 0; i < this.getDataTab().length; i++){
        this.getDataTab()[i].afficher();
        this.getDataTab()[i].afficherHTML();}
  
      console.log(" ********************** ");
      //messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";
      console.log("");
  
      console.log("***  Code Segment *** ");
      messageDiv.innerHTML +="<p class='executemsg' > <span style='color: white;'>***  Code Segment *** </span></p>";
  
      for (let i = 0; i < main.getinstrTab().length; i++) {
      main.getinstrTab()[i].afficher();
      main.getinstrTab()[i].afficherHTML();}
  
      console.log("********************** ");
      messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";
  
  
  
      this.Execute(main.getinstrTab());
  
      main.afficherRegistres() ;
      main.afficherRegistresHTML();
  
      main.afficherIndicateurs() ;
      main.afficherIndicateursHTML();    
  
      console.log("***  Data Segment *** ");
      messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***  Data Segment *** </span></p>";
  
      for (let i = 0; i < this.getDataTab().length; i++){
        this.getDataTab()[i].afficher();
        this.getDataTab()[i].afficherHTML();}
  
      console.log("********************** ");
      messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";
      console.log(""); 
  
  
    },
  
  
  
    Execute: function (instrTab) {
      let j = 0 ;
      let i = 0 ;
      while (j < instrTab.length) {
        let instrBin = util.remplirZero(parseInt((instrTab[j].getVal()), 16).toString(2),16,0);
        selectElement(ri,delay,instrBin);   
        this.setRI(instrBin) ;
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
                j=i ; break;
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
            
              default:
                break ; 
  
        }
        //j++ ;
      }
      
    },
  
    afficherIndicateurs: function () {
      console.log("I_ZERO: ", this.getIndicateurZero());
      console.log("I_SIGNE: ", this.getIndicateurSigne());
      console.log("I_RETENUE: ", this.getIndicateurRetenue());
      console.log("I_DEBORD: ", this.getIndicateurDebord());
    },
  
    afficherIndicateursHTML: function (){
      messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> I_ZERO: </span>"+"<span style='color: white;'>"+ this.getIndicateurZero() +"</span></p>";
      messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> I_SIGNE: </span>"+"<span style='color: white;'>"+ this.getIndicateurSigne() +"</span></p>";
      messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> I_RETENUE: </span>"+"<span style='color: white;'>"+ this.getIndicateurRetenue() +"</span></p>";
      messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> I_DEBORD: </span>"+"<span style='color: white;'>"+ this.getIndicateurDebord() +"</span></p>";
  
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
  
    afficherRegistresHTML: function () {
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> AX: </span>"+"<span style='color: white;'>"+this.getAX().getContenu() +"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> BX: </span>"+"<span style='color: white;'>"+ this.getBX().getContenu() +"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> CX: </span>"+"<span style='color: white;'>"+ this.getCX().getContenu()+"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> DX: </span>"+"<span style='color: white;'>"+ this.getDX().getContenu() +"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> EX: </span>"+"<span style='color: white;'>"+ this.getEX().getContenu() +"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> FX: </span>"+"<span style='color: white;'>"+ this.getFX().getContenu() +"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> SI: </span>"+"<span style='color: white;'>"+ this.getSI().getContenu()+"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> DI: </span>"+"<span style='color: white;'>"+ this.getDI().getContenu() +"</span></p>";
     messageDiv.innerHTML +="<p class='executemsg' > <span style='color: #A32185;'> ACC: </span>"+"<span style='color: white;'>"+ this.getACC().getContenu() +"</span></p>";
  
    },
    
   
  };
  // fin obj main 
  
  const testButton = document.getElementById("compile_id");
  const textDiv = document.getElementById("code");
  testButton.addEventListener("click", () => {
    let contents = textDiv.value; // récupère le contenu initial de la div
    textDiv.addEventListener('input', function() {
    contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
    });
    assembler.errorFunction(contents);
  });
  
  
  const ExecuteButton = document.getElementById("run_id");
  ExecuteButton.addEventListener("click", () => {
    let contents = textDiv.value; // récupère le contenu initial de la div
    textDiv.addEventListener('input', function() {
    contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
    });
    console.log("the click on the button execute has worked ! ");
    const messageDiv= document.getElementById("messageDiv");
    messageDiv.innerHTML = ""; 
    main.coder(contents);
  });
  
  
  
  const fileInputButton = document.getElementById("fileInput")
  fileInputButton.addEventListener("change",() => {
   assembler.fromFileInputToTextZone("fileInput","code");
  })
  
  
  
  
  var saveButton = document.getElementById("save");
  var codeTextarea = document.getElementById("code");
  
  saveButton.addEventListener("click", function() {
    let codeText = codeTextarea.value;
    console.log(codeText);
    let blob = new Blob([codeText], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mon_fichier.PASSE");
  });
  
  
  
  
  const simulbtn = document.getElementById("simulate_id");
  const emuleSave = document.getElementById("sml");
  const simulArchi = document.getElementById("arch-id");
  simulbtn.addEventListener("click", () => {
    emuleSave.style.visibility ='hidden';
    simulArchi.style.visibility='visible';
  
  
    }) ;
  var returnBtn = document.getElementById("return");
  returnBtn.addEventListener("click",()=>{
    simulArchi.style.visibility='hidden';
    emuleSave.style.visibility='visible';
  }) ;
  
  const optionButton =document.getElementById("fileSelect")
  optionButton.addEventListener("change", () => {
    console.log("THE click on the option button worked !");  
    const messageDiv = document.getElementById("code")
    messageDiv.style.background= '#010232'; 
    const option = optionButton.options[optionButton.selectedIndex];
    const file = option.value;
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
  
    // Define a function to handle the "load" event of the XMLHttpRequest object
    xhr.onload = () => {
      // Get the contents of the file as a string
      console.log("we are getting the content  !");
      const contents = xhr.responseText;
      console.log(contents);
      assembler.fromFileNameToTextZone(contents)
    };
  
    // Open the file
    xhr.open("GET", file);
  
    // Send the request
    xhr.send();
  //assembler.fromFileNameToTextZone("./program_1.txt","code");
  })
  
  const maDiv = document.getElementById("NbLigne");
  maDiv.style.fontFamily= "Courier New, monospace" ;
  const n = 15;
  /*for (let i = 0; i < 2; i++) {
    maDiv.appendChild(document.createElement("br"));
  }*/
  for (let i = 1; i <= n; i++) {
    const p = document.createElement("p");
    p.textContent = i;
    maDiv.appendChild(p);
  }
  const dataCOel=  document.getElementById('dataCO');
  const dataRAMel=  document.getElementById('dataRAM');
  const dataRIMel=  document.getElementById('dataRIM');
  const dataRIel=  document.getElementById('dataRI');
  const dataACCel=  document.getElementById('dataACC');
  const dataEUAL1el=  document.getElementById('dataEUAL2');
  const dataEUAL2el=  document.getElementById('dataEUAL2');
  const dataREGel=  document.getElementById('dataREG');
  const dataREG1el=  document.getElementById('dataREG1');
  const dataREG2el=  document.getElementById('dataREG2');
  const dataTDAel=  document.getElementById('dataTDA');
  const dataC1el=  document.getElementById('dataC1');
  const dataC2el=  document.getElementById('dataC2');
  const dataC3el=  document.getElementById('dataC3');
  const dataC4el=  document.getElementById('dataC4');
  const dataC5el=  document.getElementById('dataC5');
  const dataDATAel=  document.getElementById('dataDATA');
  const acc = document.getElementById('ACC');
  const ax = document.getElementById('AX');
  const bx = document.getElementById('BX');
  const cx = document.getElementById('CX');
  const dx = document.getElementById('DX');
  const ex = document.getElementById('EX');
  const fx = document.getElementById('FX');
  const si = document.getElementById('SI');
  const di = document.getElementById('DI');
  const eual1 = document.getElementById('EUAL1');
  const eual2 = document.getElementById('EUAL2');
  function moveData(Bus){
    
      var computedStyle = window.getComputedStyle(Bus);
      var left = computedStyle.getPropertyValue('left');
         console.log(left);
         Bus.style.visibility='visible';
      if (left === '0px'){
        
        Bus.style.animation='slide-left 3s';
      }
      else {
        console.log('hello world');
        Bus.style.animation='slide-right 3s';
      }
  
    }
  function selectElement(Element, delay ,string) {
    setTimeout(function() {
      if (Element.className==='dataflux'){
            moveData(Element);
      }else{
        Element.textContent = string ;
      }
  
    }, delay);
  }
  var co = document.getElementById("CO");
  var ram = document.getElementById("RAM");
  var rim = document.getElementById("Rimcontent");
  var ri = document.getElementById("RI");
  var caseMemoire = document.getElementById("caseMemoire");
  let instTAB = ['AAAA',1,2,3,4];
  function premierePhase(adr,delay){
  
  
         selectElement(co, delay , adr);
         delay += 3000;             
         selectElement(dataCOel,delay,0);
         delay+=3000;
         selectElement(dataRAMel,delay,0);
         delay+=3000;
         selectElement(ram,delay,adr);
         delay+=3000;
         selectElement(caseMemoire,delay,instTAB[adr-100]);
         delay+=3000;
         selectElement(rim,delay,instTAB[adr-100]);
         delay+=3000;
         selectElement(dataRIMel,delay,0);
    
  } 
  function simulation(delay){
    var co = document.getElementById("CO");
    var ram = document.getElementById("RAM");
    premierePhase(100,delay);
    delay+=3000;
    this.Execute(main.getinstrTab(),delay);

  };
  function start(e) {
    if(e.name === 'caret-forward-outline')
    {
      e.name = "stop-circle-outline";
      simulation(0);
    }
    else{
      e.name = "caret-forward-outline" ;
  
    }
      
  }
  