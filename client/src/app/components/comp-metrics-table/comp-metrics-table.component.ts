import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { ProjectsService } from '../../services/projects/projects.service';
import { Metric } from 'src/app/classes/APIRequest/metric';
import { SearchBoxComponent } from '../search-bar/search-box.component';

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

  constructor(private projectsService: ProjectsService, private cdr: ChangeDetectorRef) { 
    this.metrics = []
  }

  ngAfterViewInit(): void{

    //To sort elements
    this.searchBox.comboBox = [{'value' : 'domain', 'text' : 'Domain'}, {'value' : 'name', 'text':'Name'}, {'value' : 'type', 'text':'Type'}];
    this.searchBox.orderComboBox = 'asc';
    this.searchBox.sortProperty = 'domain';

    this.exportModal.title = "Export Components' Measures";
    this.exportModal.exportOption = '';
    this.cdr.detectChanges();

  }

  ngOnInit(): void {   
    this.projectsService.getComponentMetrics()
      .subscribe(
        res=> {
          this.metrics = res;
          this.allMetrics = this.metrics;
        },
        err=> console.log(err)
      )
      
    this.projectsExported = this.projectsService.getExportedProjects();
    this.projMetricsExported = this.projectsService.getExportedProjectsMetrics();
    if (this.projMetricsExported.length == 0){
      window.location.href = '';
    }else{
      this.compMetricsExported = new Array<number>();
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
    this.metrics.sort((a, b) => this.searchBox.sortByProperty(a[property], b[property]));
  }

  searchBoxChanges(): void {
    this.metrics = this.searchBox.searchBoxChanges(this.allMetrics);
    let idMetrics = this.metrics.map(met => met.idmetric);
    idMetrics = this.compMetricsExported.filter(id => idMetrics.includes(id));
    setTimeout(() => { this.searchBox.checkSelected(idMetrics); }, 10);
    
  }

}
