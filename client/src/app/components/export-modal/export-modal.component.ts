import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { ProjectsService } from '../../services/projects.service';
import { DownloadService } from '../../services/download.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.css']
})
export class ExportModalComponent implements OnInit {
  [x: string]: any;

  title: string;
  description: string;
  radioOptions: string[];
  exportOption: string;
  projectsExported: number[];
  projMetricsExported: number[];
  compMetricsExported: number[];
  @ViewChild(AlertComponent) alert:AlertComponent;

  constructor(private projectsService: ProjectsService, private downloadService: DownloadService, private http: HttpClient) {

  }

  ngOnInit(): void {
    
  }

  selectRadio(p_radio: string){
    this.exportOption = p_radio;
  }

  validateExport(){
    let flag: boolean = false;
    if (this.exportOption != '') {

      flag = this.validProjMetricsSelected(flag);
      flag = this.validCompMetricsSelected(flag);

      if (flag){
        this.export();
        this.hideAlert();
      }else{
        this.alert.text = 'Select the metric/s to export!';
        this.alert.bootstrapColor = 'danger';
        this.showAlert();
      }
   }else{
      this.alert.text = 'Choose a data format!';
      this.alert.bootstrapColor = 'danger';
     this.showAlert();
   }
  }

  validProjMetricsSelected(p_flag: boolean): boolean{
    if ((!p_flag) && (this.compMetricsExported[0] == 0)&&(this.projMetricsExported.length != 0)){
      p_flag = true
    }
    return p_flag;
  }

  validCompMetricsSelected(p_flag: boolean){
    if ((!p_flag) && (this.compMetricsExported[0] != 0) && (this.compMetricsExported.length != 0)){
      p_flag = true
    }
    return p_flag
  }

  export(){
    
    this.projectsService.getProjectsMeasures(this.projectsExported, this.projMetricsExported)
      .subscribe(
        resProj=> {
          

          if (this.compMetricsExported[0] != 0) {
            /*this.projectsService.getComponentsMeasures(this.projectsExported, this.compMetricsExported)
            .subscribe(
              resComp => {
                
                let measuresCombined = this.downloadService.joinComponentsANDProjectsMeasures(resProj, resComp);
                //this.generateZipFile(measuresCombined);

              },
              err=> console.log(err)
            );*/


            forkJoin(this.projectsService.makeMultipleRequest(this.projectsExported, this.compMetricsExported))
            .subscribe(
              resCompArray => {
                let measuresCombinedString: string = "";
                let resp : string;
                for(let resComp of resCompArray){   
                  resp = JSON.stringify(resComp).replace("[",",");
                  resp = resp.replace(/]$/,"");        
                  measuresCombinedString = measuresCombinedString + resp;
                }
                measuresCombinedString = measuresCombinedString.replace(",","[");
                measuresCombinedString = measuresCombinedString + "]";
                let measuresCombinedJson = JSON.parse(measuresCombinedString);
                let measuresCombined = this.downloadService.joinComponentsANDProjectsMeasures(resProj,measuresCombinedJson);
                this.generateZipFile(measuresCombined);

              },
              err=> console.log(err)
            );
          }else{

            this.generateZipFile(resProj);

          }
        },
        err=> console.log(err)
      );
    

  }

  generateZipFile(p_projects:any){
    switch (this.exportOption) {
      case 'json':
          
          this.downloadService.generateJsonFile(p_projects);

      break;
  
      case 'xml':               
          
          this.downloadService.generateXmlFile(p_projects);

      break;

      case 'csv':
      break;    
    }
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
