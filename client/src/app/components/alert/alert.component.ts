import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  text: string;
  bootstrapColor: string;
  show: boolean;

  constructor() {
    this.text = 'Alert';
    this.bootstrapColor = 'danger';
    this.show = false;
  }

  ngOnInit(): void {
  }



}
