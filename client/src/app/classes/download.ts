import { SweetAlert } from '../components/sweetAlert/sweetAlert';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import  { j2xParser } from 'fast-xml-parser/src/parser';
import { Project } from './APIRequest/project';

export class Download {

  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  generateJsonFile(p_projectMeasures: Project[], p_progressModal: SweetAlert): void{
    try {

      for(let proj of p_projectMeasures){      
        
        let file = JSON.stringify(proj);
        let name : string = proj.name.replace(' ', '-') + ".json";
        this.zip.file<"string">(name, file);

      }    
      
    } catch (error) {

      p_progressModal.close();
      p_progressModal.error(error);
       
    }

  }

  generateXmlFile(p_projectMeasures: Project[], p_progressModal: SweetAlert): void{ 
    try {      
      let project : any = [];
      for(let proj of p_projectMeasures){
        
        project['project'] = proj;

        let parser = new j2xParser({});
        let file = parser.parse(project);
        let name = proj.name.replace(' ', '-') + ".xml";
        this.zip.file<"string">( name, file);        
      }
        
    } catch (error) {

      p_progressModal.close();
      p_progressModal.error(error);
  
    }
    
  }


  public async zipFile (p_progressModal: SweetAlert): Promise<void> {
    try {

      await this.zip
      .generateAsync({type:"blob"})
      .then(function (content) {
        FileSaver.saveAs(content,'projects_measures.zip');
        p_progressModal.close();
        
      });
      
    } catch (error) {

      p_progressModal.close();
      p_progressModal.error(error);
           
    }     
  }

}
