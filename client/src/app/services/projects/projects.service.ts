import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

// Interfaces
import { Project } from '../../classes/APIRequest/project'
import { Metric } from '../../classes/APIRequest/metric';
import { Component } from '../../classes/APIRequest/component';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projMetricsExported: number[];
  projectsExported: number[];
  API_URI: string;
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.API_URI = 'http://localhost:3000/api/projects';
    this.httpHeaders = new HttpHeaders({
      'Content-Type':'application/json; charset=utf-8',
      'Cache-Control': 'private, max-age=3600, must-revalidate'
    });
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
  
  getProjects(): Observable<Project[]>{
    let headers = this.httpHeaders;

    return this.http.get<Project[]>(`${this.API_URI}`, {headers});
  }

  getProjectMetrics(): Observable<Metric[]>{
    let headers = this.httpHeaders;

    return this.http.get<Metric[]>(`${this.API_URI}/metrics`, {headers});
  }

  getComponentMetrics(): Observable<Metric[]>{
    let headers = this.httpHeaders;

    return this.http.get<Metric[]>(`${this.API_URI}/components/metrics`, {headers});
  }

  getNumberComponentsMeasures(p_projectsExported: number[], p_compMetricsExported: number[]): Observable<number>{
    let headers = this.httpHeaders;

    return this.http.get<number>(`${this.API_URI}/components/measures/count/` + p_projectsExported + '/' + p_compMetricsExported, {headers});
  }

  /*
  -->>Request to the API for Measures
  */
  getProjectsMeasures(p_projectsExported: number[], p_metricsExported: number[]): Observable<Project[]>{
    let headers = this.httpHeaders;
    
    return this.http.get<Project[]>(`${this.API_URI}/measures` + '/' + p_projectsExported + '/' + p_metricsExported, {headers});
  }

  getComponentsMeasures(p_projectsExported: number, p_compMetricsExported: number[], p_delayTime : number): Observable<Component[]>{

    let url = `${this.API_URI}/components/measures` + '/' + p_projectsExported + '/' + p_compMetricsExported;
    let headers = this.httpHeaders;
    
    return this.http.get<Component[]>(url, {headers}).pipe(delay(p_delayTime));
    
  }

  makeMultipleRequest(p_projectsExported: number[], p_metricsExported: number[]): Observable<Component[]>[] {

    let req: Observable<Component[]>[] = [];
    let index: number = 0;
    let time: number = 0;
    for (let proj of p_projectsExported){  
      req[index] = this.getComponentsMeasures(proj, p_metricsExported, time);
      index = index + 1;
      time = time + 10 + 10 * (Math.floor(p_metricsExported.length/10));
    } 

    return req;

  }

}
