import pool from './database';
import { Pool } from 'promise-mysql';


import { URL }  from 'url';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Project } from './models/project';
import { Project_measure } from './models/project_measure';
import { Component_measure } from './models/component_measure';
import { Component } from './models/component';

class RefreshAPIModule {

  private refreshProjects : Project[];
  private newProjects : Project[];
  private organization: string;

  constructor(){
    this.refreshProjects = [];
    this.newProjects = [];
    this.organization = 'unne-sonar-corpus';
  }

  public async main(): Promise<number>{
    await this.searchLastAnalysis();
    await this.updateProjects();
    console.log('Projects Updated!');

    //Insertion of NEW PROJECTS    
    let listNewKeys = this.listKeyProjects(this.newProjects);
    await this.updateComponents(listNewKeys);
    console.log("Projects' Components Inserted!"); 
    await this.updateProjectMeasures(listNewKeys);
    console.log("Project's Measures Inserted!");
    await this.updateComponentMeasures(listNewKeys);
    console.log("Component's Measures Inserted!");

    //UPDATE of ALREADY LOADED PROJECTS    
    listNewKeys = this.listKeyProjects(this.newProjects);
    await this.updateComponents(listNewKeys);
    console.log("Projects' Components Updated!"); 
    await this.updateProjectMeasures(listNewKeys);
    console.log("Project's Measures Updated!");
    await this.updateComponentMeasures(listNewKeys);
    console.log("Component's Measures Updated!");


    await this.updateDateLastAnalysis();

    
    return 1;
  }

  
  private async getProjectIdMeasure(p_idproject: number, p_idmetric : string): Promise<number>{
  
    let queryIdmeasure = await pool
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


  private async getComponentIdMeasure(p_idcomponent: number, p_idmetric : string): Promise<number>{
    
    let queryIdmeasure = await pool
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


  private async getDateLastAnalysis(): Promise<Date>{
    
    let queryDateLastAnalysis = await pool
      .then((r: Pool) => r
      .query('SELECT date FROM lastUpdate')
      )
      .catch(err =>{
          console.log(err);
      });

      return queryDateLastAnalysis[0]['date'];
        
  }

  private async updateDateLastAnalysis(): Promise<void>{
    const date = new Date(Date.now())
    await pool
      .then((r: Pool) => r
      .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date)
      )
      .catch(err =>{
        console.log(err);
      });
    console.log("Date Last Analysis Updated!");
        
  }

  private async checkProjectExists(p_projectKey : string): Promise<boolean>{
    
    let querykeyProj = await pool
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
    
    let queryNameComp = await pool
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


  private listKeyProjects(p_projects: Project[]): string{
    let keyList = "";
    for (let project of p_projects) {
      keyList = keyList + project.getKey() + ',';  
         
    }
    keyList = keyList.replace(/\,$/,'');
    

    return keyList
  }


  private async APIGetRequest(p_url: string, p_headers: any): Promise<any>{
    const url = new URL(p_url);
    let api_query = await fetch(url, {
      method: 'GET',
      headers : p_headers
    })
    .then(response => {
      return response.json()
    })
    .catch(err => {
      console.log(err);
    });

    return api_query;
  }


  

  private async searchLastAnalysis(): Promise<void>{
    try {
      var key: string;
    
      var path = resolve(__dirname,'../key.sonar');       

      key = readFileSync(path, 'utf8');

      //Headers con el token de autorizacion
      let url = 'https://sonarcloud.io/api/projects/search?organization=' + this.organization + '&ps=500';
      let head = {
          'content-type' : 'application/json',
          'authorization': 'Basic ' + key  
      };

      let api_query = await this.APIGetRequest(url,head)

      let response = api_query["components"];

      let dateLastAnalysis = await this.getDateLastAnalysis();

      for(let proj of response){

        let timestamp = proj["lastAnalysisDate"].split('T');
        let date = timestamp[0].split('-');
        let time = timestamp[1].split('+');
        let hours = time[0].split(':');
        let ms = time[1];
        let timestampAnalysis = new Date(date[0], date[1] -1, date[2], hours[0], hours[1], hours[2], ms);

        if (timestampAnalysis > dateLastAnalysis){

          let respProj = new Project(proj["key"], proj["name"], proj["qualifier"], timestampAnalysis);

          if (await this.checkProjectExists(respProj.getKey())){
            this.refreshProjects.push(respProj);
          }else{
            this.newProjects.push(respProj);
          }
          
        }

      }
    } catch (error) {
      console.log(error);
    }   
              
  }


  private async updateProjects(): Promise<void>{
    try {

      for(let proj of this.newProjects){
        
        await pool
          .then((r: Pool) => r.query('INSERT INTO projects set ?', [proj])
            .catch(err => {
              console.log(err);
            })
          );

      }

      for(let proj of this.refreshProjects){
        
        await pool
          .then((r: Pool) => r.query('UPDATE projects SET lastAnalysis = ? WHERE key = ?', [proj.getLastAnalysis(), proj.getKey()])
            .catch(err => {
              console.log(err);
            })
          );

      }
      
    } catch (error) {
      console.log(error);
    }   
          
  }


  private async updateComponents(p_projectsKeyList: string): Promise<void>{

    let projectsKeys = await pool
      .then((r: Pool) => r.query('SELECT p.idproject, p.key FROM projects AS p WHERE p.key IN (?)', p_projectsKeyList)
        .catch(err => {
          console.log(err);
        })
      );

    for (let proj of projectsKeys){

      let url = "https://sonarcloud.io/api/components/tree?component=" + proj['key'] + "&p=1&ps=500";
      
      let api_query = await this.APIGetRequest(url, '');

      let response_page = api_query["paging"];
      let totalPages = response_page["total"]/500;
      let cont = 0;

      let response_components: any;

      while(cont < totalPages){

        url = "https://sonarcloud.io/api/components/tree?component=" + proj['key'] + "&p=" + (cont + 1) + "&ps=500";
      
        api_query = await this.APIGetRequest(url, '');

        response_components = api_query["components"];

        for(let comp of response_components){

          if (!await this.checkComponentExists(proj["idproject"], comp["path"])){

            let respComp = new Component(proj["idproject"], comp["name"], comp["qualifier"], comp["path"], comp["language"]);
            pool
              .then((r: Pool) => r.query('INSERT INTO components set ?', [respComp])
                .catch(err => {
                  console.log(err);
                })
              );
          }
        }
        
        cont = cont + 1;    

      }

    }
    
  }  

  
  private async updateProjectMeasures(p_projectsKeyList: string): Promise<void>{
    
    let projectsKeys = await pool
      .then((r: Pool) => r.query('SELECT p.idproject, p.key FROM projects AS p WHERE p.key IN (?)',p_projectsKeyList)
        .catch(err => {
          console.log(err);
        })
      );

    for (let proj of projectsKeys){

      //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
      let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + "&metricKeys=new_technical_debt, blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, new_branch_coverage, conditions_to_cover, new_conditions_to_cover, confirmed_issues, coverage, new_coverage, critical_violations, complexity, last_commit_date, development_cost, new_development_cost, directories, duplicated_blocks, new_duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, new_duplicated_lines, new_duplicated_lines_density, duplications_data, effort_to_reach_maintainability_rating_a, executable_lines_data, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, new_line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, new_lines_to_cover, sqale_rating, new_maintainability_rating, major_violations, minor_violations, ncloc_data, new_blocker_violations, new_bugs, new_code_smells, new_critical_violations, new_info_violations, new_violations, new_lines, new_major_violations, new_minor_violations, new_security_hotspots, new_vulnerabilities, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, new_reliability_rating, reliability_remediation_effort, new_reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, new_security_rating, security_remediation_effort, new_security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, new_sqale_debt_ratio, uncovered_conditions, new_uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
      
      let api_query_measures = await this.APIGetRequest(url, '');

      let response = api_query_measures["component"]["measures"];

      let idMeasure : number;
     
      for(let mea of response){

        let idMetric = await pool
        .then((r: Pool) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?',mea["metric"])
          .catch(err => {
            console.log(err);
          })
        );

        idMeasure = await this.getProjectIdMeasure(proj["idproject"],idMetric['0']['idmetric']) ;

        if (idMeasure == 0){

          let respMeas = new Project_measure(proj["idproject"], idMetric['0']['idmetric'], mea["value"]);
          await pool
          .then((r: Pool) => r.query('INSERT INTO project_measures set ?', [respMeas])
            .catch(err => {
              console.log(err);
            })
          );
        }else{
          
          await pool
          .then((r: Pool) => r.query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [mea["value"], idMeasure])
            .catch(err => {
              console.log(err);
            })
          );
        
        }

      }

    }

  }


  
  private async updateComponentMeasures(p_projectsKeyList: string): Promise<void>{
    
    let projectsKeys = await pool
      .then((r: Pool) => r.query('SELECT p.idproject, p.key FROM projects AS p WHERE p.key IN (?)',p_projectsKeyList)
        .catch(err => {
          console.log(err);
        })
      );

    for (let proj of projectsKeys){

      let componentsPaths = await pool
        .then((r: Pool) => r.query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?',proj['idproject'])
          .catch(err => {
            console.log(err);
          })
        );      

      for(let comp of componentsPaths){

        //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
        let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + ':' + comp['path'] + "&metricKeys=blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, conditions_to_cover, confirmed_issues, coverage, critical_violations, complexity, last_commit_date, development_cost, directories, duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, effort_to_reach_maintainability_rating_a, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, sqale_rating, major_violations, minor_violations, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
        
        let api_query = await this.APIGetRequest(url, '');

        let response = api_query["component"]["measures"];

        let idMeasure : number

        for(let mea of response){

          let idMetric = await pool
            .then((r: Pool) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?',mea["metric"])
              .catch(err => {
                console.log(err);
              })
            );   

          idMeasure = await this.getComponentIdMeasure(comp['idcomponent'],idMetric['0']['idmetric']) ;

          if (idMeasure == 0){

            let respMeas = new Component_measure(comp['idcomponent'], idMetric['0']['idmetric'], mea["value"]);
            await pool
              .then((r: Pool) => r.query('INSERT INTO component_measures set ?', [respMeas])
                .catch(err => {
                  console.log(err);
                })
              );

          }else{
            
            await pool
            .then((r: Pool) => r.query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [mea["value"], idMeasure])
              .catch(err => {
                console.log(err);
              })
            );
          
          }   
 
        }

      }         

    }

  }


}

export const refreshModule = new RefreshAPIModule();
refreshModule.main();

