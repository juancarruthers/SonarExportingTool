import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analyze-projects',
  templateUrl: './analyze-projects.component.html',
  styleUrls: ['./analyze-projects.component.scss']
})
export class AnalyzeProjectsComponent implements OnInit {

  sonar_scanner_download = '../../../../assets/images/analyze-projects/sonar-scanner.png';  
  move_scanner = '../../../../assets/gifs/analyze-projects/move-scanner.gif';
  properties_file = '../../../../assets/gifs/analyze-projects/properties-file.gif';
  script_execution = '../../../../assets/images/analyze-projects/script-execution.png';

  loading = '../../../../assets/gifs/analyze-projects/loading.gif';

  constructor() { }

  ngOnInit(): void {
  }

}
