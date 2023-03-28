class Bus {
    #taille ;
    #color ; 
    #currentData ;

    constructor(taille,currentData) {
        this.#taille = taille ; 
        this.#currentData = currentData ; 
        this.Glow() ; 
    }
    
    getTaille = () => { return this.#taille ;   }
    getColor = () => { return this.#color ; }
    getCurrentData = () =>{ return this.#currentData ; }

     // il faut appliquer la proprieté Glow au Bus pour lui affecter une couleur et la recupérer en appellant getColor
    Glow = () => {
        if (this.#taille == 3) {this.#color = "#A32185";  } 
        else if (this.#taille == 11)  { this.#color = "#ff30cf"; }
        else if (this.#taille == 16) { this.#color= "#7EE7EE" ; }
    }

}