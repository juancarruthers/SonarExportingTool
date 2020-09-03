import { ProjectsService } from '../../../../services/projects/projects.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Project } from '../../../../classes/APIRequest/project';
import { SweetAlert } from '../../sweetAlert/sweetAlert';
import { SweetAlertIcon } from 'sweetalert2';
import { SearchBoxComponent } from '../../search-bar/search-box.component';
import { PaginatorComponent } from '../../paginator/paginator.component';

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

    //pagination
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  
    constructor( private projectsService: ProjectsService, private cdr: ChangeDetectorRef) {
      this.projects = [];
      this.allProjects = [];
      this.projectsChanged = [];
    }
  
    ngOnInit(): void {
      this.projectsService.getProjects()
        .subscribe(
          res=> {
            this.allProjects = res;
            this.paginator.setPagination(this.allProjects);
            this.showMore();
          },
          err => {
            if (err.statusText == "Unknown Error"){
              console.log("Disconnected from the database");
            }else{
              console.log(err);
            }
          }
        )
    }

    addProject(p_idproject: number){
      let link = (document.getElementById('inpLink' + p_idproject) as HTMLInputElement).value;
      let version = (document.getElementById('inpVersion' + p_idproject) as HTMLInputElement).value;
      let index = this.allProjects.findIndex(proj => proj.idproject == p_idproject);      
      if (this.projectsChanged.indexOf(p_idproject) == -1){
        this.projectsChanged.push(p_idproject);      
      }
      this.allProjects[index].projectLink = link;
      this.allProjects[index].version = version;
    }

    saveChanges(){
      let changes : string [][] = [];
      for (const id of this.projectsChanged) {
        let index = this.allProjects.findIndex(proj => proj.idproject == id);
        let change = [this.allProjects[index].projectLink, this.allProjects[index].version, id+''];
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
    if (this.paginator.topReached()){
      this.projects.sort((a, b) => this.searchBox.sortByProperty(a[property], b[property]));
    }else{  
      //pagination  
      this.paginator.elements.sort((a, b) => this.searchBox.sortByProperty(a[property], b[property]));
      this.showMore();
    }
  }

  searchBoxChanges(): void {
    this.projects = this.searchBox.searchBoxChanges(this.allProjects);
    //pagination
    this.paginator.setPagination(this.projects);
    this.showMore(); 
  }

  showMore(): void{     
    this.projects = this.paginator.showMore();
  }

}
