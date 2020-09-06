import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  private content: string;
  //Sort
  @Output() sortedContent: EventEmitter<string> = new EventEmitter<string>();
  @Input() public sortComboBox:Object[];
  @Input() public sortProperty: string;
  //desc or asc
  @Input() public orderComboBox: string;

  //Search
  @Output() assignedContent: EventEmitter<string> = new EventEmitter<string>();
  @Input() public searchComboBox:Object[];
  @Input() public searchProperty: string;

  constructor() { 
    this.content = '';
  }

  ngOnInit(): void {
  }

  //Sort

  sortContent(p_value: string){
    this.sortProperty = p_value;
    this.sortedContent.emit();
  }

  sortByProperty(a:any, b:any){
    if (typeof(a) == 'string'){
      a = a.toUpperCase();
      b = b.toUpperCase();
    }
    let returnValue = 1;  
    if (this.orderComboBox == 'desc'){
      returnValue = -1;
    }
  
    if(a > b)  
      return 1 * returnValue;  
    else if(a < b)  
      return -1 * returnValue;  

    return 0;  
      
  }

  changeDirection(){
    if (this.orderComboBox == 'desc') {
      this.orderComboBox = 'asc';
      document.getElementById('sortIcon').textContent='<em class="fas fa-sort-amount-down-alt"></em>';
    }else{
      this.orderComboBox = 'desc';
      document.getElementById('sortIcon').textContent='<em class="fas fa-sort-amount-down"></em> ';
    }
    this.sortContent(this.sortProperty);
  }

  //Search

  assignContent(): void{
    this.content = (document.getElementById('searchedText') as HTMLInputElement).value;
    this.assignedContent.emit();
  }

  searchBoxChanges(p_set: any[]): any[] {
    let value = this.content.toLocaleLowerCase();
    let results = p_set;
    if(value != ''){
      results = results.filter(item => item[this.searchProperty].toLocaleLowerCase().startsWith(value));
    }
    results.sort((a, b) => this.sortByProperty(a[this.sortProperty], b[this.sortProperty]));
    return results;

  }

  checkSelected(p_setSelected: number[]){
    for (let element of p_setSelected) {
      let checkBox = document.getElementById('checkbox'+ element) as HTMLInputElement;
      checkBox.checked = true;

    }
  }

  getContent():string {
    return this.content;
  }

  clearTextBox(){
    (document.getElementById('searchedText') as HTMLInputElement).value = '';
  }

  searchContent(p_value: string){
    this.searchProperty = p_value;
    this.assignedContent.emit();
  }

}
