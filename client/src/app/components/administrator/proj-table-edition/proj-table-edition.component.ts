import { ProjectsService } from './../../../services/projects/projects.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../../classes/APIRequest/project';

@Component({
  selector: 'app-proj-table-edition',
  templateUrl: './proj-table-edition.component.html',
  styleUrls: ['./proj-table-edition.component.css']
})
export class ProjTableEditionComponent implements OnInit {

    //Suscribe
    projects: Project[];

    //Arguments for the API Request
    projectsExported: number[];

    responseJson: string;
  
    constructor( private projectsService: ProjectsService) { 
      
    }
  
    ngOnInit(): void {
      this.projectsService.getProjects()
        .subscribe(
          res=> {
            this.projects = res;
          },
          err=> console.log(err)
        )
      this.projectsExported = new Array<number>();
    }
  
    ngOnDestroy():void{
    
      this.projectsService.setExportedProjects(this.projectsExported);
      
    }


    pingApi() {
      this.projectsService.prueba().subscribe(
        res => this.responseJson = res
      );
    }

}
