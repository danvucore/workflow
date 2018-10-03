export class Context {
  trigger: string;
  data: object = null;
  constructor(trigger) {
    this.trigger = trigger;
  }

  getTrigger() {
    return this.trigger;
  }

  setTrigger(trigger: string) {
    this.trigger = trigger;
  }

  getData() {
    return this.data;
  }

  setData(data: object) {
    this.data = data;
  }
}
