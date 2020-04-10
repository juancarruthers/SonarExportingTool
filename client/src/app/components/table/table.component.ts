import { ProjectsService } from './../../services/projects.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ExportModalComponent } from '../export-modal/export-modal.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  projects: any = [];
  projectsExported: number[];
  @ViewChild(ExportModalComponent) exportModal:ExportModalComponent;
  


  constructor( private projectsService: ProjectsService, private cdr: ChangeDetectorRef ) { 
    
  }

  ngAfterViewInit() {

    this.exportModal.title = 'Export Measures';
    this.exportModal.description = 'Select the data format for the report';
    this.exportModal.radioOptions = ['json','xml','csv'];
    this.exportModal.exportOption = '';
    this.cdr.detectChanges();

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

 export(){
   this.exportModal.projectsExported = this.projectsExported;
 }

 /*sweetAlert(){

  const inputOptions = Swal.mixin({
    customClass: {
      'json': 'json',
      'xml': 'xml'
    }
  })
  
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Export',
    text: "What type of file",
    icon: 'question',
    showCancelButton: true,
    input: 'radio',
    inputOptions: inputOptions,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      swalWithBootstrapButtons.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    } else if (
      
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error'
      )
    }
  })
 }*/

}
