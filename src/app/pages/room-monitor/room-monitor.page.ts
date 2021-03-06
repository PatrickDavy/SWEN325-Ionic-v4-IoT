import { Component } from '@angular/core';
import { MqttService } from '../../service/mqtt.service';
import { DomSanitizer } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-room-monitor',
  templateUrl: './room-monitor.page.html',
  styleUrls: ['./room-monitor.page.scss'],
})
export class RoomMonitorPage {

  /**
   * When the room is first loaded all notification handling needs to be started.
   * Checks are made for every message gathered.
   * @param MQTT
   * @param sanitizer
   * @param plt
   * @param localNotifications
   * @param alertCtrl
   */
  constructor(public MQTT: MqttService, public sanitizer: DomSanitizer, private plt: Platform,
              private localNotifications: LocalNotifications, private alertCtrl: AlertController) {
    this.plt.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {
        const msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });

      this.localNotifications.on('trigger').subscribe(res => {
        const msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });
    });
    this.scheduleNotification();

    // For every second a check is made to ensure room activity.
    const source = interval(1000);
    source.subscribe(() => {
      if (this.MQTT.getDeadRoomInfo().Flag === true) {
        this.scheduleNotification();
      }
    });
  }

  getDynamicCardColour(colour) {
    return this.sanitizer.bypassSecurityTrustStyle(`--colourvar: ${colour}`);
  }

  // Show push notification when no motion is detected
  scheduleNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
      text: 'The room has gone inactive in ' + this.MQTT.getDeadRoomInfo().Name + '\n(╯°□°）╯︵ ┻━┻',
    });
    this.MQTT.resetTimer();
  }

  // Show alert when no motion is detected
  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }
}
