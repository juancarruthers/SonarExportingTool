
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { ProjectsService } from '../../services/projects.service';
import { forkJoin } from 'rxjs';

import { SweetAlert } from '../sweetAlert';
import { CompMeasPreparation } from './../../classes/comp-meas-preparation';
import { Download } from '../../classes/download';

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
  projMetricsExported: number[];
  compMetricsExported: number[];
  progressModal: SweetAlert;
  download: Download;
  prepare: CompMeasPreparation;
  @ViewChild(AlertComponent) alert:AlertComponent;
  

  constructor(private projectsService: ProjectsService) {}

  

  ngOnInit(): void {
    
  }
  /*
  -->>Validation Functions
  */

  selectRadio(p_radio: string): void{
    this.exportOption = p_radio;
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

  validateExport(): void{
    let flag: boolean = false;
    if (this.exportOption != '') {

      flag = this.validProjMetricsSelected(flag);
      flag = this.validCompMetricsSelected(flag);

      if (flag){

        this.validateNumberOfComponentMeasures();
 
      }else{

        this.alert.text = 'Select the metric/s to export!';
        this.alert.bootstrapColor = 'danger';
        this.alert.showAlert();
      }
   }else{
      this.alert.text = 'Choose a data format!';
      this.alert.bootstrapColor = 'danger';
      this.alert.showAlert();
   }
  }

  validateNumberOfComponentMeasures(): void{
    this.projectsService.getNumberComponentsMeasures(this.projectsExported, this.compMetricsExported)
      .subscribe(
        res=> { 
          if ((this.compMetricsExported[0] == 0)||(res[0]['count'] <= 3000000)){ 

            this.export();
            this.alert.closeAlert();

          }else{  

            this.alert.text = 'You cannot export more than 3 million measures at once! You tried to export: ' + res[0]['count'] + " components' metrics" ;
            this.alert.bootstrapColor = 'danger';
            this.alert.showAlert();
              
          }              
        },
        err => console.log(err),
      )   
  }



   /*
  -->>Export Functions
  */

  export(): void{
    this.download = new Download();
    this.progressModal = new SweetAlert();
    this.progressModal.onLoad();
    this.progressModal.update("Requesting for the Measures");  
    
    this.projectsService.getProjectsMeasures(this.projectsExported, this.projMetricsExported)
      .subscribe(
        resProj=> {
          
          if (this.compMetricsExported[0] != 0) {

            this.exportComponentMeasures(resProj);
            
          }else{

            this.generateZipFile(resProj);

          }
        },
        err=> console.log(err)
      );
    

  }

  exportComponentMeasures(p_projectsMeasures: any): void{
    
    forkJoin(this.projectsService.makeMultipleRequest(this.projectsExported, this.compMetricsExported))
      .subscribe(
        resComp => {
          try {
          
            this.progressModal.update("Setting the components' measures ready for merging"); 
            this.prepare = new CompMeasPreparation;
            let measuresCombinedJson = this.prepare.prepareDataFromCompMeasRequest(resComp);
    
            this.progressModal.update("Merging the components' measures with projects");  
            let measuresCombined = this.prepare.joinComponentsANDProjectsMeasures(p_projectsMeasures,measuresCombinedJson);

            this.generateZipFile(measuresCombined);
            
        
          } catch (error) {
            this.progressModal.close();
            this.progressModal.error(error);
          }

        }
      );
    
  }

  generateZipFile(p_projects:any): void{
      
    switch (this.exportOption) {
      case 'json':
          
          this.download.generateJsonFile(p_projects, this.progressModal);

      break;
  
      case 'xml':               
          
          this.download.generateXmlFile(p_projects, this.progressModal);

      break;

      case 'csv':
      break;    
    }

    this.progressModal.update("Generating the zip file with the results");
    this.download.zipFile(this.progressModal); 
    
  }

}
