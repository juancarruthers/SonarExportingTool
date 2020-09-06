import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-two-option-modal',
  templateUrl: './two-option-modal.component.html',
  styleUrls: ['./two-option-modal.component.scss']
})
export class TwoOptionModalComponent implements OnInit {

  @Input() title: string;
  @Input() description: string;
  @Input() yesUrl: string;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  yesOption(): void{
    this.router.navigateByUrl(this.yesUrl);
  }

}
