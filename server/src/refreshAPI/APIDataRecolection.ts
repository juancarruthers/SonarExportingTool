import { Measure } from '../sonarAPIInterfaces/measure';
import { Project } from '../sonarAPIInterfaces/project';
import { Component } from '../sonarAPIInterfaces/component';
import { Metric } from '../sonarAPIInterfaces/metric';

import { URL }  from 'url';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { resolve } from 'path';

class APIDataRecolection {

  organization: string;
  headers : any;

  constructor(){
    //ORGANIZATION
    this.organization = 'unne-sonar-corpus';

    //HTTP HEADERS
    let key: string;
    const path = resolve(__dirname,'../../key.sonar');       
    key = readFileSync(path, 'utf8');
    //HEADERS WITH AUTHENTICATION INFO
    this.headers = {
        'content-type' : 'application/json',
        'authorization': 'Basic ' + key  
    };
  }


    private async APIGetRequest(p_url: string): Promise<any>{
        const url = new URL(p_url);
        let api_query = await fetch(url, {
            method: 'GET',
            headers : this.headers
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err);
        });

        return api_query;
    }


    async numberPages(p_url: string) :Promise<number>{
        try {

            const api_query = await this.APIGetRequest(p_url);
            const response_page = api_query["paging"];
            const numberElements : number = response_page["total"];
            const totalPages = Math.ceil(numberElements/500);
            return totalPages;
            
        } catch (error) {
            console.log(error);
            return 0;
            
        }
   
    }

    async getMetrics () : Promise<Metric[]>{
        try {
            const url = "https://sonarcloud.io/api/metrics/search?p=1&ps=500";

            const api_query = await this.APIGetRequest(url);

            const metrics = api_query["metrics"];

            return metrics;

        } catch (error) {
            console.log(error);
            return [{id: 0, key: 'error', type: '', name:'', description : '', domain:'error'}];
        }
        
    }
  

    async getProjects(p_pageNumber: number): Promise<Project[]>{
        try {

            const url = 'https://sonarcloud.io/api/projects/search?organization=' + this.organization + '&p=' + p_pageNumber +'&ps=500';

            const api_query = await this.APIGetRequest(url);

            const projects : Project[] = api_query["components"];

            return projects;
        }
        catch(error) {
            console.log(error);
            return [{name:'error', key:'', qualifier : '', lastAnalysisDate:''}];
        }            
    }

 

  async getComponents(p_projectKey: string, p_pageNumber: number): Promise<Component[]>{
    try {
        const url = "https://sonarcloud.io/api/components/tree?component=" + p_projectKey + "&p=" + p_pageNumber + "&ps=500";
        
        const api_query = await this.APIGetRequest(url);

        const components : Component [] = api_query["components"];

        return components;
   
    } catch (error) {
      console.log(error); 
      return [{name:'error', path:'', qualifier : ''}];     
    }   
    
  }  

  
    async getProjectMeasures(p_projectKey: string): Promise<Measure[]>{

        try {
            //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
            const url = "https://sonarcloud.io/api/measures/component?component=" + p_projectKey + "&metricKeys=new_technical_debt, blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, new_branch_coverage, conditions_to_cover, new_conditions_to_cover, confirmed_issues, coverage, new_coverage, critical_violations, complexity, last_commit_date, development_cost, new_development_cost, directories, duplicated_blocks, new_duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, new_duplicated_lines, new_duplicated_lines_density, duplications_data, effort_to_reach_maintainability_rating_a, executable_lines_data, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, new_line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, new_lines_to_cover, sqale_rating, new_maintainability_rating, major_violations, minor_violations, ncloc_data, new_blocker_violations, new_bugs, new_code_smells, new_critical_violations, new_info_violations, new_violations, new_lines, new_major_violations, new_minor_violations, new_security_hotspots, new_vulnerabilities, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, new_reliability_rating, reliability_remediation_effort, new_reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, new_security_rating, security_remediation_effort, new_security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, new_sqale_debt_ratio, uncovered_conditions, new_uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
            
            const api_query = await this.APIGetRequest(url);

            const measures : Measure [] = api_query["component"]["measures"];

            return measures;
            
        
        } catch (error) {
            console.log(error);
            return [{metric : 'error', value : ''}];
        }
    
    }

  
    async getComponentMeasures(p_componentKey: string): Promise<Measure[]>{

        try {

            //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
            const url = "https://sonarcloud.io/api/measures/component?component=" + p_componentKey + "&metricKeys=blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, conditions_to_cover, confirmed_issues, coverage, critical_violations, complexity, last_commit_date, development_cost, directories, duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, effort_to_reach_maintainability_rating_a, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, sqale_rating, major_violations, minor_violations, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
            
            const api_query = await this.APIGetRequest(url);

            let measures : Measure [];

            if (!JSON.stringify(api_query).includes("not found")){
                measures = api_query["component"]["measures"];
            }else{
                measures = [{metric : 'not found', value : ''}];
            }

            return measures;         
            
        } catch (error) {   
        console.log(error);
        return [{metric : 'error', value : ''}];
            
        }  
    }
}

export const sonarAPI = new APIDataRecolection();