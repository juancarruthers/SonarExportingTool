import { ProjectsService } from './../../../../services/projects/projects.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  port: number;
  time: number;

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
  }

  update(){
    this.projectsService.updateProjects([this.port,this.time]).subscribe();
  }
}
