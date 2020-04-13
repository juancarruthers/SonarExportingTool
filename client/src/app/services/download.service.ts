import { Injectable } from '@angular/core';
import { parse } from 'js2xmlparser';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  generateJsonFile(p_projectMeasures:any){
    for(let proj of p_projectMeasures){      
      let file = JSON.stringify(proj);
      let name : string = proj['name'].replace(' ', '-') + ".json";
      this.zip.file(name, file); 
  
    }
    this.zipFile();
    
  }

  generateXmlFile(p_projectMeasures:any){       
    for(let proj of p_projectMeasures){
      let file = parse('project',proj);
      let name : string = proj['name'].replace(' ', '-') + ".xml";
      this.zip.file( name, file); 
        
    }
    this.zipFile();
  }

  joinComponentsANDProjectsMeasures(p_projectMeasures:any, p_componentMeasures:any): any{
    
    let compIndex: number = 0;
    let projIndex: number = 0;
    let componentsMeasures: any = [];    
    let prevProjId: number = p_projectMeasures[0]['idproject'];

    for (let comp of p_componentMeasures){

      componentsMeasures[compIndex] = comp;
      compIndex = compIndex + 1;

      if (prevProjId != comp['idproject']){       
        p_projectMeasures[projIndex]['components'] = componentsMeasures;

        projIndex = projIndex + 1;
        prevProjId = comp['idproject'];
        componentsMeasures = [];
        compIndex = 0;
      }
    }
    p_projectMeasures[projIndex]['components'] = componentsMeasures;

    return p_projectMeasures;
  }


  public async zipFile () {
    this.zip
    .generateAsync({type:"blob"})
    .then(function (content) {

      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {

        const blob = new Blob([content], { type: 'application/zip' });
        const a: any = document.createElement('a');
        a.style = 'display: none';
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'projects_measures.zip';
        a.click();
        window.URL.revokeObjectURL(url);

      };
      xhr.open('GET', 'download');
      xhr.send();
      
    });
    this.zip = new JSZip();
      
  }

}
