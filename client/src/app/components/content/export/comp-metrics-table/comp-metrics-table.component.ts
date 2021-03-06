import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { ProjectsService } from '../../../../services/projects/projects.service';
import { Metric } from 'src/app/classes/APIRequest/metric';
import { SearchBoxComponent } from '../../search-bar/search-box.component';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comp-metrics-table',
  templateUrl: './comp-metrics-table.component.html',
  styleUrls: ['./comp-metrics-table.component.scss']
})
export class CompMetricsTableComponent implements OnInit {

  //Suscribe
  metrics: Metric [];

  //Arguments for the API Request
  projectsExported: number[];
  projMetricsExported: number[];
  compMetricsExported: number[];

  //Child of this component
  @ViewChild(ExportModalComponent) exportModal:ExportModalComponent;

  //To sort the elements
  allMetrics: Metric[];
  @ViewChild(SearchBoxComponent) searchBox: SearchBoxComponent;

  //pagination
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  constructor(private projectsService: ProjectsService, private router: Router) { 
    this.metrics = []
  }


  ngOnInit(): void {   

    this.projectsExported = this.projectsService.getExportedProjects();
    this.projMetricsExported = this.projectsService.getExportedProjectsMetrics();
    if (this.projMetricsExported.length == 0){
      this.router.navigateByUrl('/projects/metrics');
    }else{
      
      this.projectsService.getComponentMetrics()
        .subscribe(
          res=> {
            this.allMetrics = res;
            this.paginator.setPagination(this.allMetrics);
            this.compMetricsExported = new Array<number>();
            this.showMore();
          },
          err=> console.log(err)
        );
      
    }
    
  }

  checkElement(p_checked: boolean, p_idmetric: number): void{

    if (p_checked) {

      this.compMetricsExported.push(p_idmetric);

    }else{   

      this.compMetricsExported = this.compMetricsExported.filter(obj => obj != p_idmetric);

    }

  }

  checkAll(p_checked: boolean): void{

    for(let id of this.metrics){ 
      let checkBox = document.getElementById('checkbox'+ id.idmetric) as HTMLInputElement; 
      if (checkBox.checked != p_checked){
        checkBox.click();
      }
    }
    if(this.compMetricsExported.length != this.allMetrics.length){
      (document.getElementById('checkAll') as HTMLInputElement).checked = false;
    }

 }

  export(): void{
    this.exportModal.projectsExported = this.projectsExported;
    this.exportModal.projMetricsExported = this.projMetricsExported;
    this.exportModal.compMetricsExported = this.compMetricsExported;
  }

  //To sort elements

  sortContent(): void{
    let property = this.searchBox.sortProperty;
    if (this.paginator.topReached()){
      this.metrics.sort((a, b) => this.searchBox.sortByProperty(a[property], b[property]));
    }else{  
      //pagination  
      this.paginator.elements.sort((a, b) => this.searchBox.sortByProperty(a[property], b[property]));
      this.showMore();
    }
  }

  searchBoxChanges(): void {
    this.metrics = this.searchBox.searchBoxChanges(this.allMetrics);
    //pagination
    this.paginator.setPagination(this.metrics);
    this.showMore();
    
  }

  //pagination

  showMore(): void{     
    this.metrics = this.paginator.showMore();
    let idMetrics = this.metrics.map(met => met.idmetric);
    idMetrics = this.compMetricsExported.filter(id => idMetrics.includes(id));
    setTimeout(() => { this.searchBox.checkSelected(idMetrics); }, 10);
  }

}
