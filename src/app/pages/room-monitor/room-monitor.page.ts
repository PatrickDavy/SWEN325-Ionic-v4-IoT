import { Component } from '@angular/core';
import { MqttService } from '../../service/mqtt.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-room-monitor',
  templateUrl: './room-monitor.page.html',
  styleUrls: ['./room-monitor.page.scss'],
})
export class RoomMonitorPage {
  constructor(public MQTT: MqttService, public sanitizer: DomSanitizer) {
  }

  getDynamicCardColour(colour) {
    return this.sanitizer.bypassSecurityTrustStyle(`--colourvar: ${colour}`);
  }


}
