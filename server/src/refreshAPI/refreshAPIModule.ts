import { sonarAPI } from './APIDataRecolection';
import { Component } from '../sonarAPIInterfaces/component';

import { DBOperations } from './DBOperations'
import { APIserver } from '../index';

//MODULE TO REFRESH THE DATA FROM DATABASE DEPENDING SONAR UPDATES

export class RefreshAPIModule {

  private refreshProjects : any[][];
  private newProjects : any[][];
  private insertBlock: number;
  private startTime: number;
  private limitTime: number;
  private listeningPort: number;
  private database: DBOperations;

  constructor(p_listeningPort: number, p_limitTime: number){

    this.database = new DBOperations();
    this.refreshProjects = [];
    this.newProjects = [];
    this.insertBlock = 750;
    this.startTime = this.getTimeSeconds();
    this.limitTime = p_limitTime; //Time in Seconds
    this.listeningPort = p_listeningPort;
  }

  getNewProjects(): any[][]{
    return this.newProjects;
  }

  getRefreshProjects(): any[][]{
    return this.refreshProjects;
  }

  public async main(): Promise<number>{

    APIserver.changeListeningPort(this.listeningPort);
    console.time('DBTime');
    let flagTransaction : boolean = true;  
    await this.searchLastAnalysis();
    await this.updateProjects();
    console.timeLog('DBTime', 'Projects Updated!');  
    await this.insertNewProjects(flagTransaction);
    await this.refreshOldProjects(flagTransaction);
     
    if (flagTransaction){

      await this.database.updateDateLastAnalysis();
      console.timeLog('DBTime', "Finish Refreshing");

    }else{

      console.timeLog('DBTime', "Refreshing Process did not Finish");
    }  
    console.timeEnd('DBTime');

    APIserver.changeListeningPort(APIserver.getPort());
    this.database.closeConnection();
    return 1;
  }

  /*
  --->>> INSERT NEW PROJECTS
  */

  private async insertNewProjects(p_flagTransaction: boolean){

    const keysString = this.listKeyProjects(this.newProjects);
    const projectsKeys = await this.database.getProjectKeys(keysString);
  
    try {  

      for (let i = 0; i < projectsKeys.length; i++) {

        await this.database.transactionalOperation('START TRANSACTION');
        await this.updateComponents(projectsKeys[i]);
        console.timeLog('DBTime', projectsKeys[i]['key'] + " Components Inserted!");
        await this.updateProjectMeasures(projectsKeys[i]);
        console.timeLog('DBTime', projectsKeys[i]['key'] + " Measures Inserted!");
        await this.insertComponentMeasures(projectsKeys[i]);
        console.timeLog('DBTime', projectsKeys[i]['key'] + " Components' Measures Inserted!");
        await this.database.transactionalOperation('COMMIT');

        if ((this.getTimeSeconds()-this.startTime) > this.limitTime){

          await this.database.deleteProjectsNotFullyLoad();
          i = projectsKeys.length;
          p_flagTransaction = false;
        }
      }

    } catch (error) {

      console.timeLog('DBTime',error);
      await this.database.transactionalOperation('ROLLBACK');
      await this.database.deleteProjectsNotFullyLoad();
      p_flagTransaction = false;
    }
    return p_flagTransaction
  }

  /*
  --->>> UPDATE OLD PROJECTS
  */
  
  private async refreshOldProjects(p_flagTransaction: boolean): Promise<boolean>{
    
    const keysString = this.listKeyProjects(this.refreshProjects);
    const projectsKeys = await this.database.getProjectKeys(keysString);

    if (p_flagTransaction){

      try {
        
        for (let i = 0; i < projectsKeys.length; i++) {

          await this.database.transactionalOperation('START TRANSACTION');
          await this.updateComponents(projectsKeys[i]);
          console.timeLog('DBTime', projectsKeys[i]['key'] + " Components Updated!");   
          await this.updateProjectMeasures(projectsKeys[i]);
          console.timeLog('DBTime', projectsKeys[i]['key'] + " Measures Updated!");  
          await this.updateComponentMeasures(projectsKeys[i]);
          console.timeLog('DBTime', projectsKeys[i]['key'] + " Components' Measures Updated!");
          await this.database.transactionalOperation('COMMIT');

          if ((this.getTimeSeconds()-this.startTime) > this.limitTime){

            i = projectsKeys.length;
            p_flagTransaction = false;
          }        
        }

      } catch (error) {

        console.timeLog('DBTime',error);
        await this.database.transactionalOperation('ROLLBACK');
        p_flagTransaction = false;
      }
    }
    return p_flagTransaction;
  }

  /*
  --->>> GET THE ACTUAL TIME IN SECONDS
  */

  private getTimeSeconds() : number{

    const timeNanoSec = process.hrtime.bigint();
    let timeSeconds = Number(timeNanoSec);
    timeSeconds = timeSeconds / 1000000000;
    return timeSeconds;
  }

  /*
  --->>> CONVERTS A RETURN FROM THE API TO A STRING ARRAY FOR QUERY POURPOSES
  */

  private listKeyProjects(p_projects: any[][]): string[]{

    let keyArray : string[]=[];

    for (let project of p_projects) {

      keyArray.push(project[0]);         
    }
    return keyArray;
  }



  /*
  --->>> SETS THE ATRIBUTES newProjects AND refreshProjects
  */
  
  async searchLastAnalysis(): Promise<void>{
    try {

      const url = 'https://sonarcloud.io/api/projects/search?organization=' + sonarAPI.organization + '&p=1&ps=1';     
      const pages = await sonarAPI.numberPages(url);
      const dateLastAnalysis = await this.database.getDateLastAnalysis();

      for (let i = 1; i <= pages; i++) {

        let projects = await sonarAPI.getProjects(i);

        for(let proj of projects){

          const timestamp = proj.lastAnalysisDate.split('T');
          let date : any[] = timestamp[0].split('-');
          const time = timestamp[1].split('+');
          let hours: any [] = time[0].split(':');
          hours[0] = hours[0] - 2;

          if (hours[0] < 0){

            hours[0] = hours[0] + 24;
            date[2] = date[2] - 1;
          }
          let timestampAnalysis = new Date();
          timestampAnalysis.setUTCFullYear(date[0]);
          timestampAnalysis.setUTCMonth(date[1] - 1);
          timestampAnalysis.setUTCDate(date[2]);
          timestampAnalysis.setUTCHours(hours[0]);
          timestampAnalysis.setUTCMinutes(hours[1]);
          timestampAnalysis.setUTCSeconds(hours[2]);
  
          if (timestampAnalysis > dateLastAnalysis){
  
            let respProj = [proj.key , proj.name, proj.qualifier, timestampAnalysis];
  
            if (await this.database.checkProjectExists(proj.key)){
              //Refresh Only if the project was not refreshed before! (Exception Happened)
              if ((await this.database.getProjectLastAnalysis(proj.key)) < dateLastAnalysis){

                this.refreshProjects.push(respProj);
              }

            }else{

              this.newProjects.push(respProj);
            }            
          } 
        }      
      } 

    } catch (error) {

      console.log(error);
    }                 
  }

  /*
  --->>> UPDATE AND INSERT THE PROJECTS OBTAINED FROM THE API
  */

  private async updateProjects(): Promise<void>{
    try {

      if (this.newProjects.length > 0){
          
        await this.database.insertProjects(this.newProjects);
      }

      for(let proj of this.refreshProjects){
        
        await this.database.updateProjLastAnalysis(proj[0], proj[3]);
      } 

    } catch (error) {

      console.log(error);
    }             
  }

  /*
  --->>> UPDATE AND INSERT THE COMPONENTS OBTAINED FROM THE API
  */

  private async updateComponents(p_project : any): Promise<void>{
    try {  

      let compToInsert : any[][] = [];       
      let url = 'https://sonarcloud.io/api/components/tree?component=' + p_project['key'] + '&p=1&ps=1';  
      let pages = await sonarAPI.numberPages(url);
      let components: Component[];

      for (let i = 1; i <= pages; i++) {

        components = await sonarAPI.getComponents(p_project['key'], i);
        
        for (let component of components) {

          if (!await this.database.checkComponentExists(p_project["idproject"], component.path)){

            let respComp = [p_project["idproject"], component.name , component.qualifier, component.path, component.language];
            compToInsert.push(respComp);         
          }         
        }

        if (compToInsert.length >= this.insertBlock){

          await this.database.insertComponents(compToInsert);
          compToInsert = [];
        }             
      }   

      if (compToInsert.length > 0){
        await this.database.insertComponents(compToInsert);
      }
      
    } catch (error) {

      console.log(error);     
    }       
  }  

  /*
  --->>> UPDATE AND INSERT THE PROYECTS' MEASURES OBTAINED FROM THE API
  */
  
  private async updateProjectMeasures(p_project : any): Promise<void>{
    try {

      let projMeaToInsert : any[][] = [];
      let projMeasures = await sonarAPI.getProjectMeasures(p_project['key']);     
      let idMeasure : number;
    
      for(let measure of projMeasures){

        let idMetric = await this.database.getMetricId(measure.metric);
        idMeasure = await this.database.getProjectIdMeasure(p_project["idproject"], idMetric) ;

        if (idMeasure == 0){

          let respMeas = [p_project["idproject"], idMetric, measure.value];
          projMeaToInsert.push(respMeas);
          
        }else{
          
          await this.database.updateProjMeasure(idMeasure, measure.value);
        
        }

      }
      
      if (projMeaToInsert.length > 0){
        await this.database.insertProjectMeasures(projMeaToInsert);
      }
     
    } catch (error) {
      console.log(error);
    }
    
  }

  /*
  --->>> INSERT THE NEW COMPONENTS' MEASURES GOT FROM THE API
  */
 
  
 private async insertComponentMeasures(p_project: any): Promise<void>{
    try {

      let compMeaToInsert : any[][] = [];
      let componentsPaths = await this.database.getComponentPathsOfProyects(p_project['idproject']);
        
      for(let comp of componentsPaths){

        let compMeasures = await sonarAPI.getComponentMeasures(p_project['key'] + ':' + comp['path']);

        for(let measure of compMeasures){

          let idMetric = await this.database.getMetricId(measure.metric)
          let respMeas = [comp['idcomponent'], idMetric, measure.value];
          compMeaToInsert.push(respMeas);
        }

        if(compMeaToInsert.length >= this.insertBlock){

          await this.database.insertComponentMeasures(compMeaToInsert);
          compMeaToInsert = [];
        }
      }   

      if(compMeaToInsert.length > 0){

        await this.database.insertComponentMeasures(compMeaToInsert);
      }       
    } catch (error) {   

      console.log(error);         
    }  
  }

  /*
  --->>> UPDATE THE COMPONENTS' MEASURES OBTAINED FROM THE API
  */
 
  
  private async updateComponentMeasures(p_project: any): Promise<void>{
    try {

      let compMeaToInsert : any[][] = [];
      let componentsPaths = await this.database.getComponentPathsOfProyects(p_project['idproject']);
        
      for(let comp of componentsPaths){

        let compMeasures = await sonarAPI.getComponentMeasures(p_project['key'] + ':' + comp['path']);

        if (compMeasures[0].metric != 'not found'){

          let idMeasure : number;

          for(let measure of compMeasures){

            let idMetric = await this.database.getMetricId(measure.metric)
            idMeasure = await this.database.getComponentIdMeasure(comp['idcomponent'], idMetric) ;

            if (idMeasure == 0){

              let respMeas = [comp['idcomponent'], idMetric, measure.value];
              compMeaToInsert.push(respMeas);
              
            }else{
              
              await this.database.updateCompMeasure(idMeasure, measure.value);           
            }    
          }

        }else{

          await this.database.deleteComponentAndMeasures(comp['idcomponent']);
        }

        if(compMeaToInsert.length >= this.insertBlock){

          await this.database.insertComponentMeasures(compMeaToInsert);
          compMeaToInsert = [];
        }
      }   

      if(compMeaToInsert.length > 0){

        await this.database.insertComponentMeasures(compMeaToInsert);
      }
         
    } catch (error) {   

      console.log(error);          
    }  
  }
}