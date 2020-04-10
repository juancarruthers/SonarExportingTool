import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';
import fs from 'fs';
import { parse } from 'js2xmlparser';


class ProjectController {

    dir : string;

    constructor(){
        this.dir = '/tmp/sonar';
    }

    public async listProjects (req:Request, res:Response): Promise<void>{

        const query = await pool
            .then((r: Pool) => r
            .query('SELECT * FROM projects')
            )
            .catch(err =>{
                console.log(err)
            });    
        res.json(query);

    }   

    public async listProjectsMeasures (p_paramsReceived: Array<string>): Promise<any>{   
        let queryProject = await pool
            .then((r: Pool) => r
            .query('SELECT * FROM projects WHERE idproject IN ( ? )',[p_paramsReceived])
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

        return queryProject;
        
    }

    public async downloadProjectMeasures(req:Request, res:Response){
        const { id } = req.params;
        const { type } = req.params;
        const projectsIds  = id.split(',');

        let projectMeasures = await projectController.listProjectsMeasures(projectsIds);

        if (!fs.existsSync(projectController.dir)){
            fs.mkdirSync(projectController.dir);
        }   
        
        switch (type) {
            case 'json':

                let file = JSON.stringify(projectMeasures);
                fs.writeFile('/tmp/sonar/projects_measures.json',file, function (err) {
                    if (err) console.log(err);
                    res.download('/tmp/sonar/projects_measures.json');
                });

            break;
        
            case 'xml':

                let xml = parse('projects',projectMeasures);
                fs.writeFile('/tmp/sonar/projects_measures.xml',xml, function (err) {
                    if (err) console.log(err);
                    res.download('/tmp/sonar/projects_measures.xml');
                });

            break;

            case 'csv':
            break;
        }
        
    }
    

}

export const projectController = new ProjectController();