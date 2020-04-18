import { ProjectsService } from './../../services/projects.service';
import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/classes/APIRequest/project';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  //Suscribe
  projects: Project[];

  //Arguments for the API Request
  projectsExported: number[];

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

  addElement(p_checked: boolean, p_idproject: number){

    if (p_checked) {

      this.projectsExported.push(p_idproject);

    }else{   

      this.projectsExported = this.projectsExported.filter(obj => obj != p_idproject);

    }

  }

  checkAll(){

    for(let id of this.projects){ 

      document.getElementById('checkbox'+ id.idproject).click(); 

    }
 }

}
