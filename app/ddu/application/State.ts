import { IActivity } from './IActivity';

export class State {
  name: string;
  activities: Array<IActivity> = [];
  constructor(name) {
    this.name = name;
  }

  addActivities(activities: Array<IActivity>) {
    this.activities = this.activities.concat(activities);
  }

  execute(context) {
    console.log('execute context', context);
  }
}

export enum STATE_LIST {
  INIT,
  ENTER,
  BACK,
  ACCEPT,
  CANCEL
}
