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
export default CaseMc;
