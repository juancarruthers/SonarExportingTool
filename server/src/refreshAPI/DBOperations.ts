import pool from '../database';
import { Pool } from 'promise-mysql';

class DBOperations{

    //GETS

    async getProjectIdMeasure(p_idproject: number, p_idmetric : number): Promise<number>{
  
        const queryIdmeasure = await pool
        .then((r: Pool) => r
            .query('SELECT pm.idmeasure AS id FROM project_measures AS pm WHERE pm.idproject = ? AND pm.idmetric = ?',[p_idproject, p_idmetric])
            .catch(err =>{
                console.log(err);
            })
        );

        let value : number;
        if(queryIdmeasure.length == 0){
            value = 0;
        }else{
            value = queryIdmeasure[0]['id'];
        }
          
        return value;           
    }
    
    
    async getComponentIdMeasure(p_idcomponent: number, p_idmetric : number): Promise<number>{
        
        const queryIdmeasure = await pool
        .then((r: Pool) => r
            .query('SELECT cm.idmeasure AS id FROM component_measures AS cm WHERE cm.idcomponent = ? AND cm.idmetric = ?',[p_idcomponent, p_idmetric])
            .catch(err =>{
                console.log(err);
            })
        );

        let value : number;

        if(queryIdmeasure.length == 0){
            value = 0;
        }else{
            value = queryIdmeasure[0]['id'];
        }
          
        return value   
    }
    
    async getMetricId(p_metricKey: string): Promise<number>{
        const idMetric = await pool
        .then((r: Pool) => r
            .query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', p_metricKey)
            .catch(err => {
                console.log(err);
            })
        );
        return idMetric[0]['idmetric'];
    }
    
    
    async getDateLastAnalysis(): Promise<Date>{
        
        const queryDateLastAnalysis = await pool
        .then((r: Pool) => r
            .query('SELECT date FROM lastUpdate')
            .catch(err =>{
                console.log(err);
            })
        );
    
        return queryDateLastAnalysis[0]['date'];          
    }
    
    async getProjectKeys(p_projectsKeyList: string[]) : Promise <any>{
        const projectsKeys = await pool
        .then((r: Pool) => r
            .query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList])
            .catch(err => {
                console.log(err);
            })
        );
    
        //Return tuple with values idproject and key
        return projectsKeys;     
    }
    
    async getComponentPathsOfProyects(p_project: string) : Promise <any>{
        const componentsPath = await pool
        .then((r: Pool) => r
            .query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?',p_project)
            .catch(err => {
                console.log(err);
            })
        );

        //Return tuple with values idcomponent and path
        return componentsPath;     
    }
    
    //INSERT
    
    async insertProjects(p_projects: any):Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('INSERT INTO `projects` (`key`,`name`,`qualifier`,`lastAnalysis`) VALUES  ?', [p_projects])
            .catch(err => {
                console.log(err);
            })
        );
    }
    
    async insertComponents(p_components: any):Promise<void>{   
        await pool
        .then((r: Pool) => r
            .query('INSERT INTO `components` (`idproject`,`name`,`qualifier`,`path`,`language`) VALUES ?', [p_components])
            .catch(err => {
                console.log(err);
            })
        );
    }
    
    async insertProjectMeasures(p_measures: any):Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('INSERT INTO `project_measures` (`idproject`, `idmetric`, `value`) VALUES ?', [p_measures])
            .catch(err => {
                console.log(err);
            })
        );
    }
    
    async insertComponentMeasures(p_measures: any):Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('INSERT INTO `component_measures` (`idcomponent`, `idmetric`,`value`) VALUES ?', [p_measures])
            .catch(err => {
                console.log(err);
            })
        );
    }
    
    //DELETE
    
    async deleteComponentAndMeasures(p_idcomponent: number):Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('DELETE FROM component_measures WHERE idcomponent = ?', p_idcomponent)
            .catch(err =>{
                console.log(err);
            })
        );

        await pool
        .then((r: Pool) => r
            .query('DELETE FROM components WHERE idcomponent = ?', p_idcomponent)
            .catch(err =>{
                console.log(err);
            })
        );
    }
    
    //UPDATE
    
    async updateDateLastAnalysis(): Promise<void>{
        const date = new Date();
        await pool
        .then((r: Pool) => r
            .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date)
            .catch(err =>{
                console.log(err);
            })
        );          
    }

    async updateProjLastAnalysis(p_projectKey : string, p_dateLastAnalysis : Date):Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [p_dateLastAnalysis, p_projectKey])
            .catch(err => {
                console.log(err);
            })
        );
    }

    async updateProjMeasure(p_idmeasure: number, p_measureValue : string): Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure])
            .catch(err => {
                console.log(err);
            })
        );
    }

    async updateCompMeasure(p_idmeasure: number, p_measureValue : string): Promise<void>{
        await pool
        .then((r: Pool) => r
            .query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure])
            .catch(err => {
                console.log(err);
            })
        );
    }
    
      //CHECK EXISTANCE
    
    async checkProjectExists(p_projectKey : string): Promise<boolean>{
        
        const querykeyProj = await pool
        .then((r: Pool) => r
            .query('SELECT p.key FROM projects AS p WHERE p.key = ?',p_projectKey)
            .catch(err =>{
                console.log(err)
            })
        );

        let value = true;

        if(querykeyProj.length == 0){
            value = false;
        }

        return value;          
    }  
    
    
    async checkComponentExists(p_idproject: number, p_componentPath : string): Promise<boolean>{
        
        const queryNameComp = await pool
        .then((r: Pool) => r
            .query('SELECT c.name FROM components AS c WHERE c.idproject = ? AND c.path = ?',[p_idproject, p_componentPath])
            .catch(err =>{
                console.log(err)
            })
        );

        let value = true;

        if(queryNameComp.length == 0){
            value = false;
        }

        return value;           
    }

    async transactionalOperation(p_operation: string) : Promise<void>{
        await pool
        .then((r: Pool) => r
            .query(p_operation + ';')
            .catch(err =>{
                console.log(err)
            })
        );

    }

    async transactionalAutoCommit(p_state: number) : Promise<void>{
        await (await (await pool).getConnection())
        .query("SET AUTOCOMMIT="+p_state + ';');
    }
    
}

export const database = new DBOperations();