import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  public actualPage: number;
  public elements: any[];
  public elemPerPage: number;

  @Output()
  changePage: EventEmitter<string> = new EventEmitter<string>();

  constructor() {  
    this.elements = [];
    this.elemPerPage = 50;
  }

  ngOnInit(): void {
  }

  setPagination(p_elements: any[]): void{
    this.actualPage = 1;   
    this.elements = p_elements;
  }

  topReached(): boolean{
    if (this.actualPage * this.elemPerPage < this.elements.length){
      return false;
    }else{
      return true;
    }
  }

  pageChanged (): void{
    this.actualPage = this.actualPage + 1;
    this.changePage.emit();
  }

  showMore(): any[]{
    const lastElement = this.actualPage * this.elemPerPage;
    const newPage = this.elements.slice(0, lastElement);
    return newPage;
  }


}
