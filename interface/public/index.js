/*************************************************************************
Ce fichier contient des opérations elementaires à notre appliquation, que ca 
soit la logique de l'exécution ou encore les evenements (event listeners)
*************************************************************************/

const dataCOel=  document.getElementById('dataCO');
const dataRAMel=  document.getElementById('dataRAM');
const dataRIMel=  document.getElementById('dataRIM');
const dataRIel=  document.getElementById('dataRI');                // needed declarations
const dataACCel=  document.getElementById('dataACC');
const dataEUAL1el=  document.getElementById('dataEUAL1');
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
const dataC6el=  document.getElementById('dataC6');
const dataDATAel=  document.getElementById('dataDATA');
// les indicateurs 
const indZ = document.getElementById("Z");
const indS = document.getElementById("S");
const indR = document.getElementById("R");
const indD = document.getElementById("D");

//let saisie = document.querySelector(".saisie");
let valider = document.getElementById("valider");
let nom = document.querySelector("#nom");
//saisie.style.display = "none";


//------------------------- Fonction qui traite et detecte les erreurs dans les programmes des utilisateurs --------------------


// l'objet dans lequel on a la fonction des erreurs 
export var assembler = {

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


          else if (ligne_str[0].toUpperCase() == 'SET' ||ligne_str[0].toUpperCase() == 'SETZ' )  // tester les conditions sur SET
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
              if (ligne_str[0].toUpperCase() == 'SET') {messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut attribuer une valeur à la donnée </span></p>";
            }else if(ligne_str[0].toUpperCase() == 'SETZ'){
              messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut spécifier le nombre de mots mémoires </span></p>";
            }
              nbError++;
              dirtyvar= true;
              t=nbLigne;
          }

          if (ligne_str.length == 3 ) {
            if (ligne_str[0].toUpperCase() == 'SET'){
            e = util.checkNumber(ligne_str[2], nbLigne);
            nbError+=e;}else if(ligne_str[0].toUpperCase() == 'SETZ'){

            }
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
        /*  else if (!trouvStop && (nbLigne == fileLength)) {
            messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut terminer par STOP  </span></p>";
            nbError++;
          } */
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
                   
                //  if (ligne_str[0].indexOf('I') != -1){
                  if(ligne_str[0].toUpperCase() == 'STOP') {
                    if (trouvStop) {
                      messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color:#9ca3af; '> : Il faut ecrire STOP une seule fois  </span></p>";
                      nbError++;
                    }
                    trouvStop = true;
                  }
                  if (ligne_str[0][ligne_str[0].length-1] == 'I'){
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
             if (!dirtyline && ligne_str.length>2){
                  if (!coding.regexi(ligne_str[1]) && ligne_str[1].indexOf("[") == -1 ){
                    if (tabNomVariable.indexOf(ligne_str[1]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                      messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                     console.log("first herre the first param is not a reg");
                      nbError++;
                    }
                  }else if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) && (ligne_str[0].indexOf('I')==-1) &&ligne_str[2].indexOf('[')==-1 ){
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

               //   if (ligne_str[0].indexOf('I') != -1){
                  if (ligne_str[0][ligne_str[0].length-1] == "I"){
                    console.log(ligne_str);
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
                  console.log(ligne_str);
             if (!dirtyline){
                  if (!coding.regexi(ligne_str[1]) && ligne_str[1].indexOf("[") == -1 ){
                    if (tabNomVariable.indexOf(ligne_str[1]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                      messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                     console.log("first herre the first param is not a reg");
                      nbError++;
                    }
            
             //     }else if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) && (ligne_str[0].indexOf('I')==-1)){
            }else if(ligne_str.length >2 ){
            if((!dirtyspace || t!=nbLigne) && !coding.regexi(ligne_str[2]) && (ligne_str[0][ligne_str[0].length-1] != "I") && ligne_str[2].indexOf("[") == -1 ){   
              if (tabNomVariable.indexOf(ligne_str[2]) == -1 && (!dirtyvar || t!=nbLigne) && !dirtyetiq2 && (!jumpbit || t!=nbLigne)){
                      messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> :  Il faut declarer les variables    </span></p>";
                      console.log("first herre the second param is not a reg");
                      nbError++;
                    }
                  }}


                }


            }
          }  // fin traitement instructions
         
          i++;
        } 
      };
      if (!trouvStop ) {
        messageDiv.innerHTML += "<p class='errormsg'><span style='color: rgb(150, 10, 10);'> Ligne " + nbLigne + "</span><span style='color: #9ca3af; '> : Il faut terminer par STOP  </span></p>";
        nbError++;
      }
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

  fromFileInputToTextZone: function (fileId, textZoneId, secondtextZoneId) {

    const fileInput = document.getElementById(fileId);
     
    /*if (fileInput.files.length === 0) {
      alert("Please select a file to import.");
      return;
    }else 
    alert("fichier importé avec succès ! cliquer sur afficher contenu pour travailler sur son contenu ")*/
    var textDiv ;
    const file = fileInput.files[0];
    const reader = new FileReader();
    //textDiv.style.color="white";
    reader.onload = (event) => {
      const contents = event.target.result;
      let lines = contents.split('\n');
      lines = lines.filter(line => line.trim() !== '');   
      let l =lines[0].split(' ');
      if (l[0].toUpperCase()=="ORG"){
         textDiv = document.getElementById(textZoneId);
      }else {
        textDiv = document.getElementById(secondtextZoneId);
      }
      textDiv.style.backgroundColor="#010232";
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
  var textDiv;
  messageDiv.innerHTML = ""; 
  console.log("contents from fromFileNameToTextZone     : \n"+ contents);
  let lines = contents.split('\n');
  lines = lines.filter(line => line.trim() !== '');   
   let l =lines[0].split(' ');
  if (l[0].toUpperCase()=="ORG"){
    console.log("inside == org ");
     textDiv = document.getElementById("code");
  }else{
    var textDiv = document.getElementById("code2");
  }
  let textContent = "";
  for (const line of lines) {
    textContent += line + "\n";
  }
  textDiv.textContent = textContent;

},

  fromTextZoneToPASSE_File: function(){
    
  },

}// fin obj assembler



 //-------------------------------------  Fin erreur function and all related stuff with it -------------------------------------




//______________________________________fonctions decodage / traduction _________________________________________________________

export var Translate = {
  translateFunction: function (contents) {
    messageDiv.innerHTML = ""; 
    let lines = contents.split('\n');
    console.log(contents);
    lines = lines.filter(line => line.trim() !== '');  // remove the empty lines from my filecontents : the table lines which represents the lines of the file 
    let i=0;    
    console.log("lines.length  : "+lines.length);           
    for (const line of lines) {
      main.instrTab.push(new CaseMc("",line.toString().trim(),""))
     i++;
    }
    console.log("main.instrTab.length  : "+main.instrTab.length);           

  }
}

const translateButton = document.getElementById("translate_id")
translateButton.addEventListener("click",  () => {
  const textDiv1 = document.getElementById("code");
  const textDiv2 = document.getElementById("code2");
if (textDiv1.value != '') {
assembler.errorFunction(textDiv1.value);
main.coder(textDiv1.value);
let tab=main.getinstrTab();
for(let i=0;i< tab.length;i++){
console.log(tab[i].afficher());
textDiv2.innerHTML += tab[i].getVal() + '\n';
}
} else {

  Translate.translateFunction(textDiv2.value);
  decodage.fonctionDecodage();
  for(let i=0;i< decodage.tabInstrMnemonique.length;i++){
    let str="" ; 
    for(let j=0;j<decodage.tabInstrMnemonique[i].length;j++) {
      if(decodage.tabInstrMnemonique[i][j] != "") 
      str = str+" "+decodage.tabInstrMnemonique[i][j] }
      textDiv1.innerHTML += str + '\n';
    
    
     
    }


  
}


});


  /*let contents = textDiv.value; // récupère le contenu initial de la div
  contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
  assembler.errorFunction(contents);*/



//______________________________________FIN Traduction___________________________________________________________________________





   
//____________________________________  All used Classes  ____________________________________________//

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



class RI {
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



// le variable util 
var util = {
  


  chercherDansTableau: function (tableau, valeur) {
    // change the name to chercherEtiq
    let i = 0;
    while (i < tableau.length && tableau[i].getEtiq() != valeur) {
      i++;
    }
    return i;
  }, // fin  chercherDansTableau

  chercherDansTableau2: function (tableau, valeur,adr) {
    // change the name to chercherEtiq
    let i = 0;
    while (i < tableau.length ) {
      if(tableau[i].getEtiq() == valeur) {
        let adresse = main.tabEtiq[i].getAdr();
        let indice2 = util.chercherAdr(main.instrTab,adresse)
        main.instrTab[indice2].setVal(util.remplirZero(adr,4,0)) ;
      }
      i++;
    }
    return i;
  }, // fin  chercherDansTableau

  chercherDansTableauDeuxDimension: function (tableau, valeur) {
    // change the name to chercherEtiq
    let i = 0;
    while (i < tableau.length && tableau[i][0] != valeur) {
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
      for (let k = 0; k < n - length; k++) { s += "0";}
      return s + str;
    } else {
      if (gd == 1) {
        for (let k = 0; k < n - length; k++) {str += "0"; }
        return str;
      } else { throw new Error("Le troisieme parametre doit etre 0 ou 1."); } }
  }, // fin remplirZero

 // Find position of delimiter
  getDel: function (str, delimiter) {
    let position = str.indexOf(delimiter); 
    if (position !== -1) { // Check if delimiter is found
      str = str.substring(0, position); }// Delete characters after delimiter
    return str;
  }, //fin  getDel
  
  // faire l'addition en hexadecemal 
  additionHexa: function (x1,x2) {
    let a = util.hexEnBinaire(util.remplirZero(x1,4,0));
    let b = util.hexEnBinaire(util.remplirZero(x2,4,0));
    let sum = '';
    let carry = 0;
    let i = a.length - 1;
    let j = b.length - 1;
  
    while (i >= 0 || j >= 0 || carry > 0) {
    let digitA = i >= 0 ? parseInt(a.charAt(i), 2) : 0;
    let digitB = j >= 0 ? parseInt(b.charAt(j), 2) : 0;
    let digitSum = digitA + digitB + carry;
  
    carry = digitSum >= 2 ? 1 : 0;
    digitSum = digitSum % 2;
    sum = digitSum + sum;

    i--;
      j--;
    }
    return util.binaryToHex(sum) ;
  }, // fin  additionHexa

  /**
+   * elle place l'indicateur zero selon l'operation de l'addition 
+   * @param {1} x1 
+   * @param {2} x2 
+   */
  setIndZeroAddition: function (x1, x2) {
    x1 = (util.remplirZero(x1,4,0)).slice(-4) ;
    x2 = (util.remplirZero(x2,4,0)).slice(-4) ;
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

    x1 = (util.remplirZero(x1,4,0)).slice(-4) ;
    x2 = (util.remplirZero(x2,4,0)).slice(-4) ;
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

x1 = (util.remplirZero(x1,4,0)).slice(-4) ;
x2 = (util.remplirZero(x2,4,0)).slice(-4) ;
let x1bin = util.hexEnBinaire(x1) ;
let x2bin = util.hexEnBinaire(x2) ;
let resultat = (this.additionHexa(x1,x2)).slice(-4) ; //slice(-4) car on doit comparer avec le premier bit du resultat ecrit sur 16bits
resultat = util.remplirZero((util.hexEnBinaire(resultat)),16,0) ;
if ((x1bin[0]=="1")&&(x2bin[0]=="1")&&(resultat[0]=="0")) {main.setIndicateurDebord("1") ; return ;}
else if ((x1bin[0]=="0")&&(x2bin[0]=="0")&&(resultat[0]=="1")) {main.setIndicateurDebord("1"); return ;}
else {main.setIndicateurDebord("0"); return ;}
},
    
setIndRetenueAddition: function(x1,x2) {
  x1 = (util.remplirZero(x1,4,0)).slice(-1) ;
  x2 = (util.remplirZero(x2,4,0)).slice(-1) ;
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

  // convertir un nombre binaire en hexadecimal 
  binaryToHex: function (binary) {
    const decimal = parseInt(binary, 2);
    const hex = decimal.toString(16);
    return hex.toUpperCase();
  }, // fin  binaryToHex
  
  hexEnBinaire: function (hex) {
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
      const char = parseInt(hex[i], 16).toString(2);
      binary += char.padStart(4, "0");
    }
    return binary;
  },

   // verifie si un nombre est en hexadecimal 
   estHexadecimal: function (chaine) {
    return !isNaN(parseInt(chaine, 16));
  }, // fin estHexadecimal

  
 isVariableNameValid: function (str,nbLigne) {
  let messageError= [] ; 
  if (!str) {  messageError.push(nbLigne+" Il faut que le nom de la variable soit valide  ") ;  } // Vérifier si la chaîne est vide ou null

  // Vérifier si le premier caractère est une lettre, un underscore ou un dollar
  let firstChar = str.charAt(0);
  if (!/^[a-zA-Z_$]/.test(firstChar)) { messageError.push(nbLigne+" Il faut que le nom de la variable soit valide ");  }

  // Vérifier si les autres caractères sont des lettres, des chiffres, des underscores ou des dollars
  for (let i = 1; i < str.length; i++) {
    let char = str.charAt(i);
    if (!/^[a-zA-Z0-9_$]/.test(char)) {  messageError.push(nbLigne+" Il faut que le nom de la variable soit valide ");  } }
  if ( coding.regexi(str)) {   messageError.push(nbLigne+" Il faut que le nom de la variable soit valide , il faut pas que ça soit un nom de registre ");  ; }
  /* La chaîne est valide */
  return messageError ;    },

checkNumber: function(ligne_str,nbLigne) {
  let messageError= [] ; 
  if (ligne_str.indexOf("H") ==  -1 ) {  messageError.push(nbLigne+" Il faut ecrire 'H' qui signifie la base hexadecimal ");    } 
         else { ligne_str = ligne_str.slice(0,ligne_str.length-1) ; 
          if (! this.estHexadecimal(ligne_str)) {  messageError.push(nbLigne+" Il faut donner une valeur hexadecimal"); } }
     return messageError ; 
},
instUnSeulOp: function(str) {
     str = str.toUpperCase() ; 
     if (str== 'ADA' || str == 'ADAI' ||str=="SBA" || str=="SBAI" || str=='STOP' || str=='START' || str=='IN' || str=='OUT' || str=='JMP' || 
     str=='NOT' || str=='DEC' || str=='INC' || str=='STORE' || str=='LOAD' || str=='LOADI' || str=='JNE' || str=='JE' ||
     str== 'JNO' || str == 'JO' || str=='JNS' || str=='JS' || str=='JNC' || str=='JC' || str=='JNZ' || str== 'JZ' ) return true ; 
     else return false ; 
},
instUnSeulOpHexa: function(str) {  
  if (str== '000010' || str == '100010' ||str=="010110" || str=="011000" || str=='011001' || str=='011010' || str=='110110' || str=='010111' || str=='000100' || 
  str=='100100' ) return true ; 
  else return false ; 
},

getCodeASCIIHex: function(caractere) {
  return caractere.charCodeAt(0).toString(16);
},
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
m_ = (util.negationComplementADeux(m)).slice(-16) ;
resultat = util.additionHexa(util.remplirZero(n,4,0),(util.binaryToHex(m_)).slice(-4)) ;
}
else //cas2: si m negatif ie: le bit le plus a gauche est à 1 cela revient a l'addition de n + m
{
m_ = (util.positiveComplementADeux(m)).slice(-16) ;
resultat = util.additionHexa(util.remplirZero(n,4,0),(util.binaryToHex(m_)).slice(-4)) ;
}
//positionner les indicateurs
util.setIndDebordAddition(n,(util.binaryToHex(m_)).slice(-4)) ;
util.setIndRetenueAddition(n,(util.binaryToHex(m_)).slice(-4)) ; 
util.setIndZeroAddition(n,(util.binaryToHex(m_)).slice(-4)) ; 
util.setIndSigneAddition(n,(util.binaryToHex(m_)).slice(-4)) ; 
       
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

NotHex: function (hexString) {
  // Convertir le nombre hexadécimal en décimal
  var decimal = parseInt(hexString, 16);

  // Appliquer l'opération NOT logique
  var result = ~decimal;

  // Masquer le résultat pour obtenir 16 bits
  result = result & 0xFFFF;

  // Convertir le résultat en binaire avec 16 bits
  var binaryResult = result.toString(2).padStart(16, '0');

  // Convertir le résultat binaire en hexadécimal avec 4 positions
  var hexResult = parseInt(binaryResult, 2).toString(16).toUpperCase().padStart(4, '0');

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
let decimalX = "";// conversion hexadécimale en décimal
let decimalY = ""; // conversion hexadécimale en décimal
let xBin = (this.hexEnBinaire(util.remplirZero(x,4,0))).slice(-16); 
let yBin = (this.hexEnBinaire(util.remplirZero(y,4,0))).slice(-16);
if(xBin[0]=="0"){decimalX = parseInt(x, 16);} else {decimalX = parseInt(((util.binaryToHex(this.positiveComplementADeux(x))).slice(-4)),16)*(-1);}
if(yBin[0]=="0"){decimalY = parseInt(y, 16);} else {decimalY = parseInt(((util.binaryToHex(this.positiveComplementADeux(y))).slice(-4)),16)*(-1);}


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
// la fpnction qui supprime tout les zéro a gauche 
supprimerToutZerosGauche: function(chaine) {
 
    // Vérifier si la chaîne est vide
    if (chaine.length === 0) {
      return chaine;
    }
    
    // Trouver l'indice du premier caractère différent de zéro
    let indice = 0;
    while (indice < chaine.length && chaine.charAt(indice) === '0') {
      indice++;
    }
    
    // Retourner la chaîne sans les zéros à gauche
    let nouvelleChaine = chaine.substring(indice);
    
    // Vérifier si la chaîne résultante est vide ou égale à "0"
    if (nouvelleChaine === "" || nouvelleChaine === "0") {
      return "0";
    }
    
    return nouvelleChaine;
  
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



}

//________________________________________ End of used classes _______________________________________________







//_______________________________________ Needed Function in Execute ______________________________________________________


// la variable coding qui sera utilisé pour l'execution seulemnt 
var codingExecute = {
  // debut coderInst "codage des instructions " return tableau des mots memoir apres codage de l'instruction 
  coderInst: function (strLigne, adr, dataTab) 
  {
    
    let str = "";
    let instrTab = new Array();
    if (strLigne[0][strLigne[0].length - 1] == ":") {
      if(main.tabEtiq.length > 0) {
        let indice  = util.chercherDansTableau2(main.tabEtiq,strLigne[0].slice(0,strLigne[0].length-1),adr) ; 
      }
      str = strLigne[0].slice(0,strLigne[0].length-1);
      strLigne.shift();
    }
    
    
    instrTab.push(
      new CaseMc(adr,util.binaryToHex(codingExecute.getCode(strLigne)),str)
    );
   
    if(strLigne.length >2) {
      if(strLigne[0].toUpperCase() == "SHL" || strLigne[0].toUpperCase() == "SHR" || strLigne[0].toUpperCase() == "ROL" || strLigne[0].toUpperCase() == "ROR" ) {
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr,strLigne[2], ""));
        for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
        return  instrTab ; 
      }
    else if (codingExecute.getFormat(strLigne) == "0") {
      for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
      return instrTab;
    } else if (strLigne[0][strLigne[0].length - 1].toUpperCase() == "I"  ) {

      if (codingExecute.modeAdr(strLigne) == "00" && codingExecute.getDest(strLigne) == "0") {
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
      else if((codingExecute.modeAdr(strLigne) == "00" && codingExecute.getDest(strLigne) == "1") ||  (codingExecute.modeAdr(strLigne)== "01")) {
        adr = util.incrementHex(adr, 1);
        instrTab.push(
          new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
        );
      }
      else if (codingExecute.modeAdr(strLigne) == "10" && codingExecute.getDest(strLigne) == "0") {
        let regEtDepl = strLigne[1].slice(1, strLigne[1].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
            else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        adr = util.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
          );
      }
      else if(codingExecute.modeAdr(strLigne) == "11" && codingExecute.getDest(strLigne) == "0") {
        let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
        else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        if(strLigne[1].indexOf("+") != -1){
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr, depl.toString(16), ""));}
        else{instrTab.push(new CaseMc(adr,"0000", "")); }
        let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
         adr = util.incrementHex(adr, 1);
         instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
        adr = util.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
          );
      }
      for (let j=0; j<instrTab.length;j++) instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) ;
      return instrTab;
    } else if (codingExecute.modeAdr(strLigne) == "00") {
      if (codingExecute.getDest(strLigne) == "0") {
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
    } else {if (codingExecute.modeAdr(strLigne) == "10") {
      if (codingExecute.getDest(strLigne) == "0"){ //MOV [BX+3], AX
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
  } else if (codingExecute.modeAdr(strLigne) == "11") {
     if(codingExecute.getDest(strLigne) == "1") {
    
      let regEtDepl = strLigne[2].slice(strLigne[2].indexOf("[")+1, strLigne[2].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
        else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        if(strLigne[2].indexOf("+") != -1){
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));}else{
            instrTab.push(new CaseMc(adr,"0000", ""));
          }
        let indice = util.chercherDansTableau(dataTab, strLigne[2].slice(0,strLigne[2].indexOf("[")));
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
     }else {

        let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
        else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        if(strLigne[1].indexOf("+") != -1){
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));}else{
            instrTab.push(new CaseMc(adr,"0000", "")); }
        let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
         adr = util.incrementHex(adr, 1);
         instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));

     }
        
  }}

for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
return instrTab;
    } else if(strLigne.length == 2) {
      if ((strLigne[0])[0] == "J"){
         adr = util.incrementHex(adr, 1);
           let indice = util.chercherDansTableau(main.instrTab,strLigne[1]) ; 
      //     console.log(strLigne[1]);
           if(indice<(main.instrTab).length){
             instrTab.push(new CaseMc(adr,util.remplirZero(main.instrTab[indice].getAdr(),3,0),""));
           }else{
             instrTab.push(new CaseMc(adr,"","")) ; 
             main.tabEtiq.push(new CaseMc(adr,"",strLigne[1])) ; 
           }
      }
      else if(this.getFormat(strLigne) == "1" ||  strLigne[0]=="ORG" ) {
        if(strLigne[0][strLigne[0].length - 1].toUpperCase() != "I" && strLigne[0]!="ORG"){
        if (strLigne[1].indexOf("[") != -1 ) {
          if(strLigne[1][0] != "[") {
            let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
             let depl = "";
            if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
             else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
             if(strLigne[1].indexOf("+") != -1){
              adr = util.incrementHex(adr, 1);
              instrTab.push(new CaseMc(adr, depl.toString(16), ""));}
              else{instrTab.push(new CaseMc(adr,"0000", ""));}
              let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));

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
      else if(strLigne[1]== "IN" ){
             adr = util.incrementHex(adr, 1);
           let indice = util.chercherDansTableau(main.dataTab,strLigne[1]) ; 
           instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
      }
    } 
  
    for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }
    return instrTab;
  
}, // fin coder instruction 


    // return code binaire de l'instruction 
    getCode: function (str) {
      let code; 
      if(str[0] == "STOP" || str[0] == "IN" || str[0] == "START" || str[0] == "ORG" ) {
        console.log( this.getCop(str[0]));
        code = this.getCop(str[0]).concat("0000000000");
      }
      else if (str.length == 3) {
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
          else {
            if(str[1][0] != "[" && (str[1].indexOf("[") != -1 )) {
              let reg = str[1].slice(str[1].indexOf("[")+1,str[1].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),this.getReg(reg));
            }
            else code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),"000");}
        }
        else if(this.regexi(str[1]) && !this.regexi(str[2]))
        {
          if(this.regexi(str[2].slice(1,str[2].length-1))) 
          {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(str[2].slice(1,str[2].length-1)));
          }
          
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
          else {
            if(str[2][0] != "[" && (str[2].indexOf("[") != -1 )) {
              let reg = str[2].slice(str[2].indexOf("[")+1,str[2].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(reg));
            }
            else code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),"000");} 
    
        }
        else{
          if((str[1].indexOf("+") == -1)&&(str[2].indexOf("+") == -1)) {
             if((str[1].indexOf("[") != -1 ) && str[1][0] != "[" ){
              let reg = str[1].slice(str[1].indexOf("[")+1,str[1].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
            }
         else  code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),"000");
        }
          
            else if ((str[1].indexOf("[") != -1 ) && (str[1].indexOf("+") != -1)) {
              let modeAdr= this.modeAdr(str) ; 
              if(str[1][0] != "["){
                   let regEtDepl = (str[1].slice(str[1].indexOf("["),str[1].length)).slice(1, str[1].length - 1) ;
                   let reg = "" ;
                   if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
                   else {reg = regEtDepl.slice(-2);}
                   code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
              } 
              else{
              let regEtDepl = str[1].slice(1, str[1].length - 1) ;
              let reg = "" ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
            }
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
          if(str[1].indexOf("+") != -1) {
          let reg = "";
          let regEtDepl = (str[1].slice(str[1].indexOf("["),str[1].length)) .slice(1, str[1].length - 1) ;
          if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
          else {reg = regEtDepl.slice(-2);}
          code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
          }
          else {
            let reg = str[1].slice(str[1].indexOf("[")+1,str[1].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
          }
         }
          
        else {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),"000","000");
      }

      }
        console.log(code);
        return code;
    }, // fin getcode 

    // return code operation de l'instruction 
    getCop: function (str) {
      console.log(str);
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
        case "ORG": ins = "101010"; break;
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


} // fin  codingExecute

// la variable decodage qui sera utilisé pour l'execution seulemnt 
var decodage = {

  tabInstrMnemonique : [] ,
  fonctionDecodage: function() { 
     
       let i=0 ; 
      while(i<main.instrTab.length){
              console.log("val:",main.instrTab[i].getVal());
              console.log("inside while");
              let motBinaire =util.hexEnBinaire(main.instrTab[i].getVal()) ;
              console.log("motBinaire: ",motBinaire);
              let ind=0 ; 
              let cop = motBinaire.substring(0, 6); // capable de changer le 5 à 6 etc ..
              let ma = motBinaire.substring(6, 8);
              let f = motBinaire.substring(8, 9);
              let d = motBinaire.substring(9, 10);
              let reg1 = motBinaire.substring(10, 13);
              let reg2 = motBinaire.substring(13, 16);
              let Etiqt="" ; 
              if(main.instrTab[i].getEtiq() != ""){
              Etiqt = main.instrTab[i].getEtiq().concat(":") ; }
             console.log("ma:",ma," f:",f);
             if(cop == "011111" || cop == "101001"  ) { 
              i=i+2 ; 
             }
              else if(this.getNom(cop)[0] == "J"){
               let indice=util.chercherAdr(main.instrTab,main.instrTab[i+1].getVal().slice(1)) ; 
               console.log("   ",main.instrTab,main.instrTab[i+1].getVal());
                this.tabInstrMnemonique.push([this.getNom(cop),main.instrTab[indice].getEtiq(),"",""]) ; 
                i=i+2; 
              } else if((cop[0] == "1"  && this.getNom(cop) != "START" && cop != "101010" ) || (cop=="001000" || cop=="001001" || cop=="001010" || cop=="001011" )) {
                if(util.instUnSeulOpHexa(cop)){
                    if(ma == "00" && f=="1" ){
                      this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()).concat("H"),"",""]) ;
                    }
                    i=i+2; 
                }
                else if(ma == "00" && f=="1" && d=="1"){
                  if(cop=="001000" || cop=="001001" || cop=="001010" || cop=="001011" )
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal())]) ;
                  else this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()).concat("H")]) ;
                i=i+2;  
                } else if(ma == "00" && f=="1" && d=="0"){
                 
                  let indice=util.chercherAdr(main.dataTab,main.instrTab[i+1].getVal().slice(1)) ;
                  if(indice == main.dataTab.length) main.dataTab.push(new CaseMc("0000",main.dataTab[indice].getAdr(),"")) ; 
                  if(main.dataTab[indice].getEtiq() != ""){
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),main.dataTab[indice].getEtiq(),",",util.supprimerToutZerosGauche(main.instrTab[i+2].getVal()).concat("H")]) ;}
                  else this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(util.remplirZero(main.instrTab[i+1].getVal().slice(1)),"H]"),",",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()).concat("H")]) ;
                  i=i+3;
                }
                else if(ma == "01" && f=="1" &&  d=="0") {
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(this.getNomReg(reg1),"]"),",",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()).concat("H")]) ;
                  i++ ; 
                } else if(ma == "10" && f=="1" &&  d=="0"){
                  this.tabInstrMnemonique.push([this.getNom(cop),"[".concat(this.getNomReg(reg1),"+",util.supprimerToutZerosGauche(main.instrTab[i+2].getVal()),"]"),",",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()).concat("H")]) ;
                  i=i+3; 
                } else if(ma == "11" && f=="1"  &&  d=="0") {
                  if(main.instrTab[i+1].getVal() == "0000") {  
                   let  etiq= main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[i+2].getVal().slice(1))].getEtiq() ;   
                    this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),etiq,"[".concat(this.getNomReg(reg1),"]"),",",util.supprimerToutZerosGauche(main.instrTab[i+3].getVal()).concat("H")]) ;  
                    }
                    else{
                       let etiq= main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[i+2].getVal().slice(1))].getEtiq() ;  
                       this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),etiq,"[".concat(this.getNomReg(reg1),"+",parseInt(main.instrTab[i+1].getVal(), 16),"]"),",",util.supprimerToutZerosGauche(main.instrTab[i+3].getVal()).concat("H")]) ;
                    } i = i+4 ; 
                }
                    

              }
              else {
               
                if(util.instUnSeulOpHexa(cop)){
                  
                  console.log("cop",this.getNom(cop));
                  this.getNom(cop) ;
                  if(ma == "00" && f=="0" ){
                    this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),"",""]) ; 
                    i++ ; 
                  }else if(ma == "00" && f=="1") {
                  
                    let indice=util.chercherAdr(main.dataTab,main.instrTab[i+1].getVal().slice(1)) ; 
                    
                    if(indice == main.dataTab.length) main.dataTab.push(new CaseMc("0000",main.dataTab[indice].getAdr(),"")) ; 
                    if(main.dataTab[indice].getEtiq() != ""){
                    this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),main.dataTab[indice].getEtiq()]) ; 
                    }
                    else {this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(main.instrTab[i+1].getVal().slice(1),"H]"),"",""]) ;
                  } i=i+2;
                  }else if(ma == "01" && f=="0" ) {
                    this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(this.getNomReg(reg1),"]"),"",""]) ; 
                    i++ ; 
                  }else if(ma == "11" && f=="1") {
                    let etiq ; 
                    if(main.instrTab[i+1].getVal() == "0000") {   
                    etiq= main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[i+2].getVal().slice(1))].getEtiq() ;   
                    this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),etiq,"[".concat(this.getNomReg(reg1),"]"),"",""]) ;  
                    i=i+3;}
                    else{
                       etiq= main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[i+2].getVal().slice(1))].getEtiq() ;      
                       this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),etiq,"[".concat(this.getNomReg(reg1),"+",parseInt(main.instrTab[i+1].getVal(), 16),"]"),"",""]) ;
                    i=i+3;}
                  }
              }
              else if(ma == "00" && f=="0"  ){
             
                if(cop == "101010") { 
                  console.log(" dkheel");
                  this.tabInstrMnemonique.push([this.getNom(cop),util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()).concat("H"),"",""]) ; i=i+2;  }
                else  if(this.getNom(cop)=="START" || this.getNom(cop)=="STOP"  ){ this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"","",""]) ; i++ }
                else{ this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",",this.getNomReg(reg2)]) ; 
              i++; }
              }
              else if(ma == "00" && f=="1" && d=="1"){
                 
                  let indice=util.chercherAdr(main.dataTab,main.instrTab[i+1].getVal().slice(1)) ; 
                  if(indice == main.dataTab.length) main.dataTab.push(new CaseMc("0000",main.instrTab[i+1].getVal().slice(1),"")) ; 
                  if(main.dataTab[indice].getEtiq() != ""){
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",",main.dataTab[indice].getEtiq()]) ;}  
                  else this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",","[".concat(main.instrTab[i+1].getVal().slice(1),"H]")]) ;
                  i=i+2 ; 
                }
              else if (ma == "00" && f=="1" && d=="0"){
                  let indice=util.chercherAdr(main.dataTab,main.instrTab[i+1].getVal().slice(1)) ; 
                  if(indice == main.dataTab.length) main.dataTab.push(new CaseMc("0000",main.instrTab[i+1].getVal().slice(1),"")) ; 
                  if(main.dataTab[indice].getEtiq() != ""){
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),main.dataTab[indice].getEtiq(),",",this.getNomReg(reg1)]) ;}
                  else this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(main.instrTab[i+1].getVal().slice(1),"H]"),",",this.getNomReg(reg1),]) ;
                  i=i+2;
                }
              else if(ma == "01" &&  d=="1") {
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",","[".concat(this.getNomReg(reg2),"]")]) ; 
                   i++ ; 
                }
              else if(ma == "01" &&  d=="0"){
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(this.getNomReg(reg2),"]"),",",this.getNomReg(reg1)]) ; 
                  i++ ;
                }
              else if(ma == "10" &&  d=="1"){
                   this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",","[".concat(this.getNomReg(reg2),"+",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()),"]")]) ;
                  i=i+2;
                }
            else if(ma == "10" &&  d=="0"){
                 this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),"[".concat(this.getNomReg(reg2),"+",util.supprimerToutZerosGauche(main.instrTab[i+1].getVal()),"]"),",",this.getNomReg(reg1)]) ;
                 i=i+2; 
                }
                else if(ma == "11" &&  d=="1"){
                  let etiq ; 
                  if(main.instrTab[i+1].getVal() == "0000") {
                  etiq= main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[i+1].getVal().slice(1))].getEtiq(); 
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",",etiq,"[".concat(this.getNomReg(reg2),"]")]) ;
                   i=i+3;} 
                  else { etiq= main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[i+2].getVal().slice(1))].getEtiq() ;                     
                    this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),this.getNomReg(reg1),",",etiq,"[".concat(this.getNomReg(reg2),"+",parseInt(main.instrTab[i+1].getVal(), 16),"]")]) ;
                  i=i+3;}

                }
            else if(ma == "11" &&  d=="0"){
                  let etiq ; 
                  let indice=util.chercherAdr(main.dataTab,main.instrTab[i+2].getVal().slice(1)) ;
                  if(indice == main.dataTab.length) main.dataTab.push(new CaseMc("0000",main.dataTab[indice].getAdr(),"")) ; 
                  if(main.instrTab[i+1].getVal() == "0000") {  
                  
                  etiq= main.dataTab[indice].getEtiq() ;   
                  this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),etiq,"[".concat(this.getNomReg(reg2),"]"),",",this.getNomReg(reg1)]) ;  
                  i=i+3;}
                  else{
                     etiq= main.dataTab[indice].getEtiq() ;               
                     this.tabInstrMnemonique.push([Etiqt,this.getNom(cop),etiq,"[".concat(this.getNomReg(reg2),"+",parseInt(main.instrTab[i+1].getVal()),"]"),",",this.getNomReg(reg1)]) ;
                  i=i+3;}
                }
              
              }   
       
      }
      for(let i=0;i<this.tabInstrMnemonique.length;i++)
      console.log(i+1," ",this.tabInstrMnemonique[i]);
  },


  // Fin fonction decodage 
  getNom: function (str) {
      let ins;
      switch (str) {
        case "000000": ins = "MOV"; break;
        case "000001": ins = "ADD"; break;
        case "000010": ins = "ADA"; break;
        case "000011": ins = "SUB"; break;
        case "000100": ins = "SBA"; break;
        case "000101": ins = "CMP"; break;
        case "000110": ins = "OR"; break;
        case "000111": ins = "AND"; break;
        case "001000": ins = "SHR"; break;
        case "001001": ins = "SHL"; break;
        case "001010": ins = "ROL"; break;
        case "001011": ins = "ROR"; break;
        case "001100": ins = "JZ"; break;
        case "001101": ins = "JNZ"; break;
        case "001110": ins = "JC"; break;
        case "010000": ins = "JS"; break;
        case "001111": ins = "JNC"; break;
        case "010001": ins = "JNS"; break;
        case "010010": ins = "JO"; break;
        case "010011": ins = "JNO"; break;
        case "010100": ins = "JE"; break;
        case "010101": ins = "JNE"; break;
        case "010110": ins = "LOAD"; break;
        case "010111": ins = "STORE"; break;
        case "011000": ins = "INC"; break;
        case "011001": ins = "DEC"; break;
        case "011010": ins = "NOT"; break;
        case "011011": ins = "JMP"; break;
        case "011100": ins = "IN"; break;
        case "011101": ins = "OUT"; break;
        case "011111": ins = "START"; break;
        case "011110": ins = "STOP"; break;
        case "100000": ins = "MOVI"; break;
        case "100001": ins = "ADDI";break;
        case "100010": ins = "ADAI"; break;
        case "100011": ins = "SUBI"; break;
        case "100100": ins = "SBAI"; break;
        case "100101": ins = "CMPI"; break;
        case "100110": ins = "ORI"; break;
        case "100111": ins = "ANDI"; break;
        case "110110": ins = "LOADI"; break;
        case "101010": ins = "ORG"; break;
        default: ins= "-1"; break;
      }
      return ins;
    }, // fin get code operation 

    getNomReg: function (reg) {
      let code;
      switch (reg.toUpperCase()) {
        case "000": code = "AX"; break;
        case "001": code = "BX"; break;
        case "010": code = "CX"; break;
        case "011": code = "DX"; break;
        case "100": code = "EX"; break;
        case "101": code = "FX"; break;
        case "110": code = "SI"; break;
        case "111": code = "DI"; break;
        default: code = "000"; break;
      }
      return code;
    }, // fin get code registre 

    
}; 


// used in execute function 
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
    if(codeIns == "STOP") return cpt+1 ; 
    if(codeIns[0]== "J") {
      return this.jmp(codeIns,indicateurTab,cpt)  ; 
    }
    else if(codeIns == "STORE") {
      this.store(cpt) ; 
      return cpt +2 ;
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
      else if((modeAdr == "11") && dest == "0" && format == "1") {
      this.LoadDirectIndexe(param1,dataTab,instrTab,cpt) 
      return cpt +main.Nbinst;}
    }
    else if(codeIns== "ADAI" || codeIns== "SBAI" ||  codeIns== "LOADI"){
  main.ACC.setContenu(this.operation(codeIns,main.ACC.getContenu(),instrTab[cpt+1].getVal())) ; 
      return cpt +2 ;
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
    else if((modeAdr == "11") && dest == "0" ) {
      this.immDirectIndexeLongNonDest(codeIns,param1,dataTab,instrTab,cpt) 
      return cpt+main.Nbinst ; 
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
      this.directIndexeLongDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
   }else{
    this.directIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
   }
   return cpt+main.Nbinst ; 
    
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

    // Mode direct format Long destination =0 
    directLong = function(code,param1,param2,dataTab,instrTab,cpt,dest) {
      let n = 0;
      let m = 0;
      let i = util.chercherAdr(dataTab,(instrTab[cpt+1].getVal()).slice(-3)) ;
      if(i==dataTab.length) {dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(1),"0000",""));} 
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
          //  console.log("mmm = "+dataTab[i].getVal()+"      "+m);
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
        i = util.chercherAdr(dataTab,(main.BX.getContenu()).slice(-3)) ; 
        if(i==dataTab.length) {dataTab.push(new CaseMc((main.BX.getContenu()).slice(1),"0000",""));}
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
      
      case "110":
        i = util.chercherAdr(dataTab,(main.SI.getContenu()).slice(-3)) ;
        if(i==dataTab.length) {dataTab.push(new CaseMc((main.SI.getContenu()).slice(1),"0000",""));}
        main.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
      case "111":
        i = util.chercherAdr(dataTab,(main.DI.getContenu()).slice(-3)) ;
        if(i==dataTab.length) {dataTab.push(new CaseMc((main.DI.getContenu()).slice(1),"0000",""));}
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
          i = util.chercherAdr(dataTab,(main.BX.getContenu()).slice(-3)) ;
          if(i==dataTab.length) {dataTab.push(new CaseMc((main.BX.getContenu()).slice(1),"0000",""));}
          m = (dataTab[i].getVal()).slice(1)  
          break;
        
        case "110":
          i = util.chercherAdr(dataTab,(main.SI.getContenu()).slice(-3)) ;
          if(i==dataTab.length) {dataTab.push(new CaseMc((main.SI.getContenu()).slice(1),"0000",""));}
          m = (dataTab[i].getVal()).slice(1) 
          break;
        case "111":
          i = util.chercherAdr(dataTab,(main.DI.getContenu()).slice(-3)) ;
          if(i==dataTab.length) {dataTab.push(new CaseMc((main.DI.getContenu()).slice(1),"0000",""));}
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
      if(i==main.dataTab.length) {main.dataTab.push(new CaseMc((util.remplirZero(m,3,0)).slice(-3),"0000",""));}
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
      if(i==dataTab.length) {dataTab.push(new CaseMc((util.remplirZero(m,3,0)).slice(-3),"0000",""));}
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
      let m=0 ; 
      if(main.Nbinst == 3) {
       m = instrTab[cpt+1].getVal() ; } else m=0 ;
       
      let n=0 ;
      
      switch (param2) {
        case "001": main.ACC.setContenu(main.BX.getContenu()); m=util.additionHexa(m.toString(16),main.BX.getContenu()) ; main.ACC.setContenu(m);  break;
        case "110": main.ACC.setContenu(main.SI.getContenu()); m=util.additionHexa(m.toString(16),main.SI.getContenu()) ; main.ACC.setContenu(m);  break;
        case "111": main.ACC.setContenu(main.DI.getContenu()); m=util.additionHexa(m.toString(16),main.DI.getContenu()) ; main.ACC.setContenu(m);  break;
      }
      
      let adretiq =0 ; 
      if(main.Nbinst== 3) {
      adretiq = instrTab[cpt+2].getVal() ; } else adretiq = instrTab[cpt+1].getVal() ;
      let i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      i = parseInt(dataTab[i].getAdr(), 16) + parseInt(m, 16);   
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
      let n=0 ; 
      if(main.Nbinst == 3) {
        n = instrTab[cpt+1].getVal() ; } else n=0 ;
  
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
      
      let adretiq =0 ; 
      if(main.Nbinst == 3) {
      adretiq = instrTab[cpt+2].getVal() ; } else adretiq = instrTab[cpt+1].getVal() ;
      i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      i = parseInt(dataTab[i].getAdr(), 16) + parseInt(m, 16);  
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
      if(i==main.dataTab.length) {main.dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(-3),"0000",""));}
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
          if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.BX.getContenu().slice(-3),"0000",""));}
           m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
           m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.getDataTab()[i].setVal(m);
         break;
        case "110": 
        i = util.chercherAdr(main.getDataTab(),main.SI.getContenu().slice(1)) ;
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.SI.getContenu().slice(-3),"0000",""));}
        m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
        m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.getDataTab()[i].setVal(m);
        break ; 
        case "111": i = util.chercherAdr(main.getDataTab(),main.DI.getContenu().slice(1)) ;
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.DI.getContenu().slice(-3),"0000",""));}
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
          if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(util.remplirZero(m,3,0).slice(-3),"0000",""));}
           m=main.dataTab[i].getVal() ; main.ACC.setContenu(m); 
           m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.dataTab[i].setVal(m);
         break;
        case "110": 
        main.ACC.setContenu(main.SI.getContenu().slice(1));
        m = util.additionHexa(main.SI.getContenu().slice(1),instrTab[cpt+1].getVal()) ; main.ACC.setContenu(m);
        i = util.chercherAdr(main.dataTab,util.remplirZero(m,3,0)) ;
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(util.remplirZero(m,3,0).slice(-3),"0000",""));}
         m=main.dataTab[i].getVal() ; main.ACC.setContenu(m);
         m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.dataTab[i].setVal(m);
        break ; 
        case "111": main.ACC.setContenu(main.DI.getContenu().slice(1));
        m = util.additionHexa(main.DI.getContenu().slice(1),instrTab[cpt+1].getVal()) ; main.ACC.setContenu(m);
        i = util.chercherAdr(main.dataTab,util.remplirZero(m,3,0)) ;
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(util.remplirZero(m,3,0).slice(-3),"0000",""));}
         m=main.dataTab[i].getVal() ; main.ACC.setContenu(m); 
         m=this.operation(code,m,n) ; main.ACC.setContenu(m); main.dataTab[i].setVal(m);
      } 
    }  // Fin Mode immediate BaseIndexe  format Long  distination =0 


    immDirectIndexeLongNonDest = function(code,param1,dataTab,instrTab,cpt) {

       let m=0 ; 
      if(main.Nbinst== 4) {
       m = instrTab[cpt+1].getVal() ; } else m=0 ;
      
      let n=0 ;
      
      switch (param1) {
        case "001": main.ACC.setContenu(main.BX.getContenu()); m=util.additionHexa(m.toString(16),main.BX.getContenu()) ; main.ACC.setContenu(m);  break;
        case "110": main.ACC.setContenu(main.SI.getContenu()); m=util.additionHexa(m.toString(16),main.SI.getContenu()) ; main.ACC.setContenu(m);  break;
        case "111": main.ACC.setContenu(main.DI.getContenu()); m=util.additionHexa(m.toString(16),main.DI.getContenu()) ; main.ACC.setContenu(m);  break;
      }
      
      
      let adretiq ; 
      if(main.Nbinst== 4) {
        adretiq = instrTab[cpt+2].getVal() ; } else adretiq = instrTab[cpt+1].getVal() ;
      let i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      i = parseInt(dataTab[i].getAdr(), 16) + parseInt(m, 16);   
      m=dataTab[i].getVal() ;  
      if(main.nbMot[main.Nbinst][1] == 4) {
        n= instrTab[cpt+3].getVal() ;  } else n= instrTab[cpt+2].getVal() ; 
      main.ACC.setContenu(this.operation(code,m,n))
      dataTab[i].setVal(main.ACC.getContenu()) ; 
    } 

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
      if(i==dataTab.length) {dataTab.push(new CaseMc(n.slice(-3),"0000",""));}
      n=dataTab[i].getVal() ; 
       main.ACC.setContenu(this.operation(code,main.ACC.getContenu(),n)); 

    } //  FIN Mode immediate AccDirect  format Long 
    

    LoadinDirectCourt = function(param1) {
      let i=0 ; let m=0 ; 
      switch (param1) {
        case "001":
          i = util.chercherAdr(main.getDataTab(),main.BX.getContenu().slice(1)) ;
          if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.BX.getContenu().slice(-3),"0000",""));}
           m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
         break;
        case "110": 
        i = util.chercherAdr(main.getDataTab(),main.SI.getContenu().slice(1)) ;
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.SI.getContenu().slice(-3),"0000",""));}
        m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
        break ; 
        case "111": i = util.chercherAdr(main.getDataTab(),main.DI.getContenu().slice(1)) ;
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.DI.getContenu().slice(-3),"0000",""));}
        m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m);  break ; 
      } 

    }

    LoadDirectIndexe = function(param1,dataTab,instrTab,cpt) {
      let n=0 ; 
     
      if(main.Nbinst == 3) {
       n = main.instrTab[cpt+1].getVal() ; } else n=0 ;
  
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
      
      let adretiq=0 ; 
      if(main.Nbinst == 3) {
        adretiq = instrTab[cpt+2].getVal() ; } else adretiq = instrTab[cpt+1].getVal() ;
       
      i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      
      i = parseInt(dataTab[i].getAdr(), 16) + parseInt(m, 16) ;   
   
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
   //   console.log(main.getIndicateurRetenue());
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
    case "JE": if(main.getIndicateurZero() == "1" )  {return i ;} else return cpt+2 ; 
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
        if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.BX.getContenu().slice(-3),"0000",""));}
         m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
       break;
      case "110": 
      i = util.chercherAdr(main.getDataTab(),main.SI.getContenu().slice(1)) ;
      if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.SI.getContenu().slice(-3),"0000",""));}
      m=main.getDataTab()[i].getVal() ; main.ACC.setContenu(m); 
      break ; 
      case "111": i = util.chercherAdr(main.getDataTab(),main.DI.getContenu().slice(1)) ;
      if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(main.DI.getContenu().slice(-3),"0000",""));}
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
    if(i==main.dataTab.length) {main.dataTab.push(new CaseMc(i,"0000",""));}
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
        util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndSigneAddition(n,m) ; 
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
        util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndSigneAddition(n,m) ; 
        break;
        case "ADAI": res=util.remplirZero(util.additionHexa(n,m),4,0); 
        util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndSigneAddition(n,m) ; 
        break;
        case "ADA": res=util.remplirZero(util.additionHexa(n,m),4,0) ;  
        util.setIndDebordAddition(n,m) ; util.setIndRetenueAddition(n,m) ; util.setIndZeroAddition(n,m) ; util.setIndSigneAddition(n,m) ; 
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



// Le main qui est dans execute 
export var main = {
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
        let tab = codingExecute.coderInst(ligne_str, co, this.getDataTab());
          main.nbMot.push([main.instrTab.length,tab.length]) ;
          main.instrTab=main.getinstrTab().concat(tab) ;
          co = util.incrementHex(co, tab.length);
      } else if (ligne_str[0] == "START") {
      }else if (ligne_str[0] == "SETZ") {
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
       
      } else {
        let tab = codingExecute.coderInst(ligne_str, co, this.getDataTab());
        main.nbMot.push([main.instrTab.length,tab.length]) ; //+co
        main.instrTab=main.getinstrTab().concat(tab) ;
        co = util.incrementHex(co, tab.length);
      } 
    }
   }


/*messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***  Data Segment *** </span></p>";
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
    messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";*/

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
    console.log("DECODAGE");
    decodage.fonctionDecodage() ; 
    console.log("********************** ");
   /* this.Execute(main.getinstrTab());

    main.afficherRegistres() ;
    main.afficherRegistresHTML();

    main.afficherIndicateurs() ;
    main.afficherIndicateursHTML(); */

    console.log("*** LES DONNEES **** ");
    messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***   LES DONNEES *** </span></p>";

    for (let i = 0; i < this.getDataTab().length; i++){
      this.getDataTab()[i].afficher();
      this.getDataTab()[i].afficherHTML();}

    console.log("********************** ");
    messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";
    console.log(""); 


  },

   Execute:  function (instrTab) {
    let j = 0 ;
    let i = 0 ;
    this.Nbinst=0 ;
    while (j < instrTab.length ) {
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
            case "101000": //START
            j++ ; break ;
            case "101010": //ORG
            j=j+2 ; break ;
            case "011111": //SET
            j=j+2 ; break ;
            case "101001": //SETZ
            j=j+2 ; break ;
            case "011100": 
            //saisie.style.display = "block";
          var x = prompt();
          main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[j+1].getVal().slice(1))].setVal(x) ;
         /*   valider.addEventListener("click", function() {
              // Fermer la boîte de saisie
              console.log("Nom entré :", nom.value);
              nom.value ="";
              // Continuer l'exécution du programme ici
              console.log("Suite du programme...");
              main.dataTab[util.chercherAdr(main.dataTab,main.instrTab[1].getVal().slice(1))].setVal(nom.value) ;
              // Autres instructions...
              saisie.style.display = "none";
              b=true;
            });*/
          
        
            j=j+2;
             break ;
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


//________________________________________ End of functions of Execute  _________________________________________________









//__________________________________________ Needed Functions in simulation __________________________________________

export var coding = {
  // debut coderInst "codage des instructions " return tableau des mots memoir apres codage de l'instruction 
  coderInst: function (strLigne, adr, dataTab) 
  {
    
    let str = "";
    let instrTab = new Array();
    if (strLigne[0][strLigne[0].length - 1] == ":") {
      if(main.tabEtiq.length > 0) {
        let indice  = util.chercherDansTableau2(main.tabEtiq,strLigne[0].slice(0,strLigne[0].length-1),adr) ; 
      /*  console.log(strLigne[0].slice(0,strLigne[0].length-1));
        console.log(main.tabEtiq.length);
        if(indice<main.tabEtiq.length){
          let adresse = main.tabEtiq[indice].getAdr();
          let indice2 = util.chercherAdr(main.instrTab,adresse)
          main.instrTab[indice2].setVal(util.remplirZero(adr,4,0)) ;
          
        }*/
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
        let regEtDepl = strLigne[1].slice(1, strLigne[1].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
            else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr, depl.toString(16), ""));
        adr = util.incrementHex(adr, 1);
          instrTab.push(
            new CaseMc(adr, strLigne[2].slice(0, strLigne[2].length - 1), "")
          );
      }
      else if(coding.modeAdr(strLigne) == "11" && coding.getDest(strLigne) == "0") {
        let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
        else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        if(strLigne[1].indexOf("+") != -1){
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr, depl.toString(16), ""));}
        let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
         adr = util.incrementHex(adr, 1);
         instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
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
    
      let regEtDepl = strLigne[2].slice(strLigne[2].indexOf("[")+1, strLigne[2].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
        else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        if(strLigne[2].indexOf("+") != -1){
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));}
        let indice = util.chercherDansTableau(dataTab, strLigne[2].slice(0,strLigne[2].indexOf("[")));
        adr = util.incrementHex(adr, 1);
        instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));
     }else {

        let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
        let depl = "";
        if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
        else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
        if(strLigne[1].indexOf("+") != -1){
          adr = util.incrementHex(adr, 1);
          instrTab.push(new CaseMc(adr, depl.toString(16), ""));}
        let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
         adr = util.incrementHex(adr, 1);
         instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));

     }
        
  }}

for (let j=0; j<instrTab.length;j++){ instrTab[j].setVal(util.remplirZero(instrTab[j].getVal(),4,0)) }  
return instrTab;
    } else if(strLigne.length == 2) {
      if ((strLigne[0])[0] == "J"){
         adr = util.incrementHex(adr, 1);
           let indice = util.chercherDansTableau(main.instrTab,strLigne[1]) ; 
      //     console.log(strLigne[1]);
           if(indice<(main.instrTab).length){
             instrTab.push(new CaseMc(adr,util.remplirZero(main.instrTab[indice].getAdr(),3,0),""));
           }else{
             instrTab.push(new CaseMc(adr,"","")) ; 
             main.tabEtiq.push(new CaseMc(adr,"",strLigne[1])) ; 
           }
      }
      else if(this.getFormat(strLigne) == "1" ) {
        if(strLigne[0][strLigne[0].length - 1].toUpperCase() != "I"){
        if (strLigne[1].indexOf("[") != -1 ) {
          if(strLigne[1][0] != "[") {
            let regEtDepl = strLigne[1].slice(strLigne[1].indexOf("[")+1, strLigne[1].length - 1) ;
             let depl = "";
            if (this.regexi(regEtDepl.substring(0,2))){ depl = regEtDepl.substring(regEtDepl.lastIndexOf("+") + 1);}
             else {depl = regEtDepl.substring(0, regEtDepl.length -3);}
             if(strLigne[1].indexOf("+") != -1){
              adr = util.incrementHex(adr, 1);
              instrTab.push(new CaseMc(adr, depl.toString(16), ""));}
              let indice = util.chercherDansTableau(dataTab, strLigne[1].slice(0,strLigne[1].indexOf("[")));
            adr = util.incrementHex(adr, 1);
            instrTab.push(new CaseMc(adr,dataTab[indice].getAdr(), ""));

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
      if(str[0] == "STOP") {
        code = this.getCop(str[0]).concat("0000000000");
      }
      else if (str.length == 3) {
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
          else {
            if(str[1][0] != "[" && (str[1].indexOf("[") != -1 )) {
              let reg = str[1].slice(str[1].indexOf("[")+1,str[1].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),this.getReg(reg));
            }
            else code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[2]),"000");}
        }
        else if(this.regexi(str[1]) && !this.regexi(str[2]))
        {
          if(this.regexi(str[2].slice(1,str[2].length-1))) 
          {code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(str[2].slice(1,str[2].length-1)));
          }
          
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
          else {
            if(str[2][0] != "[" && (str[2].indexOf("[") != -1 )) {
              let reg = str[2].slice(str[2].indexOf("[")+1,str[2].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),this.getReg(reg));
            }
            else code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1]),"000");} 
    
        }
        else{
          if((str[1].indexOf("+") == -1)&&(str[2].indexOf("+") == -1)) {
             if((str[1].indexOf("[") != -1 ) && str[1][0] != "[" ){
              let reg = str[1].slice(str[1].indexOf("[")+1,str[1].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
            }
         else  code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(str[1].slice(1,str[1].length-1)),"000");
        }
          
            else if ((str[1].indexOf("[") != -1 ) && (str[1].indexOf("+") != -1)) {
              let modeAdr= this.modeAdr(str) ; 
              if(str[1][0] != "["){
                   let regEtDepl = (str[1].slice(str[1].indexOf("["),str[1].length)).slice(1, str[1].length - 1) ;
                   let reg = "" ;
                   if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
                   else {reg = regEtDepl.slice(-2);}
                   code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
              } 
              else{
              let regEtDepl = str[1].slice(1, str[1].length - 1) ;
              let reg = "" ;
              if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2);}
              else {reg = regEtDepl.slice(-2);}
              code = this.getCop(str[0]).concat(modeAdr,this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
            }
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
          if(str[1].indexOf("+") != -1) {
          let reg = "";
          let regEtDepl = (str[1].slice(str[1].indexOf("["),str[1].length)) .slice(1, str[1].length - 1) ;
          if (this.regexi(regEtDepl.substring(0,2))){ reg = regEtDepl.substring(0,2); }
          else {reg = regEtDepl.slice(-2);}
          code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
          }
          else {
            let reg = str[1].slice(str[1].indexOf("[")+1,str[1].length-1);
              code = this.getCop(str[0]).concat(this.modeAdr(str),this.getFormat(str),this.getDest(str),this.getReg(reg),"000");
          }
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


class UALsimulation {
  #eUal1;
  #eUal2;
  constructor(eUal1, eUal2) {
    this.#eUal1 = eUal1;
    this.#eUal2 = eUal2;
  }
  
  opeRation = function (codeIns,dataTab,indicateurTab,instrTab,modeAdr,cpt, dest, format, param1, param2,delay) {
    //addition registre registre et le resultat sera dans reg1 000000 00 0 1 REG1   REG2
    let somme = 0;
    let n = 0;
    let m = 0;
    let i=0 ; 
    let tab=[];
    let d=0;
    if(codeIns[0]== "J") {
      return {p1: this.jmp(codeIns,indicateurTab,cpt,delay),p2: delay}  ; 
    }
    else if(codeIns == "STORE") {
      this.store(cpt) ; 
     }
    else if(codeIns== "CMP") {
      if ((modeAdr == "00") && dest == "1" && format == "0") {
        delay+=3000;
        d= this.cmpDirect(codeIns,param1,param2,delay); 
       delay=d+3000;
        return {p1: cpt+1 ,p2: delay};}
      if ((modeAdr == "01") && dest == "1" && format == "0") {
        delay+=3000;
         d =this.cmpIndiret(codeIns,param1,param2); 
        delay = d+3000;
        return {p1: cpt+1,p2: delay };}

    }
    else if(codeIns== "CMPI") {
      if ((modeAdr == "00") && dest == "1" && format == "1") {
        delay+=3000;
         d= this.cmpImm(codeIns,param1,instrTab,cpt); 
        delay=d+3000;
        return {p1: cpt+2,p2: delay };}
    }
    else if(codeIns== "SHR" || codeIns== "SHL" || codeIns== "ROR" || codeIns== "ROL" ) {
      delay+=3000;
      d= this.decalageRotationLogique(codeIns,param1,instrTab,cpt) ; 
     delay=d+3000;
      return {p1: cpt+2,p2: delay }; 
    }
    else if(codeIns== "ADA" || codeIns== "SBA" || codeIns== "LOAD") {
      if((modeAdr == "00") && dest == "1" && format == "0" ){
        delay+=3000;
        let d =this.immediaAccDirectCourt(codeIns,param1) ; 
        delay=d+3000;
        return {p1: cpt+1,p2: delay };
  
      }
      else if((modeAdr == "00") && dest == "0" && format == "1"){
        this.immediaAccDirectLong(codeIns,dataTab,instrTab,cpt) ; 
        return {p1: cpt+2,p2: delay };
      }else if((modeAdr == "01") && dest == "0" && format == "0"){
        this.LoadinDirectCourt(param1) ; 
        return {p1: cpt+2,p2: delay };
      }
      else if((modeAdr == "11") && dest == "0" && format == "1")
      this.LoadDirectIndexe(param1,dataTab,instrTab,cpt) 
      return {p1: cpt+3,p2: delay };
    }
    else if(codeIns== "ADAI" || codeIns== "SBAI" ||  codeIns== "LOADI"){
  mainsimulation.ACC.setContenu(this.operation(codeIns,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal())) ; 

    }
    else if(codeIns[codeIns.length-1] == "I"  || codeIns=="INC" || codeIns=="DEC" ){
    if((modeAdr == "00") && dest == "1"  ){
      if(codeIns=="INC" || codeIns=="DEC") {
        this.immediaDirectLongDest(codeIns,param1,instrTab,cpt) ; 
        return {p1: cpt+1,p2: delay };}
      else{ 
        this.immediaDirectLongDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt)
        return {p1: cpt+2,p2: delay };}

    }
    else if((modeAdr == "00") && dest == "0" ){
      this.immediaDirectLongNonDest(codeIns.slice(0,codeIns.length-1),instrTab,cpt)
      return {p1: cpt+3,p2: delay }; 
    }
    else if((modeAdr == "01") && dest == "0" ) {
      this.immediaInDirectLongNonDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt) ; 
      return {p1: cpt+2,p2: delay };
    }
    else if((modeAdr == "10") && dest == "0" ) {
      this.immediaBaseIndexeLongNonDest(codeIns.slice(0,codeIns.length-1),param1,instrTab,cpt) ; 
      return {p1: cpt+3,p2: delay }; 
    }
    }
    else if ((modeAdr == "00") && dest == "1" && format == "0") {
      delay+=3000;
       d=  this.directCourtDist(codeIns,param1,param2,delay) ; 
      delay =  d+3000;          
      return { p1: cpt+1 ,p2: delay};

    } 
    else if (modeAdr == "00" && format == "1") {
      delay+=3000;
            d = this.directLong(codeIns,param1,param2,dataTab,instrTab,cpt,dest,delay) ; 
           delay =  d+3000; 
           return {p1: cpt+2,p2: delay };

    }
     else if(modeAdr == "01" && format == "0") { 
          if(dest == "0") {
           this.indirectCourtNonDest(codeIns,param1,param2,dataTab) ; 
        }

        else {
        this.indirectCourtDest(codeIns,param1,param2,dataTab) ; 
        }
        return {p1: cpt+1,p2: delay };
    
    }
    else if(modeAdr == "10" && format == "1"){
    if(dest == "1") {
      this.BaseIndexeLongDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
   }else{
    this.BaseIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ;
   }
   return {p1: cpt+2,p2: delay };
  } else if(modeAdr == "11" && format == "1") {
    if(dest == "1") {
      this.directIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
   }else{
    this.directIndexeLongNonDest(codeIns,param1,param2,dataTab,instrTab,cpt) ; 
   }
   return {p1: cpt+3,p2: delay };
    
  }
          
  }; 

  
  // Mode direct format court distination =1 
  directCourtDist = function(code,param1,param2,delay) {     // F=0 , D=1(reg 1 destination)
    let n = 0;
    let m = 0;
    let i=0 ; 
    switch (param2) {
        case "000":  m = mainsimulation.AX.getContenu(); break;
        case "001":  m = mainsimulation.BX.getContenu(); break;
        case "010":  m = mainsimulation.CX.getContenu(); break;
        case "011":  m = mainsimulation.DX.getContenu(); break;
        case "100":  m = mainsimulation.EX.getContenu(); break;
        case "101":  m = mainsimulation.FX.getContenu(); break;
        case "110":  m = mainsimulation.SI.getContenu(); break;
        case "111":  m = mainsimulation.DI.getContenu(); break;
      }
      selectElement(dataREG1el,delay,0);
      delay+=3000; 
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      switch (param1) {
        case "000":
          n = mainsimulation.AX.getContenu();
          selectElement(ax,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(ax,delay,mainsimulation.ACC.getContenu());
          mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "001":
          n = mainsimulation.BX.getContenu();
          selectElement(bx,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(bx,delay,mainsimulation.ACC.getContenu());
          mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "010":
          n = mainsimulation.CX.getContenu();
          selectElement(cx,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(cx,delay,mainsimulation.ACC.getContenu());
          mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "011":
          n = mainsimulation.DX.getContenu();
          selectElement(dx,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dx,delay,mainsimulation.ACC.getContenu());
          mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "100":
          n = mainsimulation.EX.getContenu();
          selectElement(ex,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(ex,delay,mainsimulation.ACC.getContenu());
          mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "101":
          n = mainsimulation.FX.getContenu();
          selectElement(fx,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(fx,delay,mainsimulation.ACC.getContenu());
          mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "110":
          n = mainsimulation.SI.getContenu();
          selectElement(si,delay,n);
          delay+=2000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(dataEUAL2el,delay,0);
          delay+=3000;
          selectElement(ual2,delay,n);
          delay+=3000;
          selectElement(acc,delay,n);          //chargement vers l'acc
          mainsimulation.ACC.setContenu(n);
          this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
          selectElement(dataREG2el,delay,0);
          delay+=3000;
          selectElement(dataC1el,delay,0);
          delay+=3000;
          selectElement(dataC2el,delay,0);
          delay+=3000;
          selectElement(dataC3el,delay,0);
          delay+=3000;
          switch (param2) {             // on récoupère le contenu de deuxième registre
              case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
              case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
              case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
              case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
              case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
              case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
              case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
              case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
            }
            selectElement(dataREGel,delay,0);
            delay+=3000;
            selectElement(dataEUAL2el,delay,0);
            delay+=3000;
            selectElement(ual2,delay,m);
            delay+=3000;
            selectElement(acc,delay,m);
            delay+=3000;
            selectElement(dataC5el,delay,0);
            delay+=3000;
            selectElement(dataC4el,delay,0);
            delay+=3000;
            selectElement(dataEUAL1el,delay,0);
            delay+=3000;
            selectElement(ual1,delay,m);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
        //  selectElement(instname,delay,code);
          selectElement(acc,delay,mainsimulation.ACC.getContenu());
          delay+=3000;
          selectElement(dataC5el,delay,0);
          delay+=3000;
          selectElement(dataC4el,delay,0);
          delay+=3000;
          selectElement(dataREGel,delay,0);
          delay+=3000;
          selectElement(si,delay,mainsimulation.ACC.getContenu());
          mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());
         break;
         case "111": 
         n = mainsimulation.DI.getContenu();
         selectElement(di,delay,n);
         delay+=2000;
         selectElement(dataREGel,delay,0);
         delay+=3000;
         selectElement(dataEUAL2el,delay,0);
         delay+=3000;
         selectElement(ual2,delay,n);
         delay+=3000;
         selectElement(acc,delay,n);          //chargement vers l'acc
         mainsimulation.ACC.setContenu(n);
         this.mettreAjourIndicateur(mainsimulation.ACC.getContenu()) ;
         selectElement(dataREG2el,delay,0);
         delay+=3000;
         selectElement(dataC1el,delay,0);
         delay+=3000;
         selectElement(dataC2el,delay,0);
         delay+=3000;
         selectElement(dataC3el,delay,0);
         delay+=3000;
         switch (param2) {             // on récoupère le contenu de deuxième registre
             case "000":  m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m); break;
             case "001":  m = mainsimulation.BX.getContenu();selectElement(bx,delay,m); break;
             case "010":  m = mainsimulation.CX.getContenu();selectElement(cx,delay,m); break;
             case "011":  m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);break;
             case "100":  m = mainsimulation.EX.getContenu();selectElement(ex,delay,m); break;
             case "101":  m = mainsimulation.FX.getContenu();selectElement(fx,delay,m); break;
             case "110":  m = mainsimulation.SI.getContenu();selectElement(si,delay,m); break;
             case "111":  m = mainsimulation.DI.getContenu(); selectElement(di,delay,m); break;
           }
           selectElement(dataREGel,delay,0);
           delay+=3000;
           selectElement(dataEUAL2el,delay,0);
           delay+=3000;
           selectElement(ual2,delay,m);
           delay+=3000;
           selectElement(acc,delay,m);
           delay+=3000;
           selectElement(dataC5el,delay,0);
           delay+=3000;
           selectElement(dataC4el,delay,0);
           delay+=3000;
           selectElement(dataEUAL1el,delay,0);
           delay+=3000;
           selectElement(ual1,delay,m);
         mainsimulation.ACC.setContenu(this.operation(code,n,m));
       //  selectElement(instname,delay,code);
         selectElement(acc,delay,mainsimulation.ACC.getContenu());
         delay+=3000;
         selectElement(dataC5el,delay,0);
         delay+=3000;
         selectElement(dataC4el,delay,0);
         delay+=3000;
         selectElement(dataREGel,delay,0);
         delay+=3000;
         selectElement(di,delay,mainsimulation.ACC.getContenu());
         mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());
         break; 
      }
        return delay;

    } // Finnnn Mode direct format court(f=0) distination =1 

    // Mode direct format Long distination =0 
    directLong = function(code,param1,param2,dataTab,instrTab,cpt,dest,delay) { 
      let n = 0;
      let m = 0;
      let i = util.chercherAdr(dataTab,(instrTab[cpt+1].getVal()).slice(1)) ;
             if(i==dataTab.length) {dataTab.push(new CaseMc((instrTab[cpt+1].getVal()).slice(1),0,"")); }

       m = dataTab[i].getVal() ;              // la valeur de la donnée 
       let adr = dataTab[i].getAdr();          // l'adr de la donnée dans le segment de données 
            
        

           if(dest == "0"){
            switch (param1) {
              case "000": m = mainsimulation.AX.getContenu(); selectElement(ax,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "001": m = mainsimulation.BX.getContenu(); selectElement(bx,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "010": m = mainsimulation.CX.getContenu(); selectElement(cx,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "011": m = mainsimulation.DX.getContenu(); selectElement(dx,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "100": m = mainsimulation.EX.getContenu(); selectElement(ex,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "101": m = mainsimulation.FX.getContenu(); selectElement(fx,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "110": m = mainsimulation.SI.getContenu(); selectElement(si,delay,m);  mainsimulation.ACC.setContenu(m); break;
              case "111": m = mainsimulation.DI.getContenu(); selectElement(di,delay,m);  mainsimulation.ACC.setContenu(m); break;
            }
            delay+=3000;
            delay = premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
            delay+=3000;
            delay= lecturememoire(instrTab[i].getVal(),delay,dataTab[i].getVal());
            delay+=3000;
            if(code=="MOV"){
              delay= ecriturememoiremov(dataTab[i].getAdr(),delay,m);
            }
            else{
              delay+=3000;
              selectElement(dataREGel,delay,0);
              delay+=3000;
              selectElement(dataDATAel,delay,0);
              delay+=3000;
              selectElement(dataEUAL2el,delay,0);
              delay+=3000;
              selectElement(ual2,delay,m);
              delay+=3000;
              selectElement(acc,delay,m);
              delay+=3000; 
              selectElement(dataRIMel,delay,0);
              delay+=3000;
              selectElement(dataDATAel,delay,0);
              delay+=3000;
              selectElement(dataEUAL2el,delay,0);
              delay+=3000;
              selectElement(ual2,delay,dataTab[i].getVal());
              delay+=3000;
              selectElement(dataC5el,delay,0);
              delay+=3000;
              selectElement(dataC4el,delay,0);
              delay+=3000;
              selectElement(dataACCel,delay,0);
              delay+=3000;
              selectElement(dataC6el,delay,0);
              delay+=3000;
              selectElement(ual1,delay,mainsimulation.ACC.getContenu());


              mainsimulation.ACC.setContenu(this.operation(code,dataTab[i].getVal(),m));
              delay+=3000;
              selectElement(acc,delay,mainsimulation.ACC.getContenu());
              delay+=3000;
              delay = ecriturememoire(dataTab[i].getAdr(),delay,mainsimulation.ACC.getContenu());

            }
            
            mainsimulation.ACC.setContenu(this.operation(code,dataTab[i].getVal(),m));
            dataTab[i].setVal(mainsimulation.ACC.getContenu()) ;
            
           } 
            else {    
                                // dest==1 (reg1 destination) 
              switch (param1) {
                case "000":
                  let dd; 
                  n = mainsimulation.AX.getContenu();
                  if(code=="MOV"){
                    selectElement(ax,delay,mainsimulation.AX.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
              dd= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=dd+3000;
              dd= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=dd+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(ax,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(ax,delay,mainsimulation.ACC.getContenu());
                }

                  break;

                case "001":
                  let ddd;
                  n = mainsimulation.BX.getContenu();
                  if(code=="MOV"){
                    selectElement(bx,delay,mainsimulation.BX.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
               ddd= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=ddd+3000;
              ddd =lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=ddd+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(bx,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(bx,delay,mainsimulation.ACC.getContenu());
                }
                  break;
                case "010":
                  n = mainsimulation.CX.getContenu();
                  if(code=="MOV"){
                    selectElement(cx,delay,mainsimulation.CX.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
              let d= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=d+3000;
              d= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=d+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(cx,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation. CX.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(cx,delay,mainsimulation.ACC.getContenu());
                }
                  
                  break;
                case "011":
                  n = mainsimulation.DX.getContenu();
                  if(code=="MOV"){
                    selectElement(dx,delay,mainsimulation.DX.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
               d= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=d+3000;
              d= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=d+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dx,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(dx,delay,mainsimulation.ACC.getContenu());
                }
                  
                  break;
                case "100":
                  n = mainsimulation.EX.getContenu();
                  if(code=="MOV"){
                    selectElement(ex,delay,mainsimulation.EX.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
               d= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=d+3000;
              d= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=d+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(ex,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(ex,delay,mainsimulation.ACC.getContenu());
                
                }
                  
                  break;
                case "101":
                  n = mainsimulation.FX.getContenu();
                  if(code=="MOV"){
                    selectElement(fx,delay,mainsimulation.AX.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
               d= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=d+3000;
              d= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=d+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(fx,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(fx,delay,mainsimulation.ACC.getContenu());
                
                }
                  
                  break;
                case "110":
                  n = mainsimulation.SI.getContenu();
                  if(code=="MOV"){
                    selectElement(si,delay,mainsimulation.SI.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
              d= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=d+3000;
              d= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=d+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(si,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(si,delay,mainsimulation.ACC.getContenu());
                }
                  
                  break;
                case "111":
                  n = mainsimulation.DI.getContenu();
                  if(code=="MOV"){
                    selectElement(di,delay,mainsimulation.DI.getContenu());
                    delay+=3000;
                  }
                  else{
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(dataEUAL2el,delay,0);
                  delay+=3000;
                  selectElement(ual2,delay,n);
                  delay+=3000;
                  selectElement(acc,delay,n);
                  delay+=3000;
                  }
              mainsimulation.ACC.setContenu(n);
              // on lit le mot memoire 
               d= premierePhase(instrTab[cpt+1].getAdr(),delay,dataTab[i].getAdr());
              delay=d+3000;
              d= lecturememoire(dataTab[i].getAdr(),delay,dataTab[i].getVal());
              delay=d+3000;
              //ff
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                if(code=="MOV"){
                  selectElement(dataREGel,delay,0);
                  delay+=3000;
                  selectElement(di,delay,dataTab[i].getVal());
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());


                }
                else {
                selectElement(ual2,delay,dataTab[i].getVal());
                delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataC6el,delay,0);
                delay+=3000;
                selectElement(ual1,delay,mainsimulation.ACC.getContenu());
               
                  mainsimulation.ACC.setContenu(this.operation(code,n,m));
                  delay+=3000;
                  selectElement(acc,delay,mainsimulation.ACC.getContenu());
                  delay+=3000;
                selectElement(dataC5el,delay,0);
                delay+=3000;
                selectElement(dataC4el,delay,0);
                delay+=3000;
                selectElement(dataACCel,delay,0);
                delay+=3000;
                selectElement(dataDATAel,delay,0);
                delay+=3000;
                selectElement(dataREGel,delay,0);
                delay+=3000;
                  mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());
                  selectElement(di,delay,mainsimulation.ACC.getContenu());
                }
                  
                  break;
              }
               
           }
       //    console.log("end instruct delay:"+delay);
           return delay; 
    }

    // Mode indirect format Court distination =0 
    indirectCourtNonDest = function(code,param1,param2,dataTab) {
      let m = 0 ; 
      let n = 0; 
      switch (param1) {
        case "000": m = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "001": m = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "010": m = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "011": m = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "100": m = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "101": m = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "110": m = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(m); break;
        case "111": m = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(m); break;

    }
    let i  ; 
    switch (param2) {
      case "001":
        i = util.chercherAdr(dataTab,(mainsimulation.BX.getContenu()).slice(1)) ; 
        mainsimulation.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
      
      case "110":
        i = util.chercherAdr(dataTab,(mainsimulation.SI.getContenu()).slice(1)) ;
        mainsimulation.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
      case "111":
        i = util.chercherAdr(dataTab,(mainsimulation.DI.getContenu()).slice(1)) ;
        mainsimulation.ACC.setContenu(this.operation(code,(dataTab[i].getVal()),m));
        break;
    }
    dataTab[i].setVal(mainsimulation.ACC.getContenu()) ; 
    } //Fin Mode indirect format Court distination =0 

    //Mode indirect format Court distination =1
    indirectCourtDest = function(code,param1,param2,dataTab) {
      let n=0 ; 
      let m=0 ; 
      let i=0 ; 
      switch (param2) {
        case "001":
          i = util.chercherAdr(dataTab,(mainsimulation.BX.getContenu()).slice(1)) ;
          m = (dataTab[i].getVal()).slice(1)  
          break;
        
        case "110":
          i = util.chercherAdr(dataTab,(mainsimulation.SI.getContenu()).slice(1)) ;
          m = (dataTab[i].getVal()).slice(1) 
          break;
        case "111":
          i = util.chercherAdr(dataTab,(mainsimulation.DI.getContenu()).slice(1)) ;
          m = (dataTab[i].getVal()).slice(1) 
          break;
      }

      switch (param1) {
        case "000":
          n = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "001":
          n = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "010":
          n = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "011":
          n = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "100":
          n = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "101":
          n = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "110":
          n = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "111":
          n = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());
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
          mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu());  m=util.additionHexa(n,mainsimulation.BX.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
        case "110":
          mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu());  m=util.additionHexa(n,mainsimulation.SI.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
        case "111":
          mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu());  m=util.additionHexa(n,mainsimulation.DI.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
      }
      
      i = util.chercherAdr(mainsimulation.getDataTab(),util.remplirZero(m,3,0)) ;
      m=mainsimulation.getDataTab()[i].getVal() ; 
      switch (param1) {
        case "000": n = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "001": n = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "010": n = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "011": n = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "100": n = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "101": n = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "110": n = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "111": n = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());
          break;
      }

    } // FinMode BaseIndexe format Long  distination =1
    //Mode BaseIndexe format Long  distination =0
    BaseIndexeLongNonDest = function(code,param1,param2,dataTab,instrTab,cpt) {
      let m = instrTab[cpt+1].getVal() ; 
      
      let n=0 ;
      
      switch (param2) {
        case "001": mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu()); m=util.additionHexa(m.toString(16),mainsimulation.BX.getContenu()) ; mainsimulation.ACC.setContenu(m);  break;
        case "110": mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu()); m=util.additionHexa(m.toString(16),mainsimulation.SI.getContenu()) ; mainsimulation.ACC.setContenu(m);  break;
        case "111": mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu()); m=util.additionHexa(m.toString(16),mainsimulation.DI.getContenu()) ; mainsimulation.ACC.setContenu(m);  break;
      }
      let i = util.chercherAdr(dataTab,util.remplirZero(m,3,0)) ;
      if(i==dataTab.length) {dataTab.push(new CaseMc((util.remplirZero(m,3,0)),0,"")); } 
      m=dataTab[i].getVal() ;  
      switch (param1) {
        case "000": n = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "001": n = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "010": n = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "011": n = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "100": n = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "101": n = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "110": n = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "111": n = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
      }
      dataTab[i].setVal(mainsimulation.ACC.getContenu()) ; 
    } // Fin Mode BaseIndexe format Long  distination =0
    // Mode direct indexe format Long  distination =0
    directIndexeLongNonDest = function(code,param1,param2,dataTab,instrTab,cpt) {
      let m = instrTab[cpt+1].getVal() ; 
      
      let n=0 ;
      
      switch (param2) {
        case "001": mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu()); m=util.additionHexa(m.toString(16),mainsimulation.BX.getContenu()) ; mainsimulation.ACC.setContenu(m);  break;
        case "110": mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu()); m=util.additionHexa(m.toString(16),mainsimulation.SI.getContenu()) ; mainsimulation.ACC.setContenu(m);  break;
        case "111": mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu()); m=util.additionHexa(m.toString(16),mainsimulation.DI.getContenu()) ; mainsimulation.ACC.setContenu(m);  break;
      }

      let adretiq = instrTab[cpt+2].getVal() ; 
      let i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      i = parseInt(dataTab[i].getVal(), 16) + parseInt(m, 16);   
      m=dataTab[i].getVal() ;  
      switch (param1) {
        case "000": n = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "001": n = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "010": n = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "011": n = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "100": n = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "101": n = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "110": n = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
        case "111": n = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(n); mainsimulation.ACC.setContenu(this.operation(code,m,n));
          break;
      }
      dataTab[i].setVal(mainsimulation.ACC.getContenu()) ; 
    } // FIN  Mode direct indexe format Long  distination =0

    // Mode direct indexe format Long  distination =1

    directIndexeLongDest = function(code,param1,param2,dataTab,instrTab,cpt) {
      let n = instrTab[cpt+1].getVal() ; 
      let m=0 ; 
      let i=0 ; 
      switch (param2) {
        case "001":
          mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu());  m=util.additionHexa(n,mainsimulation.BX.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
        case "110":
          mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu());  m=util.additionHexa(n,mainsimulation.SI.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
        case "111":
          mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu());  m=util.additionHexa(n,mainsimulation.DI.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
      }
      
      let adretiq = instrTab[cpt+2].getVal() ; 
      i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      i = parseInt(dataTab[i].getVal(), 16) + parseInt(m, 16);   
      m=dataTab[i].getVal() ;   
      switch (param1) {
        case "000": n = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "001": n = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "010": n = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "011": n = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "100": n = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "101": n = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "110": n = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "111": n = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());
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
          n = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "001":
          n = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "010":
          n = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "011":
          n = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "100":
          n = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "101":
          n = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "110":
          n = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu());
          break;
        case "111":
          n = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(n);
          mainsimulation.ACC.setContenu(this.operation(code,n,m));
          mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu());
          break;
      }
 

    }  //Mode immediate direct  format Long  distination =1
     //Mode immediate direct  format Long  distination =0
    immediaDirectLongNonDest = function(code,instrTab,cpt) {
      let m = instrTab[cpt+1].getVal() ;
      let i = util.chercherAdr(mainsimulation.getDataTab(),m.slice(1)) ;
      m=mainsimulation.getDataTab()[i].getVal() ;
      mainsimulation.ACC.setContenu(m);
      let n= instrTab[cpt+2].getVal() ; ; 
      mainsimulation.ACC.setContenu(this.operation(code,m,n)); 
      mainsimulation.getDataTab()[i].setVal(mainsimulation.ACC.getContenu()) ;
    }  // Fin Mode immediate direct  format Long  distination =0 

      //Mode immediate indirect  format Long  distination =0 
    immediaInDirectLongNonDest = function(code,param1,instrTab,cpt) {
      let n = instrTab[cpt+1].getVal() ;
      let i ; 
      let m=0 ; 
      switch (param1) {
        case "001":
          i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.BX.getContenu().slice(1)) ;
           m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
           m=this.operation(code,m,n) ; mainsimulation.ACC.setContenu(m); mainsimulation.getDataTab()[i].setVal(m);
         break;
        case "110": 
        i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.SI.getContenu().slice(1)) ;
        m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
        m=this.operation(code,m,n) ; mainsimulation.ACC.setContenu(m); mainsimulation.getDataTab()[i].setVal(m);
        break ; 
        case "111": i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.DI.getContenu().slice(1)) ;
        m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
        m=this.operation(code,m,n) ; mainsimulation.ACC.setContenu(m); mainsimulation.getDataTab()[i].setVal(m); break ; 
      } 
    } // FIN Mode immediate indirect  format Long  distination =0 

    //  Mode immediate BaseIndexe  format Long  distination =0 
    immediaBaseIndexeLongNonDest = function(code,param1,instrTab,cpt) {
      let m=0 ; 
      let i=0 ;
      let n=instrTab[cpt+2].getVal() ;
      switch (param1) {
        case "001": mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu().slice(1));
          m = util.additionHexa(mainsimulation.BX.getContenu().slice(1),instrTab[cpt+1].getVal()) ; mainsimulation.ACC.setContenu(m);
          i = util.chercherAdr(mainsimulation.dataTab,util.remplirZero(m,3,0)) ;
           m=mainsimulation.dataTab[i].getVal() ; mainsimulation.ACC.setContenu(m); 
           m=this.operation(code,m,n) ; mainsimulation.ACC.setContenu(m); mainsimulation.dataTab[i].setVal(m);
         break;
        case "110": 
        mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu().slice(1));
        m = util.additionHexa(mainsimulation.SI.getContenu().slice(1),instrTab[cpt+1].getVal()) ; mainsimulation.ACC.setContenu(m);
        i = util.chercherAdr(mainsimulation.dataTab,util.remplirZero(m,3,0)) ;
         m=mainsimulation.dataTab[i].getVal() ; mainsimulation.ACC.setContenu(m);
         m=this.operation(code,m,n) ; mainsimulation.ACC.setContenu(m); mainsimulation.dataTab[i].setVal(m);
        break ; 
        case "111": mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu().slice(1));
        m = util.additionHexa(mainsimulation.DI.getContenu().slice(1),instrTab[cpt+1].getVal()) ; mainsimulation.ACC.setContenu(m);
        i = util.chercherAdr(mainsimulation.dataTab,util.remplirZero(m,3,0)) ;
         m=mainsimulation.dataTab[i].getVal() ; mainsimulation.ACC.setContenu(m); 
         m=this.operation(code,m,n) ; mainsimulation.ACC.setContenu(m); mainsimulation.dataTab[i].setVal(m);
      } 
    }  // Fin Mode immediate BaseIndexe  format Long  distination =0 

    //  Mode immediate AccDirect  format COURT  
    immediaAccDirectCourt = function(code,param1) {
      switch (param1) {
        case "000": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.AX.getContenu()));
         break;
        case "001": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.BX.getContenu()));
         break;
         case "010": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.CX.getContenu()));
         break; 
         case "011": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.DX.getContenu()));
         break;
         case "100": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.EX.getContenu()));
         break;
         case "101": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.FX.getContenu()));
         break ; 
        case "110": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.SI.getContenu()));
        break;
        case "111": mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),mainsimulation.DI.getContenu()));
         break;
        
      } 
    } // FIN  Mode immediate AccDirect  format COURT  

    //  Mode immediate AccDirect  format Long  
    immediaAccDirectLong = function(code,dataTab,instrTab,cpt) {
      let n = instrTab[cpt+1].getVal() ;
      let i = util.chercherAdr(dataTab,n.slice(1)) ;
      n=dataTab[i].getVal() ; 
       mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),n)); 

    } //  FIN Mode immediate AccDirect  format Long 
    

    LoadinDirectCourt = function(param1) {
      let i=0 ; let m=0 ; 
      switch (param1) {
        case "001":
          i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.BX.getContenu().slice(1)) ;
           m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
         break;
        case "110": 
        i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.SI.getContenu().slice(1)) ;
        m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
        break ; 
        case "111": i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.DI.getContenu().slice(1)) ;
        m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m);  break ; 
      } 

    }

    LoadDirectIndexe = function(param1,dataTab,instrTab,cpt) {
      let n = instrTab[cpt+1].getVal() ; 
      let m=0 ; 
      let i=0 ; 
      switch (param1) {
        case "001":
          mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu());  m=util.additionHexa(n,mainsimulation.BX.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m);  break;
        case "110":
          mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu());  m=util.additionHexa(n,mainsimulation.SI.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
        case "111":
          mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu());  m=util.additionHexa(n,mainsimulation.DI.getContenu().slice(1)) ; mainsimulation.ACC.setContenu(m); break;
      }
      
      let adretiq = instrTab[cpt+2].getVal() ; 
      i = util.chercherAdr(dataTab,adretiq.slice(1)) ;
      i = parseInt(dataTab[i].getVal(), 16) + parseInt(m, 16) ;   
      m=dataTab[i].getVal() ;  
      mainsimulation.ACC.setContenu(m);
    }
    //  decalage / Rotation Logique
    decalageRotationLogique= function(code,param1,instrTab,cpt) {
      switch (param1) {
        case "000": mainsimulation.ACC.setContenu(mainsimulation.AX.getContenu()) ;
        mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
        mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu() ) ; 
        
         break;
        case "001": mainsimulation.ACC.setContenu(mainsimulation.BX.getContenu()) ; 
        mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
        mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu() ) ;
         break;
         case "010": mainsimulation.ACC.setContenu(mainsimulation.CX.getContenu()) ; 
         mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
         mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu() ) ;
         break; 
         case "011":mainsimulation.ACC.setContenu(mainsimulation.DX.getContenu()) ; 
         mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
         mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu() ) ;
         break;
         case "100": mainsimulation.ACC.setContenu(mainsimulation.EX.getContenu()) ; 
         mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
         mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu() ) ;
         break;
         case "101": mainsimulation.ACC.setContenu(mainsimulation.FX.getContenu()) ; 
         mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
         mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu() ) ;
         break ; 
        case "110": mainsimulation.ACC.setContenu(mainsimulation.SI.getContenu()) ; 
        mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
        mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu() ) ;
        break;
        case "111": mainsimulation.ACC.setContenu(mainsimulation.DI.getContenu()) ; 
        mainsimulation.ACC.setContenu(this.operation(code,mainsimulation.ACC.getContenu(),instrTab[cpt+1].getVal()));
        mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu() ) ;
         break;
        
      } 
      console.log(mainsimulation.getIndicateurRetenue());
    }   //  FIN decalage / Rotation Logique
     // JMP 
     jmp = function (code,indicateurTab,cpt,delay) {
      let i = mainsimulation.getinstrTab()[cpt+1].getVal() ; 
      i= util.chercherAdr(mainsimulation.getinstrTab(),i.slice(1)) ; 
    switch ( code.toUpperCase())  {
    case "JMP": return i;   
    case "JZ": if( mainsimulation.getIndicateurZero() == "1"){
        selectElement(indZ,delay,"1");
        return i; }
        else {return cpt+2 ; 
          
        }
    case "JNZ": if(mainsimulation.getIndicateurZero() != "1"){
      selectElement(indZ,delay,"0");
    return i; 
    }else return cpt+2 ;
    case "JC": if(mainsimulation.getIndicateurRetenue() == "1"){
      selectElement(indR,delay,"1");
    return i; 
    }else return cpt+2 ; 
    case "JNC": if(mainsimulation.getIndicateurRetenue() != "1") {
      selectElement(indR,delay,"0");
    return i; 
    }else return cpt+2 ; 

    case "JS": if(mainsimulation.getIndicateurSigne() == "1") {
      selectElement(indS,delay,"1");
      return i; 
    }else return cpt+2 ;
    case "JNS": if(mainsimulation.getIndicateurSigne() != "1") { 
      selectElement(indS,delay,"0");
      return i;
     } else return cpt+2 ;
    case "JO": if(mainsimulation.getIndicateurDebord() == "1") { 
      selectElement(indD,delay,"1");
      return i; 
    }else return cpt+2 ;
    case "JNO": if(mainsimulation.getIndicateurDebord() != "1"){
      selectElement(indD,delay,"0");
       return i ;} else return cpt+2 ;
    case "JE": if(mainsimulation.getIndicateurZero() == "1" )  {
      selectElement(indZ,delay,"1");
      return i ;} else return cpt+2 ; 
    case "JNE": if(mainsimulation.getIndicateurZero() != "1" ){ 
      selectElement(indZ,delay,"0");
      return i ;}
     else return cpt+2 ;  
  }
  return delay;
} //JMP 
   //  comparaison direct 
  cmpDirect = function (code,param1,param2,delay) {             
   let m=0 ;
   let n=0 ; 
   switch (param2) {                   // on récupère le premier paramètre et on le met dans l'acc 
    case "000":
      m = mainsimulation.AX.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(ax,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
    case "001":
      m = mainsimulation.BX.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(bx,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
    case "010":
      m = mainsimulation.CX.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(cx,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
    case "011":
      m = mainsimulation.DX.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(dx,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
    case "100":
      m = mainsimulation.EX.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(ex,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
    case "101":
      m = mainsimulation.FX.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(fx,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
    case "110":
     m = mainsimulation.SI.getContenu();
     selectElement(dataREG2el,delay,0);
     delay+=3000;
     selectElement(dataC1el,delay,0);
     delay+=3000;
     selectElement(dataC2el,delay,0);
     delay+=3000;
     selectElement(dataC3el,delay,0);
     delay+=3000;
     selectElement(si,delay,m);
     delay+=3000;
     selectElement(dataREGel,delay,0);
     delay+=3000;
     selectElement(dataDATAel,delay,0);
     delay+=3000;
     selectElement(dataEUAL1el,delay,0);
     delay+=3000;
     selectElement(ual2,delay,m);
     delay+=3000;
     selectElement(acc,delay,m);
       break;
      case "111":
      m = mainsimulation.DI.getContenu();
      selectElement(dataREG2el,delay,0);
      delay+=3000;
      selectElement(dataC1el,delay,0);
      delay+=3000;
      selectElement(dataC2el,delay,0);
      delay+=3000;
      selectElement(dataC3el,delay,0);
      delay+=3000;
      selectElement(di,delay,m);
      delay+=3000;
      selectElement(dataREGel,delay,0);
      delay+=3000;
      selectElement(dataDATAel,delay,0);
      delay+=3000;
      selectElement(dataEUAL1el,delay,0);
      delay+=3000;
      selectElement(ual2,delay,m);
      delay+=3000;
      selectElement(acc,delay,m);
      break;
  }
 
    switch (param1) {
      case "000":
        n = mainsimulation.AX.getContenu();  
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(ax,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "001":
        n = mainsimulation.BX.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(bx,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "010":
        n = mainsimulation.CX.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(cx,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "011":
        n = mainsimulation.DX.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(dx,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "100":
        n = mainsimulation.EX.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(ex,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "101":
        n = mainsimulation.FX.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(fx,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "110":
        n = mainsimulation.SI.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(si,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
      case "111":
        n = mainsimulation.DI.getContenu();
        selectElement(dataREG1el,delay,0);
        delay+=3000;
        selectElement(dataC1el,delay,0);
        delay+=3000;
        selectElement(dataC2el,delay,0);
        delay+=3000;
        selectElement(dataC3el,delay,0);
        delay+=3000;
        selectElement(di,delay,n);
        delay+=3000;
        mainsimulation.ACC.setContenu(n);
        selectElement(dataREGel,delay,0);
        delay+=3000;
        selectElement(dataDATAel,delay,0);
        delay+=3000;
        selectElement(dataEUAL1el,delay,0);
        delay+=3000;
        selectElement(ual2,delay,n);
        delay+=3000;
        selectElement(dataC5el,delay,0);
        delay+=3000;
        selectElement(dataC4el,delay,0);
        delay+=3000;
        selectElement(dataACCel,delay,0);
        delay+=3000;
        selectElement(dataC6el,delay,0);
        delay+=3000;
        selectElement(ual1,delay,n);
        // on fait l'op
        mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
        delay+=3000;
        selectElement(acc,delay,mainsimulation.ACC.getContenu());
        break;
    }
  delay+=3000;

   // console.log(n," ",m);
    if(util.compareHexValues(n,m)>0) { 
      mainsimulation.setIndicateurZero("0") ;
      selectElement(indZ,delay,"0");
       mainsimulation.setIndicateurSigne("0") ; 
       selectElement(indS,delay,"0");
       mainsimulation.setIndicateurRetenue("0") ;
       selectElement(indR,delay,"0");
    }else if(util.compareHexValues(n,m)<0) {
      mainsimulation.setIndicateurZero("0") ; 
      selectElement(indZ,delay,"0");
      mainsimulation.setIndicateurSigne("1") ; 
      selectElement(indS,delay,"1");
      mainsimulation.setIndicateurRetenue("0") ;
      selectElement(indR,delay,"0");
    }
    else { 
      mainsimulation.setIndicateurZero("1") ; 
      selectElement(indZ,delay,"1");
      mainsimulation.setIndicateurSigne("0") ; 
      selectElement(indS,delay,"0");
      mainsimulation.setIndicateurRetenue("0") ;
      selectElement(indR,delay,"0");
      mainsimulation.setIndicateurDebord("0"); 
      selectElement(indD,delay,"0");
    }

      return delay;
  }  // FIN   comparaison direct



  cmpIndiret = function (code,param1,param2) {
    let m=0 ;
     let i=0 ; 
     let n=0 ; 
    switch (param2) {
      case "001":
        i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.BX.getContenu().slice(1)) ;
         m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
       break;
      case "110": 
      i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.SI.getContenu().slice(1)) ;
      m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
      break ; 
      case "111": i = util.chercherAdr(mainsimulation.getDataTab(),mainsimulation.DI.getContenu().slice(1)) ;
      m=mainsimulation.getDataTab()[i].getVal() ; mainsimulation.ACC.setContenu(m); 
      break;
    } 

     switch (param1) {
       case "000":
         n = mainsimulation.AX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "001":
         n = mainsimulation.BX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "010":
         n = mainsimulation.CX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "011":
         n = mainsimulation.DX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         case "111":
         n = mainsimulation.DI.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m)); 
         break;
     }
     if(util.compareHexValues(n,m)>0) {
       mainsimulation.setIndicateurZero("0") ; mainsimulation.setIndicateurSigne("0") ; mainsimulation.setIndicateurRetenue("0") ;
     }else if(util.compareHexValues(n,m)<0) {
       mainsimulation.setIndicateurZero("0") ; mainsimulation.setIndicateurSigne("1") ; mainsimulation.setIndicateurRetenue("0") ;
     }
     else { 
       mainsimulation.setIndicateurZero("1") ; mainsimulation.setIndicateurSigne("0") ; mainsimulation.setIndicateurRetenue("0") ;
       mainsimulation.setIndicateurDebord("0"); 
     }
 
       
   } 


   //  comparaison Imm
  cmpImm = function (code,param1,instrTab,cpt) {
    let m= instrTab[cpt+1].getVal() ; 
    let n=0 ; 
     switch(param1) {
       case "000":
         n = mainsimulation.AX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "001":
         n = mainsimulation.BX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "010":
         n = mainsimulation.CX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "011":
         n = mainsimulation.DX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "100":
         n = mainsimulation.EX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m)); 
         break;
       case "101":
         n = mainsimulation.FX.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "110":
         n = mainsimulation.SI.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
       case "111":
         n = mainsimulation.DI.getContenu();
         mainsimulation.ACC.setContenu(n);
         mainsimulation.ACC.setContenu(this.operation("SUB",n,m));
         break;
     }
     if(util.compareHexValues(n,m)>0) {
      mainsimulation.setIndicateurZero("0") ; mainsimulation.setIndicateurSigne("0") ; mainsimulation.setIndicateurRetenue("0") ;
    }else if(util.compareHexValues(n,m)<0) {
      mainsimulation.setIndicateurZero("0") ; mainsimulation.setIndicateurSigne("1") ; mainsimulation.setIndicateurRetenue("0") ;
    }
    else { 
      mainsimulation.setIndicateurZero("1") ; mainsimulation.setIndicateurSigne("0") ; mainsimulation.setIndicateurRetenue("0") ;
      mainsimulation.setIndicateurDebord("0"); 
    }
       
   } //  DIN comparaison Imm

   store = function(cpt) {
    let i = mainsimulation.getinstrTab()[cpt+1].getVal() ; 
    i= util.chercherAdr(mainsimulation.getDataTab(),i.slice(1)) ; 
    mainsimulation.getDataTab()[i].setVal(mainsimulation.ACC.getContenu())  ; 
   } 

   NotDirect = function(code,param1) {
    let m = 0 ; 
    let n = 0;   
    switch (param1) { 
      case "000": m = mainsimulation.AX.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.AX.setContenu(mainsimulation.ACC.getContenu()); break;
      case "001": m = mainsimulation.BX.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.BX.setContenu(mainsimulation.ACC.getContenu()); break;
      case "010": m = mainsimulation.CX.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.CX.setContenu(mainsimulation.ACC.getContenu()); break;
      case "011": m = mainsimulation.DX.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.DX.setContenu(mainsimulation.ACC.getContenu()); break;
      case "100": m = mainsimulation.EX.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.EX.setContenu(mainsimulation.ACC.getContenu()); break;
      case "101": m = mainsimulation.FX.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.FX.setContenu(mainsimulation.ACC.getContenu()); break;
      case "110": m = mainsimulation.SI.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.SI.setContenu(mainsimulation.ACC.getContenu()); break;
      case "111": m = mainsimulation.DI.getContenu(); mainsimulation.ACC.setContenu(m); mainsimulation.ACC.setContenu(this.operation(code,n,m)); mainsimulation.DI.setContenu(mainsimulation.ACC.getContenu()); break;

  }
   }

   // mettre a jour les indicateurs          
   mettreAjourIndicateur = function(val) {   
    let binaryRes = (util.remplirZero(util.hexEnBinaire(val),16,0)).slice(-16) ;
    if(val=="0000"){mainsimulation.setIndicateurZero("1") ;}
    else {mainsimulation.setIndicateurZero("0");}
    if (val.length>4){mainsimulation.setIndicateurDebord("1"); mainsimulation.setIndicateurRetenue("1");}
    else {
      mainsimulation.setIndicateurDebord("0"); 
      mainsimulation.setIndicateurRetenue("0");
      
    }
    if (binaryRes[0]== "1") {mainsimulation.setIndicateurSigne("1");}
    else {mainsimulation.setIndicateurSigne("0");}

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


// l'objet mainsimulation : ce n'est pas le mainsimulation il contient juste des opérations élémentaires 
var mainsimulation = {
  dataTab: [],
  instrTab :[],
  tabEtiq : [],
  indic: new registre("INDIC","0000") , 
  ualsimulation: new UALsimulation("0", "0"),
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
    let delay = 0;
    let adr = "";
    let lines = contents.split('\n');
    console.log(contents);
    console.log("ih");
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
      console.log(ligne_str[0]);
      if (ligne_str[0] == "ORG") {
        console.log("hh");
        if (ligne_str[1].indexOf("H") != -1) {
          adr = ligne_str[1].slice(0, ligne_str[1].length - 1);
      
        } 
               // la première phase 
        console.log("aha");
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
        mainsimulation.instrTab=mainsimulation.getinstrTab().concat(tab) ;
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

    for (let i = 0; i < mainsimulation.getinstrTab().length; i++) {
    mainsimulation.getinstrTab()[i].afficher();
    mainsimulation.getinstrTab()[i].afficherHTML();}

    console.log("********************** ");
    messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";

  // delay +=3000;
   //console.log(delay);
    this.Execute(mainsimulation.getinstrTab());

    console.log("***  REGISTRES ***");
    messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***  REGISTRES  *** </span></p>";

    mainsimulation.afficherRegistres() ;
    mainsimulation.afficherRegistresHTML();

    console.log("***  FLAGS ***");
    messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***  FLAGS  *** </span></p>";
    mainsimulation.afficherIndicateurs() ;
    mainsimulation.afficherIndicateursHTML();

    console.log("***  Data Segment ***");
    messageDiv.innerHTML +="<p class='executemsg' ><span style='color: white;'>***  Data Segment *** </span></p>";

    for (let i = 0; i < this.getDataTab().length; i++){
      this.getDataTab()[i].afficher();
      this.getDataTab()[i].afficherHTML();}

    console.log("**********************");
    messageDiv.innerHTML +="<p class='executemsg' <span style='color: white;'>********************** </span> </p>";
    console.log(""); 
      
    
  },



  Execute: function (instrTab) {
    let j = 0 ;
    let i = 0 ;
    let delay=0;
      while (j < instrTab.length) {
        let instrBin = util.remplirZero(parseInt((instrTab[j].getVal()), 16).toString(2),16,0);
        this.setRI(instrBin) ;
       let adr=instrTab[j].getAdr();
     //  console.log("j"+j);
    
      
        let d = premierePhase(adr,delay,instrTab[j].getVal());  
        delay=d+3000;
       console.log("instruct:"+j+" delay="+delay);
        selectElement(cop,delay,this.getRI().getCOP());
        selectElement(MA,delay,this.getRI().getMA());
        selectElement(F,delay,this.getRI().getF());
        selectElement(D,delay,this.getRI().getD());
        selectElement(REG1,delay,this.getRI().getReg1());
        selectElement(REG2,delay,this.getRI().getreg2());
       
        delay+=3000;
        switch (this.getRI().getCOP()) {
          case "000000": 
          selectElement(instname,delay,"MOV");
          i = this.ualsimulation.opeRation("MOV",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
          delay = i.p2;
          console.log("operation.p2="+i.p2);
          j = i.p1 ; break ;
          case "100000": 
          selectElement(instname,delay,"MOVI");
          i = this.ualsimulation.opeRation("MOVI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
          j = i ; break ;
          case "000001":
            selectElement(instname,delay,"ADD");
          i = this.ualsimulation.opeRation("ADD",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
          delay=i.p2
          j=i.p1 ; break ;
          case "000011":
            selectElement(instname,delay,"SUB");
          i = this.ualsimulation.opeRation("SUB",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
          j=i ; break ;
            case "000111":
              selectElement(instname,delay,"AND");
              i = this.ualsimulation.opeRation("AND",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
              j=i ; break ;
            case "000110":
              selectElement(instname,delay,"OR");
              i = this.ualsimulation.opeRation("OR",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
              j=i ; break ;
            case "011010":
              selectElement(instname,delay,"NOT");
              i = this.ualsimulation.opeRation("NOT",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
              j=i ; break ;
            case "100001":
              selectElement(instname,delay,"ADDI");
              i = this.ualsimulation.opeRation("ADDI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
              j=i ; break ;
            case "100011":
              selectElement(instname,delay,"SUBI");
              i = this.ualsimulation.opeRation("SUBI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
              j=i ; break ;
              case "001001":
                selectElement(instname,delay,"SHL");
                i = this.ualsimulation.opeRation("SHL",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "001000":
                selectElement(instname,delay,"SHR");
                i = this.ualsimulation.opeRation("SHR",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "100100":
                selectElement(instname,delay,"SBAI");
                i = this.ualsimulation.opeRation("SBAI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "011000":
                selectElement(instname,delay,"INC");
                i = this.ualsimulation.opeRation("INC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "011001":
                selectElement(instname,delay,"DEC");
                i = this.ualsimulation.opeRation("DEC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "000101":
                selectElement(instname,delay,"CMP");
                i = this.ualsimulation.opeRation("CMP",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "100101":
                selectElement(addinstel,delay,"CMPI");
                i = this.ualsimulation.opeRation("CMPI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "011011":
                selectElement(instname,delay,"JMP");
                i = this.ualsimulation.opeRation("JMP",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "001100":
                selectElement(instname,delay,"JZ");
                i = this.ualsimulation.opeRation("JZ",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ; 
              case "001101":
                selectElement(instname,delay,"JNZ");
                i = this.ualsimulation.opeRation("JNZ",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "001110":
                selectElement(instname,delay,"JC");
                i = this.ualsimulation.opeRation("JC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "001111":
                selectElement(instname,delay,"JNC");
                i = this.ualsimulation.opeRation("JNC",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010000":
                selectElement(instname,delay,"JS");
                i = this.ualsimulation.opeRation("JS",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010001":
                selectElement(instname,delay,"JNS");
                i = this.ualsimulation.opeRation("JNS",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010010":
                selectElement(instname,delay,"JO");
                i = this.ualsimulation.opeRation("JO",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010011":
                selectElement(instname,delay,"JNO");
                i = this.ualsimulation.opeRation("JNO",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010100":
                selectElement(instname,delay,"JE");
                i = this.ualsimulation.opeRation("JE",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010101":
                selectElement(instname,delay,"JNE");
                i = this.ualsimulation.opeRation("JNE",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                delay=i.p2;
                j=i.p1 ; break ;
              case "010110":
                selectElement(instname,delay,"LOAD");
                i = this.ualsimulation.opeRation("LOAD",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "110110":
                selectElement(instname,delay,"LOADI");
                i = this.ualsimulation.opeRation("LOADI",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
              case "010111":
                selectElement(instname,delay,"");
                i = this.ualsimulation.opeRation("STORE",this.getDataTab(),this.getIndicateurSigne(),instrTab,this.getRI().getMA(),j,this.getRI().getD(),this.getRI().getF(),this.getRI().getReg1(),this.getRI().getreg2(),delay);
                j=i ; break ;
            
              default:
                break ; 
  
        }
      delay+=5000;
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
// fin obj mainsimulation

//___________________________________________ end of functions of simulation _______________________________________________







/************************ added part by Rania / simulation : animation **********************************/
var utilAnimation = {

  // makes an element with the id="idElem" invisible : it will hide it
  HideElemById: function (idElem) {
    idElem.style.visibility='hidden';
  },


// make an element visible 
ShowElemById: function (idElem) {
  idElem.style.visibility='visible';

},


}

/************************************ END OF ADDED THINGS BY ME *********************************************/







//________________  Random Little function (event listners ...) __________________________________




/** the event listener of "essembler" button **/
const testButton = document.getElementById("compile_id");
const textDiv = document.getElementById("code");
testButton.addEventListener("click", () => {
  let contents = textDiv.value; // récupère le contenu initial de la div
  textDiv.addEventListener('input', function() {
  contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
  });
  assembler.errorFunction(contents);
});



/** the event listener of "executer" button **/
const ExecuteButton = document.getElementById("run_id");
ExecuteButton.addEventListener("click", () => {
  let contents = textDiv.value; // récupère le contenu initial de la div
  textDiv.addEventListener("input", ()=> {
  contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
  });
  console.log("the click on the button execute has worked ! ");
  const messageDiv= document.getElementById("messageDiv");
  messageDiv.innerHTML = ""; 
  main.coder(contents);
  
});


/** the event listener of getting the input of a file button and then putting the content on the texte zone **/
const fileInputButton = document.getElementById("fileInput")
fileInputButton.addEventListener("change",() => {
 assembler.fromFileInputToTextZone("fileInput","code","code2");
})



/** the event listener of "save" button that saves the content of texte zone into a .PASS file**/
var saveButton = document.getElementById("save");
var codeTextarea = document.getElementById("code");
saveButton.addEventListener("click", function() {
  let codeText = codeTextarea.value;
  console.log(codeText);
  let blob = new Blob([codeText], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "mon_fichier.PASSE");
});




/** the event listener of "selecting one from the six file options we have" button **/
const optionButton =document.getElementById("fileSelect")
optionButton.addEventListener("change", () => {
  console.log("THE click on the option button worked !");  
  const messageDiv = document.getElementById("code")
  messageDiv.style.background= '#010232'; 
  const option = optionButton.options[optionButton.selectedIndex];
  const file = option.value;
  const xhr = new XMLHttpRequest();// Create a new XMLHttpRequest object
  xhr.onload = () => {  // Define a function to handle the "load" event of the XMLHttpRequest object
    // Get the contents of the file as a string
    console.log("we are getting the content  !");
    const contents = xhr.responseText;
    console.log(contents);
    assembler.fromFileNameToTextZone(contents)
  };
  xhr.open("GET", file);  // Open the file
  xhr.send();  // Send the request
//assembler.fromFileNameToTextZone("./program_1.txt","code");
})



/**  Traitement pour afficher le nobre de ligne dans la console **/
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



/**--------- HERE THE ANIMATION FOR THE SIMULATION STARTS -----------**/

const simulbtn = document.getElementById("simulate_id");
const PasseConsole = document.getElementById("sml");
const ArchiDiv = document.getElementById("arch-id");


// the event listener for the simule button 
simulbtn.addEventListener("click", () => {
  utilAnimation.HideElemById(PasseConsole);
  utilAnimation.ShowElemById(ArchiDiv);
  }) ;

  

// the event listener of the return button in the ArchiDiv
var returnBtn = document.getElementById("return");
returnBtn.addEventListener("click",()=>{
  utilAnimation.HideElemById(ArchiDiv);
  utilAnimation.ShowElemById(PasseConsole);
  hide(dataCOel);
  hide(dataRAMel);
  hide(dataRIMel);
  hide(dataDATAel);
  hide(dataREGel); 
  hide(dataREG1el);
  hide(dataREG2el);
  hide(dataACCel);
  hide(dataC1el);
  hide(dataC2el);
  hide(dataC3el);
  hide(dataC4el);
  hide(dataC5el);
  hide(dataEUAL1el);
  hide(dataEUAL2el);
}) ;




function hide(el, delay){
  setTimeout(function() { el.style.visibility='hidden';
},delay);
}


//l'animation de flow de data
function moveData(Bus,delay){         // on redéfinit vers glowdata
  
    var computedStyle = window.getComputedStyle(Bus);
    var left = computedStyle.getPropertyValue('left');
  
       Bus.style.visibility='visible';
       Bus.style.animation= 'slide-left 3s';
       // Bus.style.left='100%';
  }



function selectElement(Element, delay ,string) {
  setTimeout(function() {
    if (Element.className==='dataflux'){
          moveData(Element);
          hide(Element, delay);
    }else{
      if((Element==co) || (Element==ram)){
        
      this.afficherTexteSurElement(Element,string) ;
      }
      else{
      if(Element==instname){
        Element.textContent= string;
        Element.style.color='#00FF00';
        Element.style.fontSize='22px';
       // Element.style.backgroundColor='white';
      //  Element.style.filter='blur(1px)';
      }
      else{
      if((Element==cop) || (Element==MA) || (Element==F) || (Element==D) || (Element==REG1) || (Element==REG2)){
        
      this.afficherTexteSurElement(Element,string) ;
      }
      else{
      
        this.afficherTexteSurElement(Element,string) ;
  }
  }
}}

  }, delay);
}
var co = document.getElementById("CO");
var ram = document.getElementById("RAM");
var acc = document.getElementById("ACC");
var rim = document.getElementById("Rimcontent");
var ri = document.getElementById("RI");
var ual1=document.getElementById("EUAL1");
var ual2=document.getElementById("EUAL2");
var ax=document.getElementById("AX");
var bx=document.getElementById("BX");
var cx=document.getElementById("CX");
var dx=document.getElementById("DX");
var ex=document.getElementById("EX");
var fx=document.getElementById("FX");
var si=document.getElementById("SI");
var di=document.getElementById("DI");
var z=document.getElementById("Z");
var s=document.getElementById("S");
var r=document.getElementById("R");
var d=document.getElementById("D");
var eual=document.getElementById("EUAL");
var cop=document.getElementById("COP");
var MA=document.getElementById("MA");
var F=document.getElementById("F");
var D=document.getElementById("DD");
var REG1=document.getElementById("REG1");
var REG2=document.getElementById("REG2");
var caseMemoire = document.getElementById("caseMemoire");
var instname = document.getElementById("instname");

function premierePhase(adr,delay,info){
   
       selectElement(co, delay , adr);
       delay += 3000; 
       selectElement(dataCOel,delay,0);
       delay+=3000;
       selectElement(dataRAMel,delay,0);
       delay+=3000;
       selectElement(ram,delay,adr);
       delay+=3000;
       selectElement(caseMemoire,delay,info);
       delay+=3000;
       selectElement(rim,delay,info);
       delay+=3000;
       selectElement(dataRIMel,delay,0);
       return delay;

       
  
} 
function ecriturememoire(adr,delay,info){

  selectElement(ram,delay,adr);
  selectElement(dataC5el,delay,0);
  delay+=3000;
  selectElement(dataC4el,delay,0);
  delay+=3000;
  selectElement(dataACCel,delay,0);
  delay+=3000;
  selectElement(dataDATAel,delay,0);
  delay+=3000;
  selectElement(dataRIMel,delay,0);
  delay+=3000;
  selectElement(rim,delay,info);
  delay+=3000;
  selectElement(caseMemoire,delay,info);
  
  return delay;
}
function lecturememoire(adr,delay,info){
  
  selectElement(dataDATAel,delay,0);
  delay+=3000;
  selectElement(dataTDAel,delay,0);
  delay+=3000;
  selectElement(ram,delay,adr);
  delay+=3000;
  selectElement(caseMemoire,delay,info);
  delay+=3000;
  selectElement(rim,delay,info);
  return delay;

}
function ecriturememoiremov(adr,delay,info){

  selectElement(ram,delay,adr);
  selectElement(dataREGel,delay,0);
  delay+=3000;
  selectElement(dataDATAel,delay,0);
  delay+=3000;
  selectElement(dataRIMel,delay,0);
  delay+=3000;
  selectElement(rim,delay,info);
  delay+=3000;
  selectElement(caseMemoire,delay,info);
  
  return delay;
}

function simulation(){
  var co = document.getElementById("CO");
  var ram = document.getElementById("RAM");
  let delay=0;
 // premierePhase(100);     // la phase 1 
  mainsimulation.coder(contents,delay);   // l'exécution



}


function start() {
  //if(startbutton.name === 'caret-forward-outline')
  //{
   // startbutton.name = "stop-circle-outline";
    simulation();
  //}
  //else{
    //startbutton.name = "caret-forward-outline" ;

  //}
}






const startbutton  = document.getElementById("strt");
startbutton.addEventListener("click", () => {
 // let delay=0;// fin obj assembler
  const textDiv = document.getElementById("code");
  let contents = textDiv.value;
  textDiv.addEventListener("input", function() {
    contents = textDiv.value; // met à jour le contenu de la variable lorsque la div est modifiée
    });
    console.log(" the click on the button execute has worked ! ");
    const messageDiv= document.getElementById("messageDiv");
    messageDiv.innerHTML = ""; 
   
  mainsimulation.coder(contents);

});

function afficherTexteSurElement(Element,string) {
  var previousTextContainer = "";
  var textContainer = "" ;
  switch (Element) {
    case co :
      previousTextContainer = document.querySelector(".textContainerCo");
      if (previousTextContainer) {
      previousTextContainer.parentNode.removeChild(previousTextContainer);
      }
      // Create a new textContainer element
      textContainer = document.createElement("div");
      textContainer.className = "textContainerCo";
      textContainer.textContent = "@" + string;

      // Append the textContainer above the element
      Element.parentNode.insertBefore(textContainer, Element);  
      break;
      case ram :
      previousTextContainer = document.querySelector(".textContainerRam");
      if (previousTextContainer) {
      previousTextContainer.parentNode.removeChild(previousTextContainer);
      }
      // Create a new textContainer element
      textContainer = document.createElement("div");
      textContainer.className = "textContainerRam";
      textContainer.textContent = "@" + string;
      // Append the textContainer above the element
      Element.parentNode.insertBefore(textContainer, Element); 
      break;

      case cop:
      previousTextContainer = document.querySelector(".textContainerCop");
      if (previousTextContainer) {
      previousTextContainer.parentNode.removeChild(previousTextContainer);
      }
      // Create a new textContainer element
      textContainer = document.createElement("div");
      textContainer.className = "textContainerCop";
      textContainer.textContent = string;
      // Append the textContainer above the element
      Element.parentNode.insertBefore(textContainer, Element); 
      break;

      case MA: 
      previousTextContainer = document.querySelector(".textContainerMa");
      if (previousTextContainer) {
      previousTextContainer.parentNode.removeChild(previousTextContainer);
      }
      // Create a new textContainer element
      textContainer = document.createElement("div");
      textContainer.className = "textContainerMa";
      textContainer.textContent = string;
      // Append the textContainer above the element
      Element.parentNode.insertBefore(textContainer, Element); 
      break;

      case D:
        previousTextContainer = document.querySelector(".textContainerD");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerD";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case F: 
        previousTextContainer = document.querySelector(".textContainerF");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerF";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case REG1: 
        previousTextContainer = document.querySelector(".textContainerReg1");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerReg1";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case REG2: 
        previousTextContainer = document.querySelector(".textContainerReg2");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerReg2";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case ax: 
        previousTextContainer = document.querySelector(".textContainerAx");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerAx";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case bx: 
        previousTextContainer = document.querySelector(".textContainerBx");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerBx";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case cx: 
        previousTextContainer = document.querySelector(".textContainerCx");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerCx";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case dx: 
        previousTextContainer = document.querySelector(".textContainerDx");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerDx";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case ex: 
        previousTextContainer = document.querySelector(".textContainerEx");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerEx";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case fx: 
        previousTextContainer = document.querySelector(".textContainerFx");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerFx";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case di: 
        previousTextContainer = document.querySelector(".textContainerDi");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerDi";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case si: 
        previousTextContainer = document.querySelector(".textContainerSi");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerSi";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case ual1: 
        previousTextContainer = document.querySelector(".textContainerEual1");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerEual1";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case ual2: 
        previousTextContainer = document.querySelector(".textContainerEual2");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerEual2";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case acc: 
        previousTextContainer = document.querySelector(".textContainerAcc");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerAcc";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;

        case rim: 
        previousTextContainer = document.querySelector(".textContainerRim");
        if (previousTextContainer) {
        previousTextContainer.parentNode.removeChild(previousTextContainer);
        }
        // Create a new textContainer element
        textContainer = document.createElement("div");
        textContainer.className = "textContainerRim";
        textContainer.textContent = string;
        // Append the textContainer above the element
        Element.parentNode.insertBefore(textContainer, Element); 
        break;


    }


}





//_______________________________________________________________________________________________