import { ProjectsService } from './../../../services/projects/projects.service';
import { Component, OnInit} from '@angular/core';
import { Project } from '../../../classes/APIRequest/project';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  projects: Project[];
  counter: number[];

  constructor(private projectService :ProjectsService) {
    this.projects = [];
    this.counter = [0,1,2,3];
    
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(
      projects => {  
        let projIds: number[] = []; 
        const total = projects.length - 1; 
        let rand : number = -1;  
        for (let i = 0; i < 12; i++) {
          while ((rand == -1) || (projIds.includes(rand))){
            rand = Math.random() * total;
            rand = Math.round(rand) + 1;
          }
          projIds.push(rand);
          rand = -1;
        }
        this.projectService.getProjectsMeasures(projIds, [310, 306, 308, 34, 55, 26]).subscribe(
          projMeasures => {                 
            this.projects = projMeasures;                             
          }
        )
      }
    );   
  }

}
