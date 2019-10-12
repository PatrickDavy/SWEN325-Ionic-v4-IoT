import { Component } from '@angular/core';
import { MqttService } from '../../service/mqtt.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-battery-status',
  templateUrl: './battery-status.page.html',
  styleUrls: ['./battery-status.page.scss'],
})
export class BatteryStatusPage {

  constructor(public MQTT: MqttService, private sanitizer: DomSanitizer) {
  }

  getDynamicCardColour(colour) {
    return this.sanitizer.bypassSecurityTrustStyle(`--myvar: ${colour}`);
  }

  getDynamicBatteryPercentage(percentage) {
    return this.sanitizer.bypassSecurityTrustStyle(`--widthvar: ${percentage}`);
  }
}
