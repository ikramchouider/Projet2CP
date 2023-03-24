class UAL {
    #eUal1 ; 
    #eUal2 ; 
    constructor(eUal1,eUal2) {
        this.#eUal1 = eUal1 ; 
        this.#eUal2 = eUal2 ; 
    }
    add = () => {
        return parseInt(parseInt(this.#eUal1),2) +parseInt(parseInt(this.#eUal2),2) ;
    }
}