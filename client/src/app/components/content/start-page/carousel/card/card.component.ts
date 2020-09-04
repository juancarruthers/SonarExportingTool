import { numericAnimator } from '../../../../../classes/numeric-values-animator';
import { Project } from '../../../../../classes/APIRequest/project';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Measure } from '../../../../../classes/APIRequest/measure';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() project: Project;
  realValues: Measure[];
  viewed: boolean;
  initiated: boolean;
  
  @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
      let max = document.getElementById("carousel-component").offsetTop;
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
      if((pos > max )&&(!this.viewed)&&(this.initiated)){
        this.viewed = true;
        this.interchangeValuesMeasures(this.realValues, this.project.project_measure);
        this.animateValues();
      }
    }

  constructor(private router: Router) { 
    this.viewed = false;
    this.initiated = false;
    this.realValues = [{value: "0"}, {value: "0"}, {value: "0"}, {value: "0"}, {value: "0"}, {value: "0"}, {value: "0"}, {value: "0"}];
  }

  ngOnInit(): void {
    this.interchangeValuesMeasures(this.realValues, this.project.project_measure);
    this.initiated = true;   
    document.getElementById("slide0").classList.add("active");
    this.onWindowScroll();
  }

  animateValues():void{
    for (const measure of this.project.project_measure) {
      numericAnimator.animateValue(measure,"value");
    }
  }

  interchangeValuesMeasures(measures1: Measure[], measures2: Measure[]): void{
    let value: string;
    for (let i = 0; i < measures2.length; i++) {
      value = measures2[i].value;
      measures2[i].value = measures1[i].value;
      measures1[i].value = value;
    }
  }
}
