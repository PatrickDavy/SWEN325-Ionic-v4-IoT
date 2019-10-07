import { Component } from '@angular/core';
import { MqttService } from '../../service/mqtt.service';

@Component({
  selector: 'app-room-monitor',
  templateUrl: './room-monitor.page.html',
  styleUrls: ['./room-monitor.page.scss'],
})
export class RoomMonitorPage {
  constructor(public MQTT: MqttService) {
  }
}
