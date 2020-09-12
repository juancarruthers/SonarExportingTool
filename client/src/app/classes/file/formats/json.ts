import { File } from "../file";
import { Project } from '../../APIRequest/project';
import { SweetAlert } from '../../../components/content/sweetAlert/sweetAlert';

export class Json extends File {

    constructor (p_projects: Project[]){
        super(p_projects);
    }

    generateOutput(p_progressModal: SweetAlert){
        try {

            for(let proj of super.getProjects()){      
              
              let file = JSON.stringify(proj);
              let name : string = proj.name.replace(' ', '-') + ".json";
              super.getZip().file<"string">(name, file);
      
            }    

            super.compressFiles(p_progressModal);
            
        } catch (error) {
      
            p_progressModal.close();
            p_progressModal.error(error);
             
        }
    }
}
