import "./caseMemoire.js";
var util = {
  /*CoderInst: function (strLigne) {
    let c = new CaseMc();
    for (i = 0; i < strLigne.length; i++) {
      while (strLigne[i] != " ") {
        i++;
      }
      if (strLigne[i - 1] != ":") {
      } else {
      }
    }
  },

  codeMov: function(ligne){
    
  }
  coderOrg: function (ligne) {
    let ligne_str = ligne.toString().trim();
    console.log(ligne_str);
    let inst = ligne_str.split(" ");
    let param = inst[1].split("H");
    if (inst[0] == "ORG") {
      let codeBinaire = "0111110000000000";
      let adr = parseInt(inst[1]);
      if ((parseInt(param, 16)<256)||(parseInt(param, 16)>=1040)) {
        throw new Error ("Choissisez une adresse debut compris dans le segment de code [100H,410H]");
      }
      else {
        param = parseInt(param,16).toString(2);
        return (codeBinaire + this.remplirZero(param,16));
      }

    } 
    else 
    {
      return null;
    }
  },

  coderSet: function (ligne) {},
  remplirZero: function(str,n) {
    var s = "";
    for (let k = 0; k<n-str.length;k++){
      s += '0' ;
    }
    return (s+str);
    
  }*/
};

var ligne = "   ORM 100   H   ";
console.log(util.coderOrg(ligne));
