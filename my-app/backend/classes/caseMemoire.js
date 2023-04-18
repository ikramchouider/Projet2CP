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
    return this.#val ; 
  }
  getEtiq() {
    return this.#etiq ; 
  }
  getAdr() {
    return this.#adr ; 
  }
  afficher() {
    console.log(`ETIQ: ${this.#etiq}         @${this.#adr}   ${this.#val}`);
  }
}
export default CaseMc;
