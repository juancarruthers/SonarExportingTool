import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-option-modal',
  templateUrl: './two-option-modal.component.html',
  styleUrls: ['./two-option-modal.component.scss']
})
export class TwoOptionModalComponent implements OnInit {

  title: string;
  description: string;

  constructor() { }

  ngOnInit(): void {
  }

}
