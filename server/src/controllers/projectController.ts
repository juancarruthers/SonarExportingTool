import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';
import { Project } from '../models/project'


class ProjectController {

    constructor(){
    }

    public async listProjects (req:Request, res:Response): Promise<void>{

        const query : Project [] = await pool
            .then((r: Pool) => r
            .query('SELECT * FROM projects')
            )
            .catch(err =>{
                console.log(err)
            });    
        res.json(query);

    }   

    public async listProjectsMeasures (req:Request, res:Response){ 
        const { idproj } = req.params;
        const { idmet } = req.params;

        const projectsIds  = idproj.split(',');
        const metricsIds  = idmet.split(',');  

        let queryProject = await pool
            .then((r: Pool) => r
            .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? ) ORDER BY p.idproject ASC',[projectsIds])
            )
            .catch(err =>{
                console.log(err)
            });
            let index: number = 0;

        for(let proj of queryProject){
            let queryMeasures = await pool
            .then((r: Pool) => r
            .query('SELECT m.key, m.type, m.name, m.description, m.domain, pm.value FROM project_measures AS pm JOIN metrics as m ON pm.idmetric = m.idmetric WHERE idproject = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC',[proj['idproject'],metricsIds])
            )
            .catch(err =>{
                console.log(err)
            });

            proj['project_measure'] = queryMeasures;
    
            queryProject[index] = proj;

            index = index + 1;
        }

        res.json(queryProject);
        
    }

}

export const projectController = new ProjectController();