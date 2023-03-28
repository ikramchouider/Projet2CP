class CaseMc {
    #val
    #adr
    #etiq


    constructor(adr,val,etiq){
    this.#adr=adr;
    this.#val=val;
    this.#etiq=etiq;
    }
    setVal(val){
            this.#val= val ; 
    }
    afficher() {
        console.log(`adr ${this.#adr}  val ${this.#val}  etiq ${this.#etiq} `); 
    }
    
    }
    export default CaseMc ;