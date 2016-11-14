if (!Array.prototype.back) {
  Array.prototype.back = function() {
    return this[this.length - 1];
  };
}

function isVal(cmd) {
  return cmd[0]==='val';
}

function isOper(cmd) {
  return cmd[0]==='oper';
}

class Calc {
  constructor() {
    this.reset(10);
  }
  reset(base = 10) {
    this.buffer = [];
    this.base = base;
    this.buffer.push(['val', 0]);
  }
  exec(_cmd) {
    return new Promise((resolve, reject) => {
      let cmd = _cmd.split('-');
      let last = [];
      console.log(cmd);
      if (cmd.length==1) {
        switch(cmd[0]) {
          case 'ce':
            this.reset(this.base);
            break;
          case 'c':
            this.buffer.pop();
            this.buffer.push(['val', 0]);
            break;
          case 'bs':
            if (isOper(this.buffer.back()))
              this.buffer.push([...this.buffer[this.buffer.length-2]]);
            this.buffer.back()[1] = (this.buffer.back()[1]/this.base)|0;
            break;
          case 'neg':
            if (isOper(this.buffer.back()))
              this.buffer.push([...this.buffer[this.buffer.length-2]]);
            this.buffer.back()[1] *= -1;
            break;
          case 'calc':
            if (isOper(this.buffer.back()))
              this.buffer.push([...this.buffer[this.buffer.length-2]]);
            console.log(JSON.stringify(this.buffer));
            break;
          default:
            reject(cmd);
            return;
        }
      } else if (isVal(cmd)) {
        if (!isVal(this.buffer.back()))
          this.buffer.push(['val', 0]);
        last = this.buffer.back();
        last[1] = last[1] * this.base + parseInt(cmd[1], this.base);
      } else if (isOper(cmd)) {
        if (isOper(this.buffer.back()))
          this.buffer.pop();
        this.buffer.push(cmd);
      }
      resolve(this.buffer.filter(isVal).back()[1]);
    });
  }
}