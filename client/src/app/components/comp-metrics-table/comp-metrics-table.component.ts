import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { ProjectsService } from '../../services/projects.service';
import { Metric } from 'src/app/classes/APIRequest/metric';

@Component({
  selector: 'app-comp-metrics-table',
  templateUrl: './comp-metrics-table.component.html',
  styleUrls: ['./comp-metrics-table.component.css']
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

  constructor(private projectsService: ProjectsService, private cdr: ChangeDetectorRef) { 
    
  }

  ngAfterViewInit() {

    this.exportModal.title = "Export Components' Measures";
    this.exportModal.exportOption = '';
    this.cdr.detectChanges();

  }

  ngOnInit(): void {   
    this.projectsService.getComponentMetrics()
      .subscribe(
        res=> {
          this.metrics = res;
        },
        err=> console.log(err)
      )
    this.projectsExported = this.projectsService.getExportedProjects();
    this.projMetricsExported = this.projectsService.getExportedProjectsMetrics();
    if (this.projMetricsExported.length == 0){
      window.location.href = '';
    }
    this.compMetricsExported = new Array<number>();
  }

  addElement(p_checked: boolean, p_idmetric: number){

    if (p_checked) {

      this.compMetricsExported.push(p_idmetric);

    }else{   

      this.compMetricsExported = this.compMetricsExported.filter(obj => obj != p_idmetric);

    }

  }

  checkAll(){

    for(let id of this.metrics){ 

      document.getElementById('checkbox'+ id.idmetric).click(); 

    }
 }

  export(){
    this.exportModal.projectsExported = this.projectsExported;
    this.exportModal.projMetricsExported = this.projMetricsExported;
    this.exportModal.compMetricsExported = this.compMetricsExported;
  }

}
