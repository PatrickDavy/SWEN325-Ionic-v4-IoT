import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { MqttService } from '../../service/mqtt.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {
  @ViewChild('barChart', null) barChart;
  @ViewChild('pieChart', null) pieChart;

  bars: any;
  pie: any;
  colorArray: any;
  constructor(private MQTT: MqttService) {
    this.generateColorArray(5);
  }

  ionViewDidEnter() {
    this.createLineChart();
    this.createPieChart();
  }

  /**
   * Line chart displays a history of battery percentages
   */
  createLineChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.MQTT.getCountArray(),
        datasets:
            [{
          label: 'living',
          data: this.MQTT.getLiving().batteryArray,
          backgroundColor: 'rgba(0, 0, 0, 0)', // array should have same number of elements as number of dataset
          borderColor: this.colorArray[0], // array should have same number of elements as number of dataset
          borderWidth: 1
            },
          {
            label: 'kitchen',
            data: this.MQTT.getKitchen().batteryArray,
            backgroundColor: 'rgba(0, 0, 0, 0)', // array should have same number of elements as number of dataset
            borderColor: this.colorArray[1], // array should have same number of elements as number of dataset
            borderWidth: 1
          },
          {
            label: 'dining',
            data: this.MQTT.getDining().batteryArray,
            backgroundColor: 'rgba(0, 0, 0, 0)', // array should have same number of elements as number of dataset
            borderColor: this.colorArray[2], // array should have same number of elements as number of dataset
            borderWidth: 1
          },
          {
            label: 'toilet',
            data: this.MQTT.getToilet().batteryArray,
            backgroundColor: 'rgba(0, 0, 0, 0)', // array should have same number of elements as number of dataset
            borderColor: this.colorArray[3], // array should have same number of elements as number of dataset
            borderWidth: 1
          },
          {
            label: 'bedroom',
            data: this.MQTT.getBedroom().batteryArray,
            backgroundColor: 'rgba(0, 0, 0, 0)', // array should have same number of elements as number of dataset
            borderColor: this.colorArray[4], // array should have same number of elements as number of dataset
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  /**
   * Pie chart displays which rooms are most active
   */
  createPieChart() {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['living room', 'kitchen', 'dining', 'toilet', 'bedroom'],
        datasets: [{
          label: 'Viewers in millions',
          data: [
              this.MQTT.getLiving().activeData, this.MQTT.getKitchen().activeData,
            this.MQTT.getDining().activeData, this.MQTT.getToilet().activeData, this.MQTT.getBedroom().activeData
          ],
          backgroundColor: this.colorArray, // array should have same number of elements as number of dataset
          borderColor: this.colorArray, // array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      }
    });
  }

  /**
   * Randomises colour values.
   * @param num
   */
  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
  }
}
