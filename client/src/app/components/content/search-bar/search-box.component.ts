import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  private content: string;
  @Output() 
  assignedContent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  sortedContent: EventEmitter<string> = new EventEmitter<string>();

  public comboBox:Object[];
  public sortProperty: string;
  //desc or asc
  public orderComboBox: string;


  constructor() { 
    this.content = '';
  }

  ngOnInit(): void {
  }

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

  assignContent(): void{
    this.content = (document.getElementById('searchedText') as HTMLInputElement).value;
    this.assignedContent.emit(/*this.content*/);
  }

  searchBoxChanges(p_set: any[]): any[] {
    let value = this.content.toLocaleLowerCase();
    let results = p_set;
    if(value != ''){
      results = results.filter(item => item.name.toLocaleLowerCase().startsWith(value));
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

}
