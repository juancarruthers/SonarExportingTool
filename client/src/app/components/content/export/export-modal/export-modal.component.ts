
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AlertComponent } from '../../alert/alert.component';
import { ProjectsService } from '../../../../services/projects/projects.service';
import { forkJoin } from 'rxjs';

import { SweetAlert } from '../../sweetAlert/sweetAlert';
import { File } from '../../../../classes/file/file';
import * as Formats from '../../../../classes/file/formats/formats';
import { Project } from '../../../../classes/APIRequest/project';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent implements OnInit {

  //Title of the Modal
  @Input() title: string;

  //Options Available for export
  radioOptions: string[];
  @Input() exportOption: string;

  //Arguments for the API Request
  projectsExported: number[];
  projMetricsExported: number[];
  compMetricsExported: number[];

  //Pogress Modal Component implemented with Sweet Alert 2 library
  progressModal: SweetAlert;

  //Classes to prepare and download the requested export
  file: File;

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

        this.progressModal = new SweetAlert();
        this.progressModal.onLoad();
        this.progressModal.update("Checking the measures to export");
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
          if ((this.compMetricsExported[0] == 0)||(numberComponents[0]['count'] <= 2000000)){ 

            this.export();
            this.alert.closeAlert();

          }else{  

            this.progressModal.close();
            this.alert.text = 'You cannot export more than 2 million measures at once! You tried to export: ' + numberComponents[0]['count'] + " components' measures" ;
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
  
    this.projectsExported.sort((a,b) => a - b);    
    
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
          
        this.file = new Formats.Json(p_projects);

      break;
  
      case 'xml':               
          
      this.file = new Formats.Xml(p_projects);

      break;

      case 'csv':

        this.file = new Formats.Csv(p_projects);

      break;    
    }
    this.file.generateOutput(this.progressModal, this.compMetricsExported[0]); 
    
  }

}
