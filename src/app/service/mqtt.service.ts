import { Injectable } from '@angular/core';
declare var Paho: any;

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private currentTime = Math.floor(Date.now() / 1000);
  private deadName = '';
  private externalFlag = true;
  private recentLocation: any = '';
  private count = 0;
  private countArray = [];
  private mqttStatus = 'Disconnected';
  private mqttClient: any = null;
  private message: any = '';
  private topic = 'swen325/a3';
  private clientId = 'FuckYouIfYouWroteThisAsWell';
  // To gain access to the server.
  // Flip the path variables for working from home
  private address = {
    // path: 'barretts.ecs.vuw.ac.nz',
    path: 'localhost',
    port: 8883,
    suffix: '/mqtt'
  };
  // An array of initialised variables. These variables are so that the application does not open displaying a blank page
  private living = {
    date: '', time: 'Room has not yet had any activity', roomName: 'living', active: 0, batteryStatus: 0,
    image: '../../../assets/icon/living.png', color: '#ff5458', activeData: 0, batteryArray: [],
    roomFlag: false, tempTime: Math.floor(Date.now() / 1000)
  };
  private kitchen = {
    date: '', time: 'Room has not yet had any activity', roomName: 'kitchen', active: 1, batteryStatus: 25,
    image: '../../../assets/icon/kitchen.png', color: '#64ff63', activeData: 0, batteryArray: [],
    roomFlag: false, tempTime: Math.floor(Date.now() / 1000)
  };
  private dining = {
    date: '', time: 'Room has not yet had any activity', roomName: 'dining', active: 0, batteryStatus: 50,
    image: '../../../assets/icon/dining.png', color: '#ff5458', activeData: 0, batteryArray: [],
    roomFlag: false, tempTime: Math.floor(Date.now() / 1000)
  };
  private toilet = {
    date: '', time: 'Room has not yet had any activity', roomName: 'toilet', active: 1, batteryStatus: 75,
    image: '../../../assets/icon/toilet.png', color: '#64ff63', activeData: 0, batteryArray: [],
    roomFlag: false, tempTime: Math.floor(Date.now() / 1000)
  };
  private bedroom = {
    date: '', time: 'Room has not yet had any activity', roomName: 'bedroom', active: 0, batteryStatus: 100,
    image: '../../../assets/icon/bedroom.png', color: '#ff5458', activeData: 0, batteryArray: [],
    roomFlag: false, tempTime: Math.floor(Date.now() / 1000)
  };

  // Always connect to the server upon opening the application
  constructor() {
    this.connect();
  }

  /**
   * connect is called every time the application is opened.
   * Correct messages are displayed upon success or failure.
   */
  public connect = () => {
    this.mqttStatus = `Connecting to ${this.address.path}:${this.address.port}`;
    this.mqttClient = new Paho.MQTT.Client(this.address.path, this.address.port, this.address.suffix, this.clientId);
    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log(`Connecting to ${this.address.path} via websocket ${this.address.port}`);
    this.mqttClient.connect({ timeout: 10, useSSL: false, onSuccess: this.onConnect, onFailure: this.onFailure });
  }

  /**
   * If the connection is successful the the status will be set
   * and the server will subscribe to the incoming messages.
   */
  public onConnect = () => {
    console.log('Connected?');
    this.mqttStatus = 'Connected';
    // subscribe
    this.mqttClient.subscribe(this.topic);
  }

  /**
   * Upon failure to connect the status will be set accordingly.
   * A failure is unlikely to happen unless the user is not connected to the internet
   * or is using the wrong path variable.
   */
  public onFailure = () => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  /**
   * If the connection ends abruptly the status will change to now display the appropriate status
   * @param responseObject
   */
  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  }

  /**
   * As messages arrive send each one on to be processed in the this.processMessage() method.
   * @param message
   */
  public onMessageArrived = (message) => {
    console.log(message.payloadString);
    this.message = message.payloadString;
    this.processMessage(message);
  }

  /**
   * Detect which room is being read and then move it on accodingly by modifying the appropriate array.
   * @param message
   */
  public processMessage = (message) => {
    const info = message.payloadString;
    const infoArray = info.split(',');
    switch (infoArray[1]) {
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

  /**
   * Receives a room array and the complete message to be managed.
   * Majority of processing is done here step by step.
   * @param message
   * @param room
   */
  public processRoom = (message, room) => {
    room.roomName = message[1];
    this.currentTime = Math.floor(Date.now() / 1000);
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
      room.tempTime = Math.floor(Date.now() / 1000);
    }
    room.roomFlag = ( this.currentTime - room.tempTime) > 300;
    room.batteryStatus = message[3];
    room.batteryArray.push(room.batteryStatus);
    if (room.roomFlag && this.externalFlag) {
      this.deadName = room.roomName;
    }
  }

  /**
   * Checks if the supplied time has passed to state that a room has gone inactive
   * for a prolonged period fof time.
   */
  public getDeadRoomInfo() {
    if (this.deadName !== '' && this.externalFlag) {
      this.externalFlag = !this.externalFlag;
      return {
        Name: this.deadName,
        Flag: true,
      };
    } else {
      return {
        Name: this.deadName,
        Flag: false,
      };
    }
  }

  /**
   * When a message is displayed to the user stating a rooms inactivity.
   * Parameters need to be reset allow for another room to go inactive.
   */
  public resetTimer() {
    this.externalFlag = !this.externalFlag;
    const freshTime = Math.floor(Date.now() / 1000);
    this.currentTime = freshTime;
    this.getLiving().tempTime = freshTime;
    this.getKitchen().tempTime = freshTime;
    this.getDining().tempTime = freshTime;
    this.getToilet().tempTime = freshTime;
    this.getBedroom().tempTime = freshTime;
  }

  /**
   * getter methods to assist pages
   */
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
