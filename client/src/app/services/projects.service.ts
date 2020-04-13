import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projMetricsExported: number[];
  projectsExported: number[]
  API_URI: string

  constructor(private http: HttpClient) { 
    this.API_URI = 'http://localhost:3000/api/projects';
  }

  /*
  -->>Mutators
  */

  setExportedProjects(p_projectsExported: number[]): void{
    this.projectsExported = p_projectsExported;   
  }

  setExportedProjectsMetrics(p_projMetricsExported: number[]): void{
    this.projMetricsExported = p_projMetricsExported;   
  }

  /*
  -->>Accessors
  */

  getExportedProjects(): number[] {
    if (this.projectsExported === undefined) {
      this.projectsExported = [];    
    }
    return this.projectsExported; 
  }

  getExportedProjectsMetrics(): number[] {
    if (this.projMetricsExported === undefined) {
      this.projMetricsExported = [];    
    }
    return this.projMetricsExported; 
  }

  /*
  -->>Request to the API
  */
  
  getProjects(): Observable<any>{
    return this.http.get(`${this.API_URI}`);
  }

  getProjectMetrics(): Observable<any>{
    return this.http.get(`${this.API_URI}/metrics`);
  }

  getComponentMetrics(): Observable<any>{
    return this.http.get(`${this.API_URI}/components/metrics`);
  }

  /*
  -->>Request to the API for Measures
  */
  getProjectsMeasures(p_projectsExported: number[], p_metricsExported: number[]): Observable<any>{
    
    return this.http.get(`${this.API_URI}/measures` + '/' + p_projectsExported + '/' + p_metricsExported);
  }

  getComponentsMeasures(p_projectsExported: number[], p_compMetricsExported: number[], p_delayTime : number): Observable<any>{
    
    return this.http.get(`${this.API_URI}/components/measures` + '/' + p_projectsExported + '/' + p_compMetricsExported).pipe(delay(p_delayTime));
    
  }

  makeMultipleRequest(p_projectsExported: number[], p_metricsExported: number[]): any {
    let req: Observable<any>[] = [];
    let index: number = 0;
    let time: number = 0;
    for (let proj of p_projectsExported){  
      req[index] = this.http.get(`${this.API_URI}/components/measures` + '/' + proj + '/' + p_metricsExported).pipe(delay(time));
      index = index + 1;
      time = time + 10;

    } 
    return req;

  }

}
