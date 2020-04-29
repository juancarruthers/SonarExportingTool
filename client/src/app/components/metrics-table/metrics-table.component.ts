import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ProjectsService }  from '../../services/projects/projects.service';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { TwoOptionModalComponent } from '../two-option-modal/two-option-modal.component';
import { Metric } from '../../classes/APIRequest/metric';

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

  constructor(private projectsService: ProjectsService, private cdr: ChangeDetectorRef) { 
    
  }

  ngAfterViewInit(): void {

    this.twoOptionModal.title = 'Export Components Measures';
    this.twoOptionModal.description = 'Would you like to export the components measures also?'
    this.exportModal.title = "Export Project's Measures";
    this.exportModal.exportOption = '';
    this.cdr.detectChanges();

  }

  ngOnInit(): void {   
    this.projectsService.getProjectMetrics()
      .subscribe(
        res=> {
          this.metrics = res;
        },
        err=> console.log(err)
      )
    this.projectsExported = this.projectsService.getExportedProjects();
    if (this.projectsExported.length == 0){
      window.location.href = '';
    }
    this.metricsExported = new Array<number>();
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

  checkAll(): void{

    for(let id of this.metrics){ 

      document.getElementById('checkbox'+ id.idmetric).click(); 

    }
 }

  export(): void{
    this.exportModal.projectsExported = this.projectsExported;
    this.exportModal.projMetricsExported = this.metricsExported;
    this.exportModal.compMetricsExported = [0];
  }

}
