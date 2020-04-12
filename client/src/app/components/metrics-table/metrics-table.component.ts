import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ProjectsService }  from '../../services/projects.service';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { TwoOptionModalComponent } from '../two-option-modal/two-option-modal.component';

@Component({
  selector: 'app-metrics-table',
  templateUrl: './metrics-table.component.html',
  styleUrls: ['./metrics-table.component.css']
})
export class MetricsTableComponent implements OnInit {

  metrics: any = [];
  projectsExported: number[];
  metricsExported: number[];
  @ViewChild(ExportModalComponent) exportModal:ExportModalComponent;
  @ViewChild(TwoOptionModalComponent) twoOptionModal:TwoOptionModalComponent;

  constructor(private projectsService: ProjectsService, private cdr: ChangeDetectorRef) { 
    
  }

  ngAfterViewInit() {

    this.twoOptionModal.title = 'Export Components Measures';
    this.twoOptionModal.description = 'Would you like to export the components measures also?'
    this.exportModal.title = 'Export Measures';
    this.exportModal.description = 'Select the data format for the report';
    this.exportModal.radioOptions = ['json','xml','csv'];
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

  addElement(p_checked: boolean, p_idmetric: number){

    if (p_checked) {

      this.metricsExported.push(p_idmetric);

    }else{   

      this.metricsExported = this.metricsExported.filter(obj => obj != p_idmetric);

    }

  }

  checkAll(p_checked: boolean){

    let event = new MouseEvent('click', {
      'view': window,
      'bubbles': p_checked
    });  

    for(let id of this.metrics){ 
      var cb = document.getElementById('checkbox'+ id.idmetric); 
      cb.dispatchEvent(event);
    }
 }

  export(){
    this.exportModal.projectsExported = this.projectsExported;
    this.exportModal.projMetricsExported = this.metricsExported;
    this.exportModal.compMetricsExported = [0];
  }

}
