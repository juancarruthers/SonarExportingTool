import { Router } from '@angular/router';
import { ProjectsService } from './../../../services/projects/projects.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Project } from '../../../classes/APIRequest/project';
import { SweetAlert } from '../../sweetAlert/sweetAlert';
import { SweetAlertIcon } from 'sweetalert2';
import { SearchBoxComponent } from '../../search-bar/search-box.component';

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

    //To sort the elements
    allProjects: Project[];
    @ViewChild(SearchBoxComponent) searchBox: SearchBoxComponent;
  
    constructor( private projectsService: ProjectsService, private cdr: ChangeDetectorRef, private router: Router ) {
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
      this.projectsChanged = new Array<number>();
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
        this.searchBox.clearTextBox();
        this.projects = this.allProjects;
        this.projectsChanged = [];
      })
      
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
    this.projectsChanged = this.projectsChanged.filter(id => idProjects.includes(id));
    
  }

}
