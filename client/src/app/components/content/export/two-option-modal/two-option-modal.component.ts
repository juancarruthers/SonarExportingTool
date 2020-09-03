import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-option-modal',
  templateUrl: './two-option-modal.component.html',
  styleUrls: ['./two-option-modal.component.scss']
})
export class TwoOptionModalComponent implements OnInit {

  title: string;
  description: string;
  yesUrl: string;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  yesOption(): void{
    this.router.navigateByUrl(this.yesUrl);
  }

}
