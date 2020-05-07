import { ProjectsService } from './../../../services/projects/projects.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-projects-tab',
  templateUrl: './update-projects-tab.component.html',
  styleUrls: ['./update-projects-tab.component.css']
})
export class UpdateProjectsTabComponent implements OnInit {

  response: string;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
  }

  updateProjects(){
    this.projectsService.updateProjects([0,14400]).subscribe();
    
  }

}
