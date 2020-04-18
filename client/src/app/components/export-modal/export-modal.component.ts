
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
import { ProjectsService } from '../../services/projects.service';
import { forkJoin } from 'rxjs';

import { SweetAlert } from '../sweetAlert';
import { Download } from '../../classes/download';
import { Project } from 'src/app/classes/APIRequest/project';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.css']
})
export class ExportModalComponent implements OnInit {

  //Title of the Modal
  title: string;

  //Options Available for export
  radioOptions: string[];
  exportOption: string;

  //Arguments for the API Request
  projectsExported: number[];
  projMetricsExported: number[];
  compMetricsExported: number[];

  //Pogress Modal Component implemented with Sweet Alert 2 library
  progressModal: SweetAlert;

  //Classes to prepare and download the requested export
  download: Download;

  //Child Component
  @ViewChild(AlertComponent) alert:AlertComponent;
  

  constructor(private projectsService: ProjectsService) {}

  

  ngOnInit(): void {

    this.radioOptions = ['json','xml','csv'];
    
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
        numberComponents => { 
          if ((this.compMetricsExported[0] == 0)||(numberComponents <= 3000000)){ 

            this.export();
            this.alert.closeAlert();

          }else{  

            this.alert.text = 'You cannot export more than 3 million measures at once! You tried to export: ' + numberComponents + " components' measures" ;
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
        projectsMeasures => {
          
          if (this.compMetricsExported[0] != 0) {

            this.exportComponentMeasures(projectsMeasures);
            
          }else{

            this.generateZipFile(projectsMeasures);

          }
        },
        err=> console.log(err)
      );
    

  }

  exportComponentMeasures(p_projectsMeasures: Project[]): void{
    
    forkJoin(this.projectsService.makeMultipleRequest(this.projectsExported, this.compMetricsExported))
      .subscribe(
        componentsMeasures => {
          try {
             
            this.progressModal.update("Merging the components' measures with projects");              

            for (let i = 0; i < p_projectsMeasures.length; i++) {
              p_projectsMeasures[i].component = componentsMeasures[i];
              
            }

            this.generateZipFile(p_projectsMeasures);
            
        
          } catch (error) {
            this.progressModal.close();
            this.progressModal.error(error);
          }

        }
      );
    
  }

  generateZipFile(p_projects: Project[]): void{

    this.progressModal.update("Generating " + this.exportOption.toUpperCase + " files with project's measures");
      
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
