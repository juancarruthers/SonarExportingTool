import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';
import fs from 'fs';
import { parse } from 'js2xmlparser';

class ProjectController {

  public async listProjects (req:Request, res:Response){

    const query = await pool
        .then((r: Pool) => r
        .query('SELECT * FROM projects')
        )
        .catch(err =>{
            console.log(err)
        });    
    res.json(query);

}

public async listProjectsMeasures (req:Request, res:Response){

    let queryProject = await pool
        .then((r: Pool) => r
        .query('SELECT * FROM projects')
        )
        .catch(err =>{
            console.log(err)
        });

        let index: number = 0;

    for(let proj of queryProject){
        let queryMeasures = await pool
        .then((r: Pool) => r
        .query('SELECT m.key, m.type, m.name, m.description, m.domain, pm.value FROM project_measures AS pm JOIN metrics as m ON pm.idmetric = m.idmetric WHERE idproject = ? ORDER BY m.domain ASC',proj['idproject'])
        )
        .catch(err =>{
            console.log(err)
        });

        proj['measures'] = queryMeasures;
  
        queryProject[index] = proj;

        index = index + 1;
    }
    
    //let xml = parse('projects',queryProject);

    let file = JSON.stringify(queryProject);
    
    fs.writeFile('/tmp/sonar/projects_measures.json',file, function (err) {
        if (err) console.log(err);
        res.download('/tmp/sonar/projects_measures.json');
    });


    /*fs.writeFile('/tmp/sonar/projects_measures.xml',xml, function (err) {
        if (err) console.log(err);
        res.download('/tmp/sonar/projects_measures.xml');
    });*/
}

}

export const projectController = new ProjectController();