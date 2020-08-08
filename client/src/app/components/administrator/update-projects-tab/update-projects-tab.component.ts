import { AlertComponent } from './../../alert/alert.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ProjectsService } from './../../../services/projects/projects.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SweetAlert } from '../../sweetAlert/sweetAlert';

@Component({
  selector: 'app-update-projects-tab',
  templateUrl: './update-projects-tab.component.html',
  styleUrls: ['./update-projects-tab.component.css']
})
export class UpdateProjectsTabComponent implements OnInit {
  activeTab: number;
  newProjects: string[][];
  refreshProjects: string[][];
  projects: string[][];
  loadingModal: SweetAlert;
  upMaxTime: number;
  upPort: number;
  @ViewChild(ConfirmationModalComponent) confirmModal: ConfirmationModalComponent;
  @ViewChild(AlertComponent) alert: AlertComponent;

  constructor(private projectsService: ProjectsService) { 
    this.activeTab = 1;
    this.loadingModal = new SweetAlert();
    this.projects = [];
    this.upMaxTime = 14400;
    this.upPort = 0;
    
  }

  ngOnInit(){
    this.loadingModal.onLoad();
    this.loadingModal.update("Fetching the projects to be added and updated");
    this.projectsService.getProjectsToUpdate().subscribe((response: any) => {
        
      this.newProjects = response[0];
      this.refreshProjects = response[1];
      this.projects = this.newProjects;
      this.loadingModal.close();  
    })
  }

  

  changeTab(p_numTab){
    this.activeTab = p_numTab;
    let tabNewClasses = document.getElementById('tabNew').className;
    let tabUpdateClasses = document.getElementById('tabUpdate').className;
    if (p_numTab == 1){
      if (!tabNewClasses.includes('active')){
        document.getElementById('tabUpdate').className = tabNewClasses;
        document.getElementById('tabNew').className = tabUpdateClasses;
        this.projects = this.newProjects
      }
    }else{
      if (!tabUpdateClasses.includes('active')){
        document.getElementById('tabUpdate').className = tabNewClasses;
        document.getElementById('tabNew').className = tabUpdateClasses;
        this.projects = this.refreshProjects
      }
    }
    
  }

  checkNumber(p_value : number): boolean{
    let result = true;
    
    if(p_value === null){
      
      result = false;
    }
    
    return result;
  }

  checkTime() : void{
    let result = this.checkNumber(this.upMaxTime);
    if (result){
      if (!(Number(this.upMaxTime) > 0)){
        this.upMaxTime = 14400;
      }
    }else{
      this.upMaxTime = 14400;
    }
  }

  checkPort(): void{
    let result = this.checkNumber(this.upPort);
    if (result){
      if (!((Number(this.upPort) > -1) && (Number(this.upPort) < 65536))){
        this.upPort = 0;
      }
    }else{
      this.upPort = 0;
    }
  }

  update(){
    if((this.newProjects.length > 0) || (this.refreshProjects.length > 0)){
      document.getElementById('updateButton').setAttribute('data-toggle', 'modal');
      document.getElementById('updateButton').setAttribute('data-target', '#confirmationModal');
      this.confirmModal.port = this.upPort;
      this.confirmModal.time = this.upMaxTime;
      document.getElementById('updateButton').click();
    }else{
      this.alert.text = "There are not projects to add or update in Sonar Cloud's repository";
      this.alert.bootstrapColor = 'danger';
      this.alert.showAlert();
    }
    
    
    
  }

}
