import { ProjectsService } from './../../services/projects.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  projects: any = [];

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
      
  }

  export(){
    window.open("http://localhost:3000/api/projects/measures", "_blank");
  }

}
