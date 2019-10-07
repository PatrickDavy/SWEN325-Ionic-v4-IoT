import { Injectable } from '@angular/core';

declare var Paho: any;

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private recentLocation: any = '';
  private count = 4;
  private countArray = [0, 1, 2, 3];
  private mqttStatus = 'Disconnected';
  private mqttClient: any = null;
  private message: any = '';
  private icon: any = '';
  private topic = 'swen325/a3';
  private clientId = 'FuckYouIfYouWroteThisAsWell';
  private address = {
    path: 'barretts.ecs.vuw.ac.nz',
    port: 8883,
    suffix: '/mqtt'
  };
  private living = {
    date: '', time: 'Room has not yet had any activity', roomName: 'living', active: 0, batteryStatus: 0,
    image: '../../../assets/icon/living.png', color: '#ff5458', activeData: 0, batteryArray: [0, 25, 50, 75, 100]
  };
  private kitchen = {
    date: '', time: 'Room has not yet had any activity', roomName: 'kitchen', active: 1, batteryStatus: 25,
    image: '../../../assets/icon/kitchen.png', color: '#64ff63', activeData: 0, batteryArray: [25, 50, 75, 100, 0]
  };
  private dining = {
    date: '', time: 'Room has not yet had any activity', roomName: 'dining', active: 0, batteryStatus: 50,
    image: '../../../assets/icon/dining.png', color: '#ff5458', activeData: 0, batteryArray: [50, 75, 100, 0, 25]
  };
  private toilet = {
    date: '', time: 'Room has not yet had any activity', roomName: 'toilet', active: 1, batteryStatus: 75,
    image: '../../../assets/icon/toilet.png', color: '#64ff63', activeData: 0, batteryArray: [100, 75, 50, 25, 0]
  };
  private bedroom = {
    date: '', time: 'Room has not yet had any activity', roomName: 'bedroom', active: 0, batteryStatus: 100,
    image: '../../../assets/icon/bedroom.png', color: '#ff5458', activeData: 0, batteryArray: [25, 75, 50, 0, 100]
  };
  constructor() {
    this.connect();
  }
  public connect = () => {
    this.mqttStatus = `Connecting to ${this.address.path}:${this.address.port}`;
    // this.mqttClient = new Paho.MQTT.Client(this.address.path, this.address.port, this.address.suffix, this.clientId);
    this.mqttClient = new Paho.MQTT.Client('barretts.ecs.vuw.ac.nz', 8883, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log(`Connecting to ${this.address.path} via websocket ${this.address.port}`);
    // this.mqttClient.connect({timeout:10, userName:'ptweqash', password:'ncU6vlGPp1mN',
    // useSSL:true, onSuccess:this.onConnect, onFailure:this.onFailure});
    this.mqttClient.connect({ timeout: 10, useSSL: false, onSuccess: this.onConnect, onFailure: this.onFailure });
  }

  public onConnect = () => {
    console.log('Connected?');
    this.mqttStatus = 'Connected';

    // subscribe
    this.mqttClient.subscribe(this.topic);
  }

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  }

  public onMessageArrived = (message) => {
    console.log(message.payloadString);
    this.message = message.payloadString;
    this.processMessage(message);
  }

  public processMessage = (message) => {
    const info = message.payloadString;
    const infoArray = info.split(',');
    for (let i = 0; i < 4; i++) {
      switch (infoArray[i]) {
        case 'living' :
          this.processRoom(infoArray, this.living);
          break;
        case 'kitchen':
          this.processRoom(infoArray, this.kitchen);
          break;
        case 'dining':
          this.processRoom(infoArray, this.dining);
          break;
        case 'toilet':
          this.processRoom(infoArray, this.toilet);
          break;
        case 'bedroom':
          this.processRoom(infoArray, this.bedroom);
          this.countArray.push(this.count++);
          break;
      }
    }
  }

  public processRoom = (message, room) => {
    room.roomName = message[1];
    if (message[2] === '0') {
      room.activeData += 0;
      room.active = 'No';
      room.color = '#ff5458';
    } else {
      room.activeData += 1;
      room.date = message[0].split(' ')[0];
      room.time = message[0].split(' ')[1];
      room.active = 'Yes';
      room.color = '#64ff63';
      this.recentLocation = room.roomName;
      this.icon = '../../../assets/icon/' + room.roomName + '.png';
    }
    room.batteryStatus = message[3];
    room.batteryArray.push(room.batteryStatus);
  }

  public getLiving() {
    return this.living;
  }

  public getKitchen() {
    return this.kitchen;
  }

  public getDining() {
    return this.dining;
  }

  public getToilet() {
    return this.toilet;
  }

  public getBedroom() {
    return this.bedroom;
  }

  public getRecentLocation() {
    return this.recentLocation;
  }

  public getCountArray() {
    return this.countArray;
  }
}
