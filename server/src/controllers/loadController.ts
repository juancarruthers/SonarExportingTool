import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';


import fetch from 'cross-fetch';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Metric } from '../models/metric';
import { Project } from '../models/project';
import { Project_measure } from './../models/project_measure';

class LoadController {


  //Carga de las metricas obtenidas de la API de SONAR
  public async metrics(req:Request, res:Response){

    let url = "https://sonarcloud.io/api/metrics/search?p=1&ps=105";

    let api_query = await fetch(url).then(response => {
        return response.json()
    });

    let response = api_query["metrics"];

    for(let met of response){
      let respMetric = new Metric(met["id"], met["key"], met["type"], met["name"], met["description"], met["domain"]);
      pool.then((r: Pool) => r.query('INSERT INTO metrics set ?', [respMetric])
      .catch(err => {
        console.log(err);
      }));
    }
       
    res.json(api_query["metrics"]);

  }

  //Carga de las proyectos analizados de la API de SONAR
  public async projects(req:Request, res:Response){
    try {
      var key: string;
      
      var path = resolve(__dirname,'./key.sonar');       

      key = readFileSync(path, 'utf8');

      //Headers con el token de autorizacion
      let url = 'https://sonarcloud.io/api/projects/search?organization=unne-sonar-corpus&ps=500';
      let head = {
        'content-type' : 'application/json',
        'authorization': 'Basic ' + key  
      };

      let api_query = await fetch(url, {
        method: 'GET',
        headers : head
      })
      .then(response => {
        return response.json()
      })

      let response = api_query["components"];

      for(let proj of response){

        let timestamp = proj["lastAnalysisDate"].split('T');;
        let date = timestamp[0].split('-');
        let time = timestamp[1].split('+');
        let hours = time[0].split(':');
        let ms = time[1];
        let timestampAnalysis = new Date(date[0], date[1] -1, date[2], hours[0], hours[1], hours[2], ms);
        let respProj = new Project(proj["key"], proj["name"], proj["qualifier"], timestampAnalysis);
        pool.then((r: Pool) => r.query('INSERT INTO projects set ?', [respProj])
        .catch(err => {
          console.log(err);
        }));

      }

      res.json(api_query);

    } catch (error) {
      console.log(error);
    }     
          
  }

  //Carga de las metricas obtenidas de la API de SONAR
  public async projectMeasures(req:Request, res:Response){
    
    let projectsKeys = await pool.then((r: Pool) => r.query('SELECT p.idproject, p.key FROM projects AS p')
    .catch(err => {
      console.log(err);
    }));

    for (let proj of projectsKeys){

      //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
      let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + "&metricKeys=new_technical_debt, blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, new_branch_coverage, conditions_to_cover, new_conditions_to_cover, confirmed_issues, coverage, new_coverage, critical_violations, complexity, last_commit_date, development_cost, new_development_cost, directories, duplicated_blocks, new_duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, new_duplicated_lines, new_duplicated_lines_density, duplications_data, effort_to_reach_maintainability_rating_a, executable_lines_data, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, new_line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, new_lines_to_cover, sqale_rating, new_maintainability_rating, major_violations, minor_violations, ncloc_data, new_blocker_violations, new_bugs, new_code_smells, new_critical_violations, new_info_violations, new_violations, new_lines, new_major_violations, new_minor_violations, new_security_hotspots, new_vulnerabilities, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, new_reliability_rating, reliability_remediation_effort, new_reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, new_security_rating, security_remediation_effort, new_security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, new_sqale_debt_ratio, uncovered_conditions, new_uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
      
      let api_query_measures = await fetch(url).then(response => {
        return response.json()
      });

      let response = api_query_measures["component"]["measures"];
     
      for(let mea of response){

        let idMetric = await pool.then((r: Pool) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?',mea["metric"])
        .catch(err => {
          console.log(err);
        }));

        let respMeas = new Project_measure(proj["idproject"], idMetric['0']['idmetric'], mea["value"]);
        await pool.then((r: Pool) => r.query('INSERT INTO project_measures set ?', [respMeas])
        .catch(err => {
          console.log(err);
        }));

      }

    }

    console.log('Process Ended!');

  }


}

export const loadController = new LoadController();