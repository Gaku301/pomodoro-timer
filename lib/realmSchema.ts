import { Realm } from '@realm/react';

export class Setting extends Realm.Object<Setting> {
  _id!: Realm.BSON.ObjectId;
  pomodoroTime!: number;
  breakTime!: number;
  theme!: string;
  createdAt!: Date;

  static generate() {
    return {
      _id: new Realm.BSON.ObjectId(),
      pomodoroTime: 25,
      breakTime: 5,
      theme: 'light',
      createdAt: new Date(),
    };
  }

  static schema: Realm.ObjectSchema = {
    name: 'Setting',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      pomodoroTime: 'int',
      breakTime: 'int',
      theme: 'string',
      createdAt: 'date',
    },
  };
}