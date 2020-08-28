import { numericAnimator } from './../../classes/numeric-values-animator';
import { ProjectsService } from './../../services/projects/projects.service';
import { Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  tempArray: string[];
  arrayOfCounts : string[];
  private viewed : boolean;
  private initiated : boolean;
  


  @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
      let max = document.getElementById("count").offsetTop;
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
      if((pos > max )&&(!this.viewed)&&(this.initiated)){
        this.viewed = true;

        this.arrayOfCounts[0] = this.tempArray["projects"];
        numericAnimator.animateValue(this.arrayOfCounts, 0);
        this.arrayOfCounts[1] = this.tempArray["components"];
        numericAnimator.animateValue(this.arrayOfCounts, 1);
        this.arrayOfCounts[2] = this.tempArray["projMeasures"];
        numericAnimator.animateValue(this.arrayOfCounts, 2);
        this.arrayOfCounts[3] = this.tempArray["compMeasures"];
        numericAnimator.animateValue(this.arrayOfCounts, 3);
      }
    }

  constructor(private projectService: ProjectsService) {
    this.arrayOfCounts = ["0","0","0","0"];
    this.viewed = false;
    this.initiated = false;
  }
  


  ngOnInit(): void {
    this.projectService.getStartPageInfo().subscribe(
      res => { 
        this.tempArray = res;      
        this.initiated = true;
        this.onWindowScroll();
      }
    )

  }


  

}
