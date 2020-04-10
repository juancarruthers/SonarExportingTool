import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  API_URI: string

  constructor(private http: HttpClient) { 
    this.API_URI = 'http://localhost:3000/api';
  }

  getProjects(){
    return this.http.get(`${this.API_URI}/projects`);
  }

}
