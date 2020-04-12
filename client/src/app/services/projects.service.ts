import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  getProjects(){
    return this.http.get(`${this.API_URI}`);
  }

  getProjectMetrics(){
    return this.http.get(`${this.API_URI}/metrics`);
  }

  setExportedProjects(p_projectsExported: number[]): void{
    this.projectsExported = p_projectsExported;   
  }

  getExportedProjects(): number[] {
    if (this.projectsExported === undefined) {
      this.projectsExported = [];    
    }
    return this.projectsExported; 
  }

  getProjectsMeasures(p_projectsExported, p_metricsExported){
    
    return this.http.get(`${this.API_URI}/measures` + '/' + p_projectsExported + '/' + p_metricsExported);
  }

  getComponentMetrics(){
    return this.http.get(`${this.API_URI}/components/metrics`);
  }

  getExportedProjectsMetrics(): number[] {
    if (this.projMetricsExported === undefined) {
      this.projMetricsExported = [];    
    }
    return this.projMetricsExported; 
  }

  setExportedProjectsMetrics(p_projMetricsExported: number[]): void{
    this.projMetricsExported = p_projMetricsExported;   
  }

  getComponentsMeasures(p_projectsExported, p_compMetricsExported){
    
    return this.http.get(`${this.API_URI}/components/measures` + '/' + p_projectsExported + '/' + p_compMetricsExported);
  }

}
