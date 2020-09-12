import { SweetAlert } from '../../components/content/sweetAlert/sweetAlert';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { Project } from '../APIRequest/project';

export abstract class File {

  private zip: JSZip;
  private projects: Project[];

  constructor(p_projects: Project[]) {
    this.zip = new JSZip();
    this.projects = p_projects;
  }

  getProjects(): Project[]{
    return this.projects;
  }

  getZip(): JSZip{
    return this.zip;
  }

  abstract generateOutput(p_progressModal: SweetAlert, p_numberComponentMetrics?: number): void;

  protected async compressFiles (p_progressModal: SweetAlert): Promise<void> {
    p_progressModal.update("Generating the zip file with the results");

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

