class RI {
    #cop;
    #ma;
    #f;
    #d;
    #reg1;
    #reg2;
      setRI = (code) => {
      this.#cop = code.substring(0, 5);
      this.#ma  = code.substring(6, 7);
      this.#f  = code.substring(8, 8);
      this.#d  = code.substring(9 , 9);
      this.#reg1 = code.substring(10,12);
      this.#reg2 = code.substring(13,15);
      }
      getCOP =()=> {
        return this.#cop;
      }
      getMA = () =>{
        return this.#ma;
      }
      getF = () =>{
        return this.#f;
      }
      getD = () =>{
        return this.#d;
      }
     getReg1 = () =>{
        return this.#reg1;
     }
     getreg2 = () =>{
        return this.#reg2;
     }
    }