import { sonarAPI } from './APIDataRecolection';
import { Component } from '../sonarAPIInterfaces/component';

import pool from '../database';
import { Pool } from 'promise-mysql';

//MODULE TO REFRESH THE DATA FROM DATABASE DEPENDING SONAR UPDATES

class RefreshAPIModule {

  private refreshProjects : any[][];
  private newProjects : any[][];
  private projectsKeys: any;
  private insertBlock: number;

  constructor(){
    this.refreshProjects = [];
    this.newProjects = [];
    this.insertBlock = 500;
  }

  public async main(): Promise<number>{

    console.time('DBTime');

    await this.searchLastAnalysis();
    await this.updateProjects();
    console.timeLog('DBTime', 'Projects Updated!');
    

    //Insertion of NEW PROJECTS    
    let keysString = this.listKeyProjects(this.newProjects);
    this.projectsKeys = await this.getProjectKeys(keysString);

    await this.updateComponents();
    console.timeLog('DBTime', "Projects' Components Inserted!");

    await this.updateProjectMeasures();
    console.timeLog('DBTime', "Projects' Measures Inserted!");

    await this.updateComponentMeasures();
    console.timeLog('DBTime', "Components' Measures Inserted!");

    //UPDATE of ALREADY LOADED PROJECTS    
    keysString = this.listKeyProjects(this.refreshProjects);
    this.projectsKeys = await this.getProjectKeys(keysString);
    await this.updateComponents();
    console.timeLog('DBTime', "Projects' Components Updated!");
     
    await this.updateProjectMeasures();
    console.timeLog('DBTime', "Projects' Measures Updated!");
    
    await this.updateComponentMeasures();
    console.timeLog('DBTime', "Components' Measures Updated!");
    
    await this.updateDateLastAnalysis();

    console.timeLog('DBTime', "Finish Refreshing");
    console.timeEnd('DBTime');
  
    return 1;
  }

  //GETTERS

  private async getProjectIdMeasure(p_idproject: number, p_idmetric : number): Promise<number>{
  
    const queryIdmeasure = await pool
      .then((r: Pool) => r
      .query('SELECT pm.idmeasure AS id FROM project_measures AS pm WHERE pm.idproject = ? AND pm.idmetric = ?',[p_idproject, p_idmetric])
      )
      .catch(err =>{
          console.log(err);
      });
      let value : number;
      if(queryIdmeasure.length == 0){
        value = 0;
      }else{
        value = queryIdmeasure[0]['id'];
      }
      
    return value;
        
  }


  private async getComponentIdMeasure(p_idcomponent: number, p_idmetric : number): Promise<number>{
    
    const queryIdmeasure = await pool
      .then((r: Pool) => r
      .query('SELECT cm.idmeasure AS id FROM component_measures AS cm WHERE cm.idcomponent = ? AND cm.idmetric = ?',[p_idcomponent, p_idmetric])
      )
      .catch(err =>{
          console.log(err);
      });
      let value : number;
      if(queryIdmeasure.length == 0){
        value = 0;
      }else{
        value = queryIdmeasure[0]['id'];
      }
      
    return value

  }

  private async getMetricId(p_metricKey: string): Promise<number>{
    const idMetric = await pool
      .then((r: Pool) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', p_metricKey)
        .catch(err => {
          console.log(err);
        })
      );
    return idMetric[0]['idmetric'];
  }


  private async getDateLastAnalysis(): Promise<Date>{
    
    const queryDateLastAnalysis = await pool
      .then((r: Pool) => r
      .query('SELECT date FROM lastUpdate')
      )
      .catch(err =>{
          console.log(err);
      });

      return queryDateLastAnalysis[0]['date'];
        
  }

  private async getProjectKeys(p_projectsKeyList: string[]) : Promise <any>{
    const projectsKeys = await pool
        .then((r: Pool) => r.query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList])
          .catch(err => {
            console.log(err);
          })
        );

    //Return tuple with values idproject and key
    return projectsKeys;     
  }

  private async getComponentPathsOfProyects(p_project: string) : Promise <any>{
    const componentsPath = await pool
    .then((r: Pool) => r.query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?',p_project)
      .catch(err => {
        console.log(err);
      })
    );
    //Return tuple with values idcomponent and path
    return componentsPath;     
  }

  //INSERT

  private async insertProjects(p_projects: any):Promise<void>{
    await pool
      .then((r: Pool) => r.query('INSERT INTO `projects` (`key`,`name`,`qualifier`,`lastAnalysis`) VALUES  ?', [p_projects])
        .catch(err => {
          console.log(err);
        })
      );
  }

  private async insertComponents(p_components: any):Promise<void>{

    await pool
      .then((r: Pool) => r.query('INSERT INTO `components` (`idproject`,`name`,`qualifier`,`path`,`language`) VALUES ?', [p_components])
        .catch(err => {
          console.log(err);
        })
      );
    
  }

  private async insertProjectMeasures(p_measures: any):Promise<void>{
    await pool
      .then((r: Pool) => r.query('INSERT INTO `project_measures` (`idproject`, `idmetric`, `value`) VALUES ?', [p_measures])
        .catch(err => {
          console.log(err);
        })
      );
  }

  private async insertComponentMeasures(p_measures: any):Promise<void>{
    await pool
      .then((r: Pool) => r.query('INSERT INTO `component_measures` (`idcomponent`, `idmetric`,`value`) VALUES ?', [p_measures])
        .catch(err => {
          console.log(err);
        })
      );
  }

  //DELETE

  private async deleteComponentAndMeasures(p_idcomponent: number):Promise<void>{
    await pool
      .then((r: Pool) => r
      .query('DELETE FROM component_measures WHERE idcomponent = ?', p_idcomponent)
      )
      .catch(err =>{
        console.log(err);
      });
      await pool
      .then((r: Pool) => r
      .query('DELETE FROM components WHERE idcomponent = ?', p_idcomponent)
      )
      .catch(err =>{
        console.log(err);
      });
  }

  //UPDATE

  private async updateDateLastAnalysis(): Promise<void>{
    const date = new Date();
    await pool
      .then((r: Pool) => r
      .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date)
      )
      .catch(err =>{
        console.log(err);
      });
    console.log("Date Last Analysis Updated!");
        
  }

  //CHECK EXISTANCE

  private async checkProjectExists(p_projectKey : string): Promise<boolean>{
    
    const querykeyProj = await pool
      .then((r: Pool) => r
      .query('SELECT p.key FROM projects AS p WHERE p.key = ?',p_projectKey)
      )
      .catch(err =>{
          console.log(err)
      });
      let value = true;
      if(querykeyProj.length == 0){
        value = false;
      }
    return value;
        
  }  


  private async checkComponentExists(p_idproject: number, p_componentPath : string): Promise<boolean>{
    
    const queryNameComp = await pool
      .then((r: Pool) => r
      .query('SELECT c.name FROM components AS c WHERE c.idproject = ? AND c.path = ?',[p_idproject, p_componentPath])
      )
      .catch(err =>{
          console.log(err)
      });
      let value = true;
      if(queryNameComp.length == 0){
        value = false;
      }
    return value;
        
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

      const dateLastAnalysis = await this.getDateLastAnalysis();

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
  
            if (await this.checkProjectExists(proj.key)){
              this.refreshProjects.push(respProj);
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
          
        await this.insertProjects(this.newProjects);

      }

      for(let proj of this.refreshProjects){
        
        await pool
          .then((r: Pool) => r.query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [proj[3], proj[0]])
            .catch(err => {
              console.log(err);
            })
          );

      }
      
    } catch (error) {
      console.log(error);
    }   
          
  }


  private async updateComponents(): Promise<void>{
    try {      
      let compToInsert : any[][] = [];
        
      for (let proj of this.projectsKeys){

        let url = 'https://sonarcloud.io/api/components/tree?component=' + proj['key'] + '&p=1&ps=1';
      
        let pages = await sonarAPI.numberPages(url);

        let components: Component[];

        for (let i = 1; i <= pages; i++) {

          components = await sonarAPI.getComponents(proj['key'], i);
          
          for (let component of components) {

            if (!await this.checkComponentExists(proj["idproject"], component.path)){

              let respComp = [proj["idproject"], component.name , component.qualifier, component.path, component.language];
              compToInsert.push(respComp);
              
            }
            
          }

          if (compToInsert.length >= this.insertBlock){
            await this.insertComponents(compToInsert);
            compToInsert = [];
          }             

        }

      }

      if (compToInsert.length > 0){
        await this.insertComponents(compToInsert);
      }
      
    } catch (error) {

      console.log(error);
      
    }   
    
  }  

  
  private async updateProjectMeasures(): Promise<void>{

    try {

      let projMeaToInsert : any[][] = [];

      for (let proj of this.projectsKeys){

        let projMeasures = await sonarAPI.getProjectMeasures(proj['key']);
        
        let idMeasure : number;
      
        for(let measure of projMeasures){

          let idMetric = await this.getMetricId(measure.metric);

          idMeasure = await this.getProjectIdMeasure(proj["idproject"], idMetric) ;

          if (idMeasure == 0){

            let respMeas = [proj["idproject"], idMetric, measure.value];
            projMeaToInsert.push(respMeas);
            
          }else{
            
            await pool
            .then((r: Pool) => r.query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [measure.value, idMeasure])
              .catch(err => {
                console.log(err);
              })
            );
          
          }

        }

        if (projMeaToInsert.length >= this.insertBlock){
          await this.insertProjectMeasures(projMeaToInsert);
          projMeaToInsert = [];
        }

      }

      if (projMeaToInsert.length > 0){
        await this.insertProjectMeasures(projMeaToInsert);
      }
     
    } catch (error) {
      console.log(error);
    }
    
  }
  
  private async updateComponentMeasures(): Promise<void>{

    try {

      let compMeaToInsert : any[][] = [];

      for (let proj of this.projectsKeys){

        let componentsPaths = await this.getComponentPathsOfProyects(proj['idproject']);
          
        for(let comp of componentsPaths){

          let compMeasures = await sonarAPI.getComponentMeasures(proj['key'] + ':' + comp['path']);

          if (compMeasures[0].metric != 'not found'){

            let idMeasure : number;

            for(let measure of compMeasures){

              let idMetric = await this.getMetricId(measure.metric)

              idMeasure = await this.getComponentIdMeasure(comp['idcomponent'], idMetric) ;

              if (idMeasure == 0){

                let respMeas = [comp['idcomponent'], idMetric, measure.value];
                compMeaToInsert.push(respMeas);
                
              }else{
                
                await pool
                .then((r: Pool) => r.query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [measure.value, idMeasure])
                  .catch(err => {
                    console.log(err);
                  })
                );
              
              }   
    
            }

          }else{
            console.log("Component Deleted");
            await this.deleteComponentAndMeasures(comp['idcomponent']);
            this.updateComponentMeasures(); //FIJARSE <<<<<<<<<<<<<<<---------------------------
          }

          if(compMeaToInsert.length >= this.insertBlock){
            await this.insertComponentMeasures(compMeaToInsert);
            console.timeLog('DBTime', compMeaToInsert.length + " components' measures inserted of " + proj['idproject']);
            compMeaToInsert = [];
          }

        }

      }

      if(compMeaToInsert.length > 0){
        await this.insertComponentMeasures(compMeaToInsert);
      }
         
    } catch (error) {   

      console.log(error);
           
    }  
  }
}

export const refreshModule = new RefreshAPIModule();
refreshModule.main();