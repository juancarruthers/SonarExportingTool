import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.css']
})
export class ExportModalComponent implements OnInit {

  title: string;
  description: string;
  radioOptions: string[];
  exportOption: string;
  projectsExported: number[];
  @ViewChild(AlertComponent) alert:AlertComponent;

  constructor() {

  }

  ngOnInit(): void {
    
  }

  selectRadio(p_radio: string){
    this.exportOption = p_radio;
  }

  validateExport(){
    if (this.exportOption != '') {
      if (this.projectsExported.length != 0){
        this.export();
        this.hideAlert();
      }else{
        this.alert.text = 'Select the project/s to export!';
        this.alert.bootstrapColor = 'danger';
        this.showAlert();
      }
   }else{
      this.alert.text = 'Choose a data format!';
      this.alert.bootstrapColor = 'danger';
     this.showAlert();
   }
  }

  export(){
    window.open("http://localhost:3000/api/projects/measures/" + this.projectsExported + '/' + this.exportOption, "_blank");
  }

  showAlert() {
    if (!this.alert.show){
      document.getElementById('alertExport').removeAttribute('class') ;
      this.alert.show = true;
    }
  }

  hideAlert() {
    if (this.alert.show){
      document.getElementById('alertExport').setAttribute('class', 'd-none') ;
      this.alert.bootstrapColor = 'danger';
      this.alert.show = false;
    }
  }

}
