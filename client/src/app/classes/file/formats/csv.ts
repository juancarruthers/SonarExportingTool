import { File } from "../file";
import { Project } from '../../APIRequest/project';
import { SweetAlert } from '../../../components/content/sweetAlert/sweetAlert';

export class Csv extends File {

  constructor (p_projects: Project[]){
    super(p_projects);
  }

  generateOutput(p_progressModal: SweetAlert, p_numberComponentMetrics: number): void{
    try {
      for(let proj of super.getProjects()){ 
        let projectsFile = 'key,type,name,description,domain,value\n';
        let name : string = proj.name.replace(' ', '-');
        
        for (let projMea of proj.project_measure){
          projectsFile = projectsFile + projMea.key + ',' + projMea.type + ',' + projMea.name + ',' + projMea.description + ',' + projMea.domain+ ',' + projMea.value+ '\n';
        }
      
        
        if (p_numberComponentMetrics != 0){
          let componentsMetricsFile = 'name, qualifier, path, language, domain, key, type, name, description, value \n';
          
          super.getZip().folder(name);
          super.getZip().file<"string">(name + '/' + name + ".csv", projectsFile);
          
          for(let compMea of proj.component){

            for (let mea of compMea.component_measure){
            
              componentsMetricsFile = componentsMetricsFile + compMea.name + ',' + compMea.qualifier + ',' + compMea.path + ',' + compMea.language+ ',' + mea.domain + ',' +  mea.key + ',' + mea.type + ',' + mea.name + ',' + mea.description  + ',' + mea.value + '\n';
            
            }
          }

          super.getZip().file<"string">(name + "/Components.csv", componentsMetricsFile);
          
        
        }else{
          super.getZip().file<"string">(name + ".csv", projectsFile);
        }        
  
      } 
      
      super.compressFiles(p_progressModal);
      
    } catch (error) {
      p_progressModal.close();
      p_progressModal.error(error);
        
    }
    
  }
}
