
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, mergeMap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

// Interfaces
import { Project } from '../../classes/APIRequest/project'
import { Metric } from '../../classes/APIRequest/metric';
import { Component } from '../../classes/APIRequest/component';






import { AuthService } from './../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projMetricsExported: number[];
  projectsExported: number[];
  API_URI: string;
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private auth:AuthService) { 
    this.API_URI = 'http://localhost:3000/api/projects';//'https://sonar-exporting-tool.tk/api/projects';
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
    return this.http.get<Project[]>(`${this.API_URI}`);
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


  /*
    Private Services
  */

  editProjects(p_projectsChanges: string[][]): Observable<string>{
    let url = `${this.API_URI}/edit`;
    return this.auth.getTokenSilently()
            .pipe(
              mergeMap(token => {
                let headers = new HttpHeaders ({ Authorization: `Bearer ${token}` });
                return this.http.put<string>(url, p_projectsChanges ,{headers});
              }),
              catchError(err => throwError(err))
            );
  }

  updateProjects(p_config): Observable<void>{
    let url = `${this.API_URI}/update`;
    return this.auth.getTokenSilently()
            .pipe(
              mergeMap(token => {
                let headers = new HttpHeaders ({ Authorization: `Bearer ${token}` });
                return this.http.post<void>(url, p_config, {headers});
              }),
              catchError(err => throwError(err))
            );
  }

  getProjectsToUpdate(): Observable<void> {
    let url = `${this.API_URI}/update/list`;
    return this.auth.getTokenSilently()
            .pipe(
              mergeMap(token => {
                let headers = new HttpHeaders ({ Authorization: `Bearer ${token}` });
                return this.http.get<any>(url, {headers});
              }),
              catchError(err => throwError(err))
            );
  }

 
}
