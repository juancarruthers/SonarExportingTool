import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-counter',
  templateUrl: './card-counter.component.html',
  styleUrls: ['./card-counter.component.css']
})
export class CardCounterComponent implements OnInit {

  @Input() counter: string;
  @Input() text: string;
  @Input() image: string;

  constructor() { 
    this.counter = "";
    this.text = "";
    this.image = "";
  }

  ngOnInit(): void {
  }

}
