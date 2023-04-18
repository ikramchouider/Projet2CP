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
  export default registre;
  