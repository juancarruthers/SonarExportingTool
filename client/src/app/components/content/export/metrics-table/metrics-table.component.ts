import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ProjectsService }  from '../../../../services/projects/projects.service';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { TwoOptionModalComponent } from '../two-option-modal/two-option-modal.component';
import { Metric } from '../../../../classes/APIRequest/metric';
import { SearchBoxComponent } from '../../search-bar/search-box.component';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-metrics-table',
  templateUrl: './metrics-table.component.html',
  styleUrls: ['./metrics-table.component.scss']
})
export class MetricsTableComponent implements OnInit {

  //Suscribe
  metrics: Metric[] = [];

  //Arguments for the API Request
  projectsExported: number[];
  metricsExported: number[];

  //Childs of this component
  @ViewChild(ExportModalComponent) exportModal:ExportModalComponent;
  @ViewChild(TwoOptionModalComponent) twoOptionModal:TwoOptionModalComponent;

  //To sort the elements
  allMetrics: Metric[];
  @ViewChild(SearchBoxComponent) searchBox: SearchBoxComponent;

  //pagination
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  constructor(private projectsService: ProjectsService, private cdr: ChangeDetectorRef, private router: Router) { 
    this.metrics = []
  }

  ngAfterViewInit(): void {

    //To sort elements
    this.searchBox.comboBox = [{'value' : 'domain', 'text' : 'Domain'}, {'value' : 'name', 'text':'Name'}, {'value' : 'type', 'text':'Type'}];
    this.searchBox.orderComboBox = 'asc';
    this.searchBox.sortProperty = 'domain';

    this.twoOptionModal.title = 'Export Components Measures';
    this.twoOptionModal.description = 'Would you like to export the components measures also?'
    this.twoOptionModal.yesUrl = '/projects/components/metrics';
    this.exportModal.title = "Export Project's Measures";
    this.exportModal.exportOption = '';
    this.cdr.detectChanges();

  }

  ngOnInit(): void { 

    this.projectsExported = this.projectsService.getExportedProjects();
    if (this.projectsExported.length == 0){
      this.router.navigateByUrl('/projects');
    }else{ 

      this.projectsService.getProjectMetrics()
        .subscribe(
          res=> {
            this.allMetrics = res;
            this.paginator.setPagination(this.allMetrics);
            let exportedMet = this.projectsService.getExportedProjectsMetrics();
            if (exportedMet.length == 0){
              this.metricsExported = new Array<number>();
            }else{
              this.metricsExported = exportedMet;
            }
            this.showMore();
          },
          err=> console.log(err)
        );
    }
  }

  ngOnDestroy():void{
  
    this.projectsService.setExportedProjectsMetrics(this.metricsExported);
    
  }

  checkElement(p_checked: boolean, p_idmetric: number): void{

    if (p_checked) {

      this.metricsExported.push(p_idmetric);

    }else{   

      this.metricsExported = this.metricsExported.filter(obj => obj != p_idmetric);

    }

  }

  checkAll(p_checked: boolean): void{

    for(let id of this.metrics){ 
      let checkBox = document.getElementById('checkbox'+ id.idmetric) as HTMLInputElement; 
      if (checkBox.checked != p_checked){
        checkBox.click();
      }
    }
    if(this.metricsExported.length != this.allMetrics.length){
      (document.getElementById('checkAll') as HTMLInputElement).checked = false;
    }
 }

  export(): void{
    this.exportModal.projectsExported = this.projectsExported;
    this.exportModal.projMetricsExported = this.metricsExported;
    this.exportModal.compMetricsExported = [0];
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
    idMetrics = this.metricsExported.filter(id => idMetrics.includes(id));
    setTimeout(() => { this.searchBox.checkSelected(idMetrics); }, 10);
  }

}
