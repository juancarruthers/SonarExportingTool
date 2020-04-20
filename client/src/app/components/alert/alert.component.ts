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

  closeAlert(): void{
    if (this.show){
      document.getElementById('closeAlert').setAttribute('hidden','');
      this.show = false;    
    }
  }

  showAlert(): void{
    if (!this.show){
      document.getElementById('closeAlert').removeAttribute('hidden');
      this.show = true;
    }
  }

}
