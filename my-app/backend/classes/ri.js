class RI {
  #cop;
  #ma;
  #f;
  #d;
  #reg1;
  #reg2;
  setRI = (code) => {
    this.#cop = code.substring(0, 6); // capable de changer le 5 à 6 etc ..
    this.#ma = code.substring(6, 8);
    this.#f = code.substring(8, 9);
    this.#d = code.substring(9, 10);
    this.#reg1 = code.substring(10, 13);
    this.#reg2 = code.substring(13, 16);
  };
  getCOP = () => {
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
export default RI;
