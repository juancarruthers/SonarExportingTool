import { ProjectsService } from './../../../services/projects/projects.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../../classes/APIRequest/project';
import { SweetAlert } from '../../sweetAlert/sweetAlert';
import { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-proj-table-edition',
  templateUrl: './proj-table-edition.component.html',
  styleUrls: ['./proj-table-edition.component.css']
})
export class ProjTableEditionComponent implements OnInit {

    //Suscribe
    projects: Project[];

    //Arguments for the API Request
    projectsChanged: number[];

  
    constructor( private projectsService: ProjectsService ) {
    }
  
    ngOnInit(): void {
      this.projectsService.getProjects()
        .subscribe(
          res=> {
            this.projects = res;
          },
          err=> console.log(err)
        )
      this.projectsChanged = new Array<number>();
    }

    ngOnChanges(): void{
      //this.ngOnInit();
    }

    addProject(p_idproject: number){
      if (this.projectsChanged.indexOf(p_idproject) == -1){
        this.projectsChanged.push(p_idproject);
      }
    }

    saveChanges(){
      let changes : string [][] = [];
      for (let i = 0; i < this.projectsChanged.length; i++) {
        let link = (document.getElementById('inpLink' + this.projectsChanged[i]) as HTMLInputElement).value;
        let version = (document.getElementById('inpVersion' + this.projectsChanged[i]) as HTMLInputElement).value;
        let change = [link, version, this.projectsChanged[i]+''];
        changes.push(change);
      }
      this.projectsService.editProjects(changes)
      .subscribe((response) => {
        let alert = new SweetAlert();
        let result : SweetAlertIcon;
        if (response.includes('success')){
          result = 'success';
        }else{
          result = 'error';
        }
        alert.completed(response, result);
        //this.router.navigateByUrl('/projects/edit');
      })
      
    }

}
