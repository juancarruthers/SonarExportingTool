import { ProjectsService } from './../../services/projects.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  projects: any = [];
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

  checkAll(p_checked: boolean){

    let event = new MouseEvent('click', {
      'view': window,
      'bubbles': p_checked
    });  

    for(let id of this.projects){ 
      var cb = document.getElementById('checkbox'+ id.idproject); 
      cb.dispatchEvent(event);
    }
 }

}
