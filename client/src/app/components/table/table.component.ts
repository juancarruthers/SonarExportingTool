import { SearchBoxComponent } from './../search-bar/search-box.component';
import { ProjectsService } from './../../services/projects/projects.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Project } from '../../classes/APIRequest/project';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  //Suscribe
  projects: Project[];

  //Arguments for the API Request
  projectsExported: number[];

  //To sort the elements
  allProjects: Project[];
  @ViewChild(SearchBoxComponent) searchBox: SearchBoxComponent;

  constructor( private projectsService: ProjectsService, private cdr: ChangeDetectorRef) { 
    this.projects = [];
  }

  ngOnInit(): void {
    this.projectsService.getProjects()
      .subscribe(
        res=> {
          this.projects = res;
          this.allProjects = this.projects;

        },
        err=> console.log(err)
      )
    let exported = this.projectsService.getExportedProjects();
    if (exported.length == 0){
      this.projectsExported = new Array<number>();
    }else{
      this.projectsExported = exported;
      setTimeout(() => { this.searchBox.checkSelected(exported); }, 50);
    }
    
  }

  ngOnDestroy():void{
  
    this.projectsService.setExportedProjects(this.projectsExported);
    
  }

  checkElement(p_checked: boolean, p_idproject: number): void{

    if (p_checked) {

      this.projectsExported.push(p_idproject);

    }else{   

      this.projectsExported = this.projectsExported.filter(obj => obj != p_idproject);

    }

  }

  checkAll(p_checked: boolean): void{

    for(let id of this.projects){ 
      let checkBox = document.getElementById('checkbox'+ id.idproject) as HTMLInputElement; 
      if (checkBox.checked != p_checked){
        checkBox.click();
      }
    }
    if(this.projectsExported.length != this.allProjects.length){
      (document.getElementById('checkAll') as HTMLInputElement).checked = false;
    }
 }

 //To sort elements

  ngAfterViewInit(): void {
    this.searchBox.comboBox = [{'value' : 'lastAnalysis', 'text' : 'Last Analysis'}, {'value' : 'name', 'text':'Name'}];
    this.searchBox.orderComboBox = 'desc';
    this.searchBox.sortProperty = 'lastAnalysis';
    this.cdr.detectChanges();
  }

  sortContent(): void{
    let property = this.searchBox.sortProperty;
    this.projects.sort((a, b) => this.searchBox.sortByProperty(a[property], b[property]));
  }

  searchBoxChanges(): void {
    this.projects = this.searchBox.searchBoxChanges(this.allProjects);
    let idProjects = this.projects.map(proj => proj.idproject);
    idProjects = this.projectsExported.filter(id => idProjects.includes(id));
    setTimeout(() => { this.searchBox.checkSelected(idProjects); }, 10);
    
  }

}
