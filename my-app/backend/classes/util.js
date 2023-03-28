import './caseMc';
var util = {
    CoderInst : function (strLigne) {
    let c = new CaseMc();
    for(i=0;i<strLigne.length;i++){
    while(strLigne[i] != ' ') {i++;}
    if(strLigne[i-1] != ':') {}
    else{}
    }
    } ,
    
    
    coderOrg : function (ligne) {
        let ligne_str = ligne.toString().trim() ;
        console.log(ligne_str) ;
        //const cop = ligne_str.substring(0,4) ;
        //console.log(cop);
        let inst = ligne_str.split(' ') ;
        if (inst[0] =='ORG') {
            codeBinaire = "0111110000000000";
            let adr = parseInt(inst[1]) ;
            if (isNaN(adr)){
                throw new Error ("Parametre entree n'est pas un nombre!");
            }

        }
        
        else {
            return null ;
        }
    } ,
    
    

    coderSet : function (ligne) {

    }
}


var ligne = "   ORG 100   " ;
util.coderOrg(ligne) ;

