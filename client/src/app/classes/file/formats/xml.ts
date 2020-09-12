import { File } from "../file";
import { Project } from '../../APIRequest/project';
import { SweetAlert } from '../../../components/content/sweetAlert/sweetAlert';
import { j2xParser } from 'fast-xml-parser/src/parser';

export class Xml extends File {

  constructor (p_projects: Project[]){
      super(p_projects);
  }

  generateOutput(p_progressModal: SweetAlert): void{ 
    try {      
      let project : any = [];
      for(let proj of super.getProjects()){
        
        project['project'] = proj;

        let parser = new j2xParser({});
        let file = parser.parse(project);
        let name = proj.name.replace(' ', '-') + ".xml";
        super.getZip().file<"string">( name, file);        
      }

      super.compressFiles(p_progressModal);
        
    } catch (error) {

      p_progressModal.close();
      p_progressModal.error(error);
  
    }
  }
}
