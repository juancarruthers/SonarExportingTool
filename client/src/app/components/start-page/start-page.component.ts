import { ProjectsService } from './../../services/projects/projects.service';
import { Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  arrayOfCounts : number[];
  arrayOfLetters : string[];
  private viewed : boolean;
  private initiated : boolean;

  @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
      let max = document.getElementById("count").offsetTop;
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
      if((pos > max )&&(!this.viewed)&&(this.initiated)){
        this.viewed = true;
        this.animateValue(0);
        this.animateValue(1);
        this.animateValue(2);
        this.animateValue(3);
      }
    }

  constructor(private projectService: ProjectsService) {
    this.arrayOfCounts = [0,0,0,0];
    this.arrayOfLetters = ["","","",""];
    this.viewed = false;
    this.initiated = false;
  }
  


  ngOnInit(): void {
    this.projectService.getStartPageInfo().subscribe(
      res => {       
        this.arrayOfCounts[0] = res["projects"];
        this.arrayOfCounts[1] = res["components"];
        this.arrayOfCounts[2] = res["projMeasures"];
        this.arrayOfCounts[3] = res["compMeasures"];
        this.initiated = true;
        this.onWindowScroll();
      }
    )
  }

  private animateValue(position: number) {
    let top = this.arrayOfCounts[position];

    if ((top >= 1000)&&(top < 1000000)){
      this.arrayOfLetters[position] = "K";
      top = Math.floor(top / 1000);
    }else if ((top >= 1000000)&&(top < 1000000000 )) {
      this.arrayOfLetters[position] = "M";
      top = Math.floor(top / 1000000);
    }else if (top >= 1000000000){
      this.arrayOfLetters[position] = "B";
      top = Math.floor(top / 1000000000);
    }

    let coc : number;
    if (top >= 250){
      coc = -60;
    }else if (top >= 100) {
      coc = -30;
    } else if (top >= 50) {
      coc = -20;
    } else {
      coc = -10;
    }

    const duration = ((top - 999)/(coc)) + 1;

    this.arrayOfCounts[position] = 0;
    let intervalId = setInterval(() => {
      this.arrayOfCounts[position] = this.arrayOfCounts[position] + 1;
      if(this.arrayOfCounts[position] >= top){
        clearInterval(intervalId);
      }
    }, duration);
    
    
  }

}
