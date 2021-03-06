import { Request, Response } from 'express';
import pool from '../database';
import numericArrayChecker from '../checkNumericArray';

class ProjectController {

    public async listProjects (req:Request, res:Response): Promise<void>{
        try {
            const query = await pool
                .query('SELECT * FROM projects ORDER BY lastAnalysis DESC');
            
            res.set('Content-Type', 'application/json');
            res.json(query);
        } catch (error) {
            console.log(error);
        }
    } 
    
    public async getProjects (req:Request, res:Response): Promise<void>{
        try {
            let query : any;
            const { idproj } = req.params;
            const projectsIds  = idproj.split(','); 

            if (numericArrayChecker.checkArray(projectsIds)){
                query = await pool
                    .query('SELECT * FROM projects WHERE idproject IN ( ? ) ORDER BY lastAnalysis DESC',[projectsIds]);
            }else{
                query = {"Error" : "The ids should be numeric values."};
            }          
            
            res.set('Content-Type', 'application/json');
            res.json(query);
        } catch (error) {
            console.log(error);
        }
    }

    public async editProject (req:Request, res:Response): Promise<void>{
        try {
            for (let projectUpdate of req.body){
                await pool
                    .query('UPDATE projects SET projectLink = ?, version = ? WHERE idproject = ?', projectUpdate);               
            }  
            res.set('Content-Type', 'application/json');
            res.json('Request completed successfully');

        } catch (error) {
            console.log(error);
            res.set('Content-Type', 'application/json');
            res.json('Request could not be fullfilled');
        }

            
    } 

    public async listProjectsMeasures (req:Request, res:Response){ 
        try {
            const { idproj } = req.params;
            const { idmet } = req.params;

            const projectsIds  = idproj.split(',');
            const metricsIds  = idmet.split(',');
            
            let queryProject: any;

            if (numericArrayChecker.checkArray(projectsIds) && numericArrayChecker.checkArray(metricsIds)){

                queryProject = await pool
                    .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? ) ORDER BY p.idproject ASC',[projectsIds]);
                
                let index: number = 0;

                for(let proj of queryProject){
                    let queryMeasures = await pool
                    .query('SELECT m.domain, m.key, m.name, m.description, m.type, pm.value FROM project_measures AS pm JOIN metrics as m ON pm.idmetric = m.idmetric WHERE idproject = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC',[proj['idproject'],metricsIds]);

                    proj['project_measure'] = queryMeasures;
            
                    queryProject[index] = proj;

                    index = index + 1;
                }

            }else{
                queryProject = {"Error" : "The ids should be numeric values."};
            }

            res.set('Content-Type', 'application/json');
            res.json(queryProject);
        } catch (error) {
            console.log(error);
        }     
    }

    public async listProjectsComponents (req:Request, res:Response){ 
        try {
            const { idproj } = req.params;

            const projectsIds  = idproj.split(',');

            let queryProjects: any;

            if (numericArrayChecker.checkArray(projectsIds)){

                if (projectsIds.length <= 5){

                    queryProjects = await pool
                        .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? ) ORDER BY p.idproject ASC',[projectsIds]);
                    
                    let index: number = 0;

                    for(let proj of queryProjects){
                        let queryMeasures = await pool
                        .query('SELECT * FROM components WHERE idproject = ? ORDER BY idcomponent ASC', proj['idproject']);

                        proj['component'] = queryMeasures;
                
                        queryProjects[index] = proj;

                        index = index + 1;
                    }

                }else{
                    queryProjects = {"Error" : "You cannot ask for more than 5 projects at once"};
                }
                
            }else{
                queryProjects = {"Error" : "The ids should be numeric values."};
            } 

            res.set('Content-Type', 'application/json');
            res.json(queryProjects);
        } catch (error) {
            console.log(error);
        }     
    }

    public async counts (req:Request, res:Response){ 
        try {
            
            const projects = await pool
                .query('SELECT count(idproject) as `count` FROM projects');
            const components = await pool
                .query('SELECT count(idcomponent) as `count` FROM components');
            const projMeasures = await pool
                .query('SELECT count(idproject) as `count` FROM project_measures');
            const compMeasures = await pool
                .query('SELECT count(idcomponent) as `count` FROM component_measures');

           res.json({"projects": projects[0]["count"],
                     "components": components[0]["count"],
                     "projMeasures": projMeasures[0]["count"],
                     "compMeasures": compMeasures[0]["count"]});
                
        } catch (error) {
            console.log(error);
        }
              
    }

}

export const projectController = new ProjectController();