
export var assembler = {

  // First Function : assembler.errorFunction 
  errorFunction: function (contents) {

    /*const fileInput = document.getElementById("fileInput")
    const file = fileInput.files[0]
    const reader = new FileReader()*/
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
    let tabNomVariable = [];
    const messageDiv = document.getElementById("messageDiv");
    messageDiv.innerHTML = ""; 
    //const textDiv = document.getElementById("code"); elle est maintenent mise dans la fonction de click sur le button assembler
    //reader.onload = (event) => {
      //const contents = event.target.result;
      //let contents = textDiv.innerHTML; il est devenue un paramètre à la fonction 
      //console.log(typeof(contents));
      let lines = contents.split('\n');
      console.log(contents);
      lines = lines.filter(line => line.trim() !== '');    // remove the empty lines from my filecontents : the table lines which represents the lines of the file 
      let fileLength = lines.length;                     // file length without  the empty lines 
      for (const line of lines) {
        //textDiv.innerHTML += line;
        nbLigne++;
        //console.log("file length : "+fileLength);
        if (line != "") {
          let ligne_str = line.toString().trim();          // Enlever les espaces  de debut et fin de line
          ligne_str = ligne_str.replace(",", " ");         // Remplacer les ',' par des blancs pour les traitements qui suivent 
          ligne_str = util.removeExtraSpaces(ligne_str);   // Enlever plus d'un blanc ( remove extra spaces )
          ligne_str = ligne_str.split(" ");                // Diviser la ligne en mots séparés par des blans pour pouvoir les manipuler mot par mot . les mots sont mits dans un tableau



          // Tester les conditions sur ORG
          if (ligne_str[0].toUpperCase() == 'ORG') 
          {
            if (trouvOrg == true) {
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut ecrire une seule fois ORG </span></p>";
              nbError++;
            }
            if (i != 0 && !dirtystart && !trouvOrg) {
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut commencer par ORG </span></p>";
              nbError++;
            }
            if (ligne_str.length != 2 ) {
              if(!trouvOrg){
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color:#9ca3af; '> : Il faut specifier l'adresse debut dans ORG </span></p>";
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
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut ecrire ORG au départ , avant d'arriver à START </span></p>";
              nbError++;
            }
            if (trouvStop == true) {
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il ne faut pas que STOP soit écrit avant d'arriver à START </span></p>";
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
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut specifier l'adresse debut dans ORG avant de declarer les variables </span></p>";
              nbError++;
            }

            if (trouvStart == true){ 
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut declarer les variables avant START  </span></p>";
              nbError++;
            }

            if (ligne_str.length != 3 && (!dirtybit || t != nbLigne)) {
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut specifier le nom de la donnée et lui attribuer une valeur  </span></p>";
              nbError++;
              dirtyvar= true;
              t=nbLigne;
            }

            if (ligne_str.length == 3 ) {
              e = util.checkNumber(ligne_str[2], nbLigne);
              nbError+=e;
              console.log("taille du tab var : ",tabNomVariable.length);
              if (tabNomVariable.indexOf(ligne_str[1]) !== -1) { 
                messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Variable deja declarée !  </span></p>";
                nbError++;
              } else { 
               tabNomVariable.push(ligne_str[1]); 
              }
            }

            
          }// fin conditions sur SET


          else if (ligne_str[0].toUpperCase() == 'STOP') // tester les conditions sur STOP
          { 
            if (trouvStop) {
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut ecrire STOP une seule fois  </span></p>";
              nbError++;
            }
            trouvStop = true;
          } 
          else if (!trouvStop && (nbLigne == fileLength)) {
            messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut terminer par STOP  </span></p>";
            nbError++;
          }
          // fin condition sur stop



          else // on est dans le cas d'une instruction  
          {
            if (trouvStart==false){
              console.log("edkhol hna !!!");
              messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut mettre START dans votre programme après la déclaration des variables   </span></p>";
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
                 messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut mettre l'etiquette dans la meme ligne que l'instruction </span></p>";
                 nbError++;
                } else { // l'etiq est correcte on a juste à décaler pour travailler avec la suite en tant que instruction normale
                  ligne_str.shift(); 

                  // début traitement ins normale
                  if (coding.getCop(ligne_str[0]) == -1 && !dirtyline) { 
                  messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut que ca soit une instruction parmi le jeu d'instructions  </span></p>";
                 nbError++;
                  }

                 if (line.indexOf(",") == -1 && !dirtyline) {
                    if (!util.instUnSeulOp(ligne_str[0])) { 
                      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> :  Il faut mettre ',' entre les operandes  </span></p>";
                      nbError++;
                    }
                  }
             
                  if (line.indexOf("[") != -1 && !dirtyline) {
                    if ((line.slice(line.indexOf("[") + 1, line.indexOf("]"))).indexOf(" ") != -1) {
                       messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut pas laisser des espaces entre '[' et ']'   </span></p>";
                       nbError++;
                       dirtyspace=true;
                       t=nbLigne;
                      }
                    else if (coding.regexi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) {
                      if (!coding.regAdrExi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) { 
                        messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> :  Il faut mettre un registre d'adressage ' BX SI DI '  entre '[' et ']'   </span></p>";
                        nbError++;
                        dirtyspace=true;
                        t=nbLigne;
                      }
                    }
                  }
             if (!dirtyline){
                  if (!coding.regexi(ligne_str[1]) && ligne_str[1].indexOf("[") == -1 ){
                    if (tabNomVariable.indexOf(ligne_str[1]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2){
                      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                     console.log("first herre the first param is not a reg");
                      nbError++;
                    }
                  }else if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) ){
                    if (tabNomVariable.indexOf(ligne_str[2]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2){
                      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                      console.log("first herre the second param is not a reg");
                      nbError++;
                    }
                  }


                }
                  // fin traitement ins normale 

                }

              } else {    // les ':' et l'etiquette ne sont pas collés 
                if (ligne_str[0].indexOf(":") != -1){
                  messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut  laisser un espace entre l'etiquette et l'instruction  </span></p>";
                nbError++;
                 }else {
                messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut pas laisser des espaces entre le nom de l'etiquette et ':'  </span></p>";
                nbError++;}
                if (ligne_str.length == 2)  // on a sauter de ligne après l'etiquette 
                {
                dirtyetiq = true;
                messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut mettre l'etiquette dans la meme ligne que l'instruction </span></p>";
                nbError++;
                }else { //pas de saut de ligne 
                  ligne_str.shift(); 
                  ligne_str.shift();
                }
              }
            } // fin condition ':' trouvé

           else if (!dirtyetiq ) { // on a pas trouvé une étiq avec ':' 
              if (ligne_str.length > 3 && line.indexOf("[") == -1) {
                 messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut mettre ':' à la fin du nom de l'etiquette voulue  </span></p>";
                 nbError++;
                 dirtyetiq2= true;
                } else if (ligne_str.length==1){
                  messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut mettre ':' à la fin du nom de l'etiquette voulue et ne pas sauter de ligne après l'étiquette ! </span></p>";
                  dirtyline=true;
                  nbError++;
                 }

                  if ( coding.getCop(ligne_str[0]) == -1 && !dirtyline) { 
                  messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> :  Il faut que ca soit une instruction parmi le jeu d'instructions  </span></p>";
                 nbError++;
                  }

                 if (line.indexOf(",") == -1 && !dirtyline) {
                    if (!util.instUnSeulOp(ligne_str[0])) { 
                      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut mettre ',' entre les operandes  </span></p>";
                      nbError++;
                    }
                  }
             
                  if (line.indexOf("[") != -1 && !dirtyline) {
                    if ((line.slice(line.indexOf("[") + 1, line.indexOf("]"))).indexOf(" ") != -1) {
                       messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut pas laisser des espaces entre '[' et ']'   </span></p>";
                       nbError++;
                       dirtyspace=true;
                       t=nbLigne;
                      }
                    else if (coding.regexi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) {
                      if (!coding.regAdrExi(line.slice(line.indexOf("[") + 1, line.indexOf("]")))) { 
                        messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut mettre un registre d'adressage ' BX SI DI '  entre '[' et ']'   </span></p>";
                        nbError++;
                        dirtyspace=true;
                        t=nbLigne;
                      }
                    }
                  }
             if (!dirtyline){
                  if (!coding.regexi(ligne_str[1]) && ligne_str[1].indexOf("[") == -1 ){
                    if (tabNomVariable.indexOf(ligne_str[1]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2){
                      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                     console.log("first herre the first param is not a reg");
                      nbError++;
                    }
                  }else if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) ){
                    if (tabNomVariable.indexOf(ligne_str[2]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2){
                      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
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
       messageDiv.innerHTML += "<p><span style='color: #9ca3af; '>Nombre d'erreur : <span style='color: red;'> " + nbError + "</span></span></p>";
    } else {
      messageDiv.innerHTML += "<p><span style='color: #9ca3af; '>Nombre d'erreur : <b><span style='color: green;'> " + nbError + "</span></b></span></p>";
    }
      console.log("Nombre d'erreur : ",nbError);
    //};
   // reader.readAsText(file);

  },// fin fonction error

  fromFileInputToTextZone: function (fileId, textZoneId) {
    const fileInput = document.getElementById(fileId);
    const file = fileInput.files[0];
    const reader = new FileReader();
    const textDiv = document.getElementById(textZoneId);
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
   
  fromTextZoneToPASSE_File: function(){
    
  },

}





// coding.js no need to import it   
export var coding = {
  // debut coderInst "codage des instructions " return tableau des mots memoir apres codage de l'instruction 
  coderInst: function (strLigne, adr, dataTab) {
    let str = "";
    let instrTab = new Array();
    if (strLigne[0][strLigne[0].length - 1] == ":") {
      str = strLigne[0];
      strLigne.shift();
    }
    instrTab.push(
      new CaseMc(adr, util.binaryToHex(coding.getCode(strLigne)), str)
    );
    if (coding.getFormat(strLigne) == "0") {
      for (let j = 0; j < instrTab.length; j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(), 4, 0));
      return instrTab;
    } else if (strLigne[0][strLigne[0].length - 1].toUpperCase() == "I") {
      if (coding.modeAdr(strLigne) == "00" && coding.getDest(strLigne) == "0") {
        if (strLigne[1].indexOf("[") != -1) {
          adr = this.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[1].slice(1, strLigne[1].length - 1), "") // remplir 0 remplirZero
          );
        } else {
          let indice = util.chercherDansTableau(dataTab, strLigne[1]);
          adr = this.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, dataTab[indice].getVal(), ""));
        }
        adr = this.incrementHex(adr, 1);
        if (strLigne[2].indexOf("H") != -1) {
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
          );
        } else instrTab.push(new CaseMc(adr, strLigne[2], ""));
        for (let j = 0; j < instrTab.length; j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(), 4, 0));
        return instrTab;
      }
      if (coding.modeAdr(strLigne) == "10" && coding.getDest(strLigne) == "0") {
        instrTab.push(
          new CaseMc(
            this.incrementHex(adr, 1),
            parseInt(getSubstringBetweenChars(strLigne[1], "+", "]")).toString(
              16
            )
          )
        );
      }
      for (let j = 0; j < instrTab.length; j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(), 4, 0));
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
    } else {
      if (coding.modeAdr(strLigne) == "10") {
        if (coding.getDest(strLigne) == "0") { //MOV [BX+3], AX
          let regEtDepl = strLigne[1].slice(1, strLigne[1].length - 1);
          let depl = "";
          if (this.regexi(regEtDepl.substring(0, 2))) { depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1); }
          else { depl = regEtDepl.substring(0, regEtDepl.length - 3); }
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        }
        else {
          let regEtDepl = strLigne[2].slice(1, strLigne[2].length - 1);
          let depl = "";
          if (this.regexi(regEtDepl.substring(0, 2))) { depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1); }
          else { depl = regEtDepl.substring(0, regEtDepl.length - 3); }
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        }
      } else if (coding.modeAdr(strLigne) == "10") {

      }
    }

    for (let j = 0; j < instrTab.length; j++) { instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(), 4, 0)) }
    return instrTab;
  }, // fin coder instruction 


  // return code binaire de l'instruction 
  getCode: function (str) {
    let code;
    if (str.length == 3) {
      if (this.regexi(str[1]) && this.regexi(str[2])) {
        code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1]), this.getReg(str[2]));
      }
      if (!this.regexi(str[1]) && this.regexi(str[2])) {
        if (this.regexi(str[1].slice(1, str[1].length - 1)))
          code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1].slice(1, str[1].length - 1)), this.getReg(str[2]));
        else if ((str[1].indexOf("[") != -1) && (str[1].indexOf("+") != -1)) {
          console.log("ttt");
          let regEtDepl = str[1].slice(1, str[1].length - 1);
          let reg = "";
          if (this.regexi(regEtDepl.substring(0, 2))) { reg = regEtDepl.substring(0, 2); }
          else { reg = regEtDepl.slice(-2); }
          code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[2]), this.getReg(reg));

        }
        else { code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[2]), "000"); }
      }
      if (this.regexi(str[1]) && !this.regexi(str[2])) {
        if (this.regexi(str[2].slice(1, str[2].length - 1))) { code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1]), this.getReg(str[2].slice(1, str[2].length - 1))); }

        else if ((str[2].indexOf("[") != -1) && (str[2].indexOf("+") != -1)) {
          let reg = "";
          let regEtDepl = str[2].slice(1, str[2].length - 1);
          if (this.regexi(regEtDepl.substring(0, 2))) { reg = regEtDepl.substring(0, 2); }
          else { reg = regEtDepl.slice(-2); }
          code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1]), this.getReg(reg));
        }
        else { code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1]), "000"); }

      }
    }
    else {
      if (this.regexi(str[1])) {
        code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1]), "000");
      }
      else if (this.regexi(str[1].slice(1, str[1].length - 1))) {
        code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), this.getReg(str[1].slice(1, str[1].length - 1)), "000");
      } else {
        code = this.getCop(str[0]).concat(this.modeAdr(str), this.getFormat(str), this.getDest(str), "000", "000");
      }
    }
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
      case "SUBA": ins = "000100"; break;
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
      case "ADDI": ins = "100001"; break;
      case "ADAI": ins = "100010"; break;
      case "SUBI": ins = "100011"; break;
      case "SBAI": ins = "100100"; break;
      case "CMPI": ins = "100101"; break;
      case "ORI": ins = "100110"; break;
      case "ANDI": ins = "100111"; break;
      case "LOADI": ins = "110110"; break;
      default: ins = "-1"; break;
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
    if (reg == "AX" || reg == "BX" || reg == "CX" || reg == "DX" || reg == "EX" || reg == "FX" || reg == "DI" || reg == "SI")
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
    if (!(this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) || this.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1))
    ) && !this.modeBaseIndx(tabIns)) {
      return true;
    }
    if (tabIns[0][tabIns[0].length - 1] == "I" && (this.regexi(tabIns[1]) || (!this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) &&
      !this.modeBaseIndx(tabIns)))) {
      return true;
    }
  }, // fin mode direct 

  // indirect 

  modeIndirct: function (tabIns) {
    if ((this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)) && this.regexi(tabIns[2])) || (this.regAdrExi(tabIns[2].slice(1, tabIns[2].length - 1)) &&
      this.regexi(tabIns[1])))
      return true;
    if (tabIns[0][tabIns[0].length - 1] == "I" && this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
      return true;
    else return false;
  }, // fin mode indirect 

  // mode base ou indexé 
  modeBaseIndx: function (tabIns) {
    if (this.regexi(tabIns[1]) && tabIns[2].slice(1, tabIns[2].length - 1).indexOf("+") != -1)
      return true;
    if (this.regexi(tabIns[2]) && tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1)
      return true;
    if (tabIns[0][tabIns[0].length - 1] == "I" && tabIns[1].slice(1, tabIns[1].length - 1).indexOf("+") != -1)
      return true;
    else return false;
  }, // fin  mode base ou indexé 

  // return le code de mode d'adressage 
  modeAdr: function (tabIns) {
    if (tabIns.length == 3) {
      if (tabIns[0] == "SHR" || tabIns[0] == "SHL" || tabIns[0] == "ROL" || tabIns[0] == "ROR"
      ) {
        console.log("Mode d'Adressage : 00 (direct) ");
        return "00";
      } else if ((util.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1) ||
        (util.getDel(tabIns[2], "[") != "" && tabIns[2].indexOf("[") != -1)) {
        console.log("Mode d'Adressage : 11 (Direct Indexé) ");
        return "11";
      } else {
        if (this.modeDirect(tabIns)) {
          console.log("Mode d'Adressage : 00 (direct) ");
          return "00";
        } else if (this.modeIndirct(tabIns)) {
          console.log("Mode d'Adressage : 01 (Indirect) ");
          return "01";
        } else if (this.modeBaseIndx(tabIns)) {
          console.log("Mode d'Adressage : 10 (Basé Indexé) ");
          return "10";
        }
      }
    } else if (tabIns.length == 2) {
      if (tabIns[0] == "LOAD") {
        if (this.regAdrExi(tabIns[1].slice(1, tabIns[1].length - 1)))
          return "01";
        else if (this.getDel(tabIns[1], "[") != "" && tabIns[1].indexOf("[") != -1)
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
      if (this.regexi(ligne_str[1]) || this.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)))
        return "0";
      else return "1";
    } else if (taille == 3) {
      if ((this.regexi(ligne_str[1]) && this.regexi(ligne_str[2])) || (this.regAdrExi(ligne_str[1].slice(1, ligne_str[1].length - 1)) &&
        this.regexi(ligne_str[2])) || (this.regAdrExi(ligne_str[2].slice(1, ligne_str[2].length - 1)) && this.regexi(ligne_str[1])))
        return "0";
      else return "1";
    }
  }, // fin getFormat 


}


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
  /*getCOP() {
    let val = this.hexToBinary(this.getVal());
    return code.substring(0, 6);
  }*/

  hexToBinary(hex) {
    return parseInt(hex, 16).toString(2);
  }
}




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
      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide [chaine vide ] </span></p>";
      nbError++;
    } // Vérifier si la chaîne est vide ou null

    // Vérifier si le premier caractère est une lettre, un underscore ou un dollar
    let firstChar = str.charAt(0);
    if (!/^[a-zA-Z_$]/.test(firstChar)) {
      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide [premier caractère invalide ] </span></p>";
      nbError++;
    }

    // Vérifier si les autres caractères sont des lettres, des chiffres, des underscores ou des dollars
    for (let i = 1; i < str.length; i++) {
      let char = str.charAt(i);
      if (!/^[a-zA-Z0-9_$]/.test(char)) {
        messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide [caractères invalides ] </span></p>";
        nbError++;
      }
    }

    //verifier si ce n'est pas sun nom de registre 
    if (coding.regexi(str)) {
      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut que le nom de la variable soit valide , il ne faut pas que ça soit un nom de registre </span></p>";
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
      messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut ecrire 'H' qui signifie la base hexadecimal </span></p>";
      nbError++;
    } else {
      ligne_str = ligne_str.slice(0, ligne_str.length - 1);
      if (!this.estHexadecimal(ligne_str)) {
        messageDiv.innerHTML += "<p><span style='color: red;'> Ligne " + nbLigne + "</span> <span style='color: #9ca3af; '> : Il faut donner une valeur hexadecimal valide </span></p>";
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


}// fin de l'objet " Util"




const testButton = document.getElementById("compile_id");
const textDiv = document.getElementById("code");
testButton.addEventListener("click", () => {
  let contents = textDiv.value; // récupère le contenu initial de la div
  textDiv.addEventListener('input', function() {
  contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
  });
  assembler.errorFunction(contents);
});

const fileInputButton = document.getElementById("Load")
fileInputButton.addEventListener("click",() => {
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


/*document.getElementById("saveButton").addEventListener("click", function() {
  var textToSave = document.getElementById("code").value;
  var blob = new Blob([textToSave], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "firstTry.PASSE");
});*/

/*document.addEventListener("keydown", function(e) {
  if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    var textToSave = document.getElementById("code").value;
    var blob = new Blob([textToSave], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "firstTry.PASSE");
  }
}, false);*/


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