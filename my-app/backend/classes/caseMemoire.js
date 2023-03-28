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
    
    }
    export { CaseMc } ;