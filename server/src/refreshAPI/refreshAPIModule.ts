import { sonarAPI } from './APIDataRecolection';
import { Component } from '../sonarAPIInterfaces/component';

import { database } from './DBOperations'

//MODULE TO REFRESH THE DATA FROM DATABASE DEPENDING SONAR UPDATES

class RefreshAPIModule {

  private refreshProjects : any[][];
  private newProjects : any[][];
  private projectsKeys: any;
  private insertBlock: number;

  constructor(){
    this.refreshProjects = [];
    this.newProjects = [];
    this.insertBlock = 750;
  }

  public async main(): Promise<number>{

    console.time('DBTime'); 
    let flagTransactions : boolean = true;
    await this.searchLastAnalysis();

    await this.updateProjects();
    console.timeLog('DBTime', 'Projects Updated!');

    //Insertion of NEW PROJECTS
    let keysString = this.listKeyProjects(this.newProjects);
    this.projectsKeys = await database.getProjectKeys(keysString);

    await database.transactionalAutoCommit(0);
     
    try {  

      for (let projectKey of this.projectsKeys) { 
        
        await database.transactionalOperation('START TRANSACTION');

        await this.updateComponents(projectKey);
        console.timeLog('DBTime', projectKey['key'] + " Components Inserted!");

        await this.updateProjectMeasures(projectKey);
        console.timeLog('DBTime', projectKey['key'] + " Measures Inserted!");

        await this.updateComponentMeasures(projectKey);
        console.timeLog('DBTime', projectKey['key'] + " Components' Measures Inserted!");

        await database.transactionalOperation('COMMIT');

      }

    } catch (error) {
      console.timeLog('DBTime',error);
      await database.transactionalOperation('ROLLBACK');
      await database.deleteProjectsNotFullyLoad();
      flagTransactions = false;
    }

    //UPDATE of ALREADY LOADED PROJECTS    
    keysString = this.listKeyProjects(this.refreshProjects);
    this.projectsKeys = await database.getProjectKeys(keysString);

    try {  

      for (let projectKey of this.projectsKeys) { 
        
        await database.transactionalOperation('START TRANSACTION');

        await this.updateComponents(projectKey);
        console.timeLog('DBTime', projectKey['key'] + " Components Updated!");
     
        await this.updateProjectMeasures(projectKey);
        console.timeLog('DBTime', projectKey['key'] + " Measures Updated!");
    
        await this.updateComponentMeasures(projectKey);
        console.timeLog('DBTime', projectKey['key'] + " Components' Measures Updated!");

        await database.transactionalOperation('COMMIT');

      }

    } catch (error) {
      console.timeLog('DBTime',error);
      await database.transactionalOperation('ROLLBACK');
      flagTransactions = false;
    }

    await database.transactionalAutoCommit(1);
     
    if (flagTransactions){
      await database.updateDateLastAnalysis();
    }

    console.timeLog('DBTime', "Finish Refreshing");
    console.timeEnd('DBTime');
  
    return 1;
  }

  private listKeyProjects(p_projects: any[][]): string[]{
    let keyArray : string[]=[];
    for (let project of p_projects) {
      keyArray.push(project[0]);  
         
    }

    return keyArray;
  }
  

  private async searchLastAnalysis(): Promise<void>{
    try {

      const url = 'https://sonarcloud.io/api/projects/search?organization=' + sonarAPI.organization + '&p=1&ps=1';
      
      const pages = await sonarAPI.numberPages(url);

      const dateLastAnalysis = await database.getDateLastAnalysis();

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
  
            if (await database.checkProjectExists(proj.key)){
              //Refresh Only if the project was not refreshed before! (Exception Happened)
              if ((await database.getProjectLastAnalysis(proj.key)) < dateLastAnalysis){
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

  

  private async updateProjects(): Promise<void>{
    try {
      if (this.newProjects.length > 0){
          
        await database.insertProjects(this.newProjects);

      }

      for(let proj of this.refreshProjects){
        
        await database.updateProjLastAnalysis(proj[0], proj[3]);

      }
      
    } catch (error) {
      console.log(error);
    }   
          
  }


  private async updateComponents(p_project : any): Promise<void>{
    try {      
      let compToInsert : any[][] = [];
        
      let url = 'https://sonarcloud.io/api/components/tree?component=' + p_project['key'] + '&p=1&ps=1';
    
      let pages = await sonarAPI.numberPages(url);

      let components: Component[];

      for (let i = 1; i <= pages; i++) {

        components = await sonarAPI.getComponents(p_project['key'], i);
        
        for (let component of components) {

          if (!await database.checkComponentExists(p_project["idproject"], component.path)){

            let respComp = [p_project["idproject"], component.name , component.qualifier, component.path, component.language];
            compToInsert.push(respComp);
            
          }
          
        }

        if (compToInsert.length >= this.insertBlock){
          await database.insertComponents(compToInsert);
          compToInsert = [];
        }             

      }   

      if (compToInsert.length > 0){
        await database.insertComponents(compToInsert);
      }
      
    } catch (error) {

      console.log(error);
      
    }   
    
  }  

  
  private async updateProjectMeasures(p_project : any): Promise<void>{

    try {

      let projMeaToInsert : any[][] = [];

      let projMeasures = await sonarAPI.getProjectMeasures(p_project['key']);
      
      let idMeasure : number;
    
      for(let measure of projMeasures){

        let idMetric = await database.getMetricId(measure.metric);

        idMeasure = await database.getProjectIdMeasure(p_project["idproject"], idMetric) ;

        if (idMeasure == 0){

          let respMeas = [p_project["idproject"], idMetric, measure.value];
          projMeaToInsert.push(respMeas);
          
        }else{
          
          await database.updateProjMeasure(idMeasure, measure.value);
        
        }

      }
      
      if (projMeaToInsert.length > 0){
        await database.insertProjectMeasures(projMeaToInsert);
      }
     
    } catch (error) {
      console.log(error);
    }
    
  }
  
  private async updateComponentMeasures(p_project: any): Promise<void>{

    try {

      let compMeaToInsert : any[][] = [];

      let componentsPaths = await database.getComponentPathsOfProyects(p_project['idproject']);
        
      for(let comp of componentsPaths){

        let compMeasures = await sonarAPI.getComponentMeasures(p_project['key'] + ':' + comp['path']);

        if (compMeasures[0].metric != 'not found'){

          let idMeasure : number;

          for(let measure of compMeasures){

            let idMetric = await database.getMetricId(measure.metric)

            idMeasure = await database.getComponentIdMeasure(comp['idcomponent'], idMetric) ;

            if (idMeasure == 0){

              let respMeas = [comp['idcomponent'], idMetric, measure.value];
              compMeaToInsert.push(respMeas);
              
            }else{
              
              await database.updateCompMeasure(idMeasure, measure.value);
            
            }   
  
          }

        }else{
          console.log("Component Deleted");
          await database.deleteComponentAndMeasures(comp['idcomponent']);
          this.updateComponentMeasures(p_project); //FIJARSE <<<<<<<<<<<<<<<---------------------------
        }

        if(compMeaToInsert.length >= this.insertBlock){
          await database.insertComponentMeasures(compMeaToInsert);
          compMeaToInsert = [];
        }

      }   

      if(compMeaToInsert.length > 0){
        await database.insertComponentMeasures(compMeaToInsert);
      }
         
    } catch (error) {   

      console.log(error);
           
    }  
  }
}

export const refreshModule = new RefreshAPIModule();
refreshModule.main();