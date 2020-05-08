import { promisify } from 'util';
import { PromisifiedConnection } from '../database';
import mysql from 'mysql';
import keys from '../keys';

export class DBOperations{

    private connection: PromisifiedConnection;

    constructor(){
        this.connection = this.getConnection();
    }


    //USE OF A CONNECTION INSTEAD OF A POOL BECAUSE IS NOT POSSIBLE TO MAKE BLOCK TANSACTIONS WITH MULTIPLE CONNECTIONS
    getConnection(): PromisifiedConnection{

        const connection : PromisifiedConnection = mysql.createConnection(keys.database);
        connection.connect();
        console.log('Connection Established');
        connection.query = promisify(connection.query);
        return connection;
    }

    //DESTROYS THE CONNECTION
    closeConnection(): void{
        this.connection.destroy();
    }

    /*
     --->>>QUERIES FOR ROWS    
    */

    //PROJECTS

    async getProjectKeys(p_projectsKeyList: string[]) : Promise <any>{
        try {
            let projectsKeys : any;
            if (p_projectsKeyList.length > 0){
                projectsKeys = await this.connection
                    .query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList])
            }else{
                projectsKeys = [];
            }
    
            //Return tuple with values idproject and key
            return projectsKeys;
            
        } catch (error) {
            console.log(error)
        }            
    }

    async getProjectLastAnalysis(p_projKey: string): Promise<any>{
        try {
            const lastAnalysis = await this.connection
                .query('SELECT `lastAnalysis` FROM projects WHERE `key` = ?', p_projKey);
            return lastAnalysis[0]['lastAnalysis'];
            
        } catch (error) {
            console.log(error)
        }
        
    }

    //COMPONENTS

    async getComponentPathsOfProyects(p_project: string) : Promise <any>{
        try {
            const componentsPath = await this.connection
                .query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?', p_project);
            return componentsPath;
            
        } catch (error) {
            console.log(error)
        }
             
    }

    //MEASURES

    async getProjectIdMeasure(p_idproject: number, p_idmetric : number): Promise<any>{
        try {
            const queryIdmeasure = await this.connection        
                .query('SELECT pm.idmeasure AS id FROM project_measures AS pm WHERE pm.idproject = ? AND pm.idmetric = ?',[p_idproject, p_idmetric]);

            let value : number;
            if(queryIdmeasure.length == 0){
                value = 0;
            }else{
                value = queryIdmeasure[0]['id'];
            }
         
            return value;           
        } catch (error) {
            console.log(error)
        }       
    }
    
    
    async getComponentIdMeasure(p_idcomponent: number, p_idmetric : number): Promise<any>{
        try {
            const queryIdmeasure = await this.connection
                .query('SELECT cm.idmeasure AS id FROM component_measures AS cm WHERE cm.idcomponent = ? AND cm.idmetric = ?',[p_idcomponent, p_idmetric]);
            let value : number;
            if(queryIdmeasure.length == 0){
                value = 0;
            }else{
                value = queryIdmeasure[0]['id'];
            }         
            return value  
            
        } catch (error) {
            console.log(error)
        }   
    }

    //METRICS
    
    async getMetricId(p_metricKey: string): Promise<any>{
        try {

            const idMetric = await this.connection
                .query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', p_metricKey);
                
            return idMetric[0]['idmetric'];

        } catch (error) {
            console.log(error);
        }  
        
    }

    //LASTUPDATE TABLE
    
    
    async getDateLastAnalysis(): Promise<any>{
        try {
            const queryDateLastAnalysis = await this.connection
                .query('SELECT date FROM lastUpdate');
    
            return queryDateLastAnalysis[0]['date'];
            
        } catch (error) {
            console.log(error)
        }
        
                  
    }
    
 
    
    /*
     --->>>QUERIES FOR BOOLEANS (CHECKS EXISTANCE)   
    */

    //PROJECTS

    async checkProjectExists(p_projectKey : string): Promise<boolean|undefined>{
        try {
            const querykeyProj = await this.connection
                .query('SELECT p.key FROM projects AS p WHERE p.key = ?',p_projectKey);

            let value = true;

            if(querykeyProj.length == 0){
                value = false;
            }

            return value; 
            
        } catch (error) {
            console.log(error)
        }
                       
    }  

    //COMPONENTS

    async checkComponentExists(p_idproject: number, p_componentPath : string): Promise<boolean|undefined>{

        try {
            const queryNameComp = await this.connection
                .query('SELECT c.name FROM components AS c WHERE c.idproject = ? AND c.path = ?',[p_idproject, p_componentPath]);

            let value = true;

            if(queryNameComp.length == 0){
                value = false;
            }

            return value;
            
        } catch (error) {
            console.log(error)
        }
        
                   
    }
    
    /*
     --->>>INSERTIONS   
    */

    //METRICS
    //To adapt the data from the API to the Database send the values of p_metrics as an array of arrays, e.g. [[idmetric, key, type, name, description, domain]]
    async insertMetrics(p_metrics: any): Promise<void>{
        try {
            await this.connection
                .query('INSERT INTO `projects` (`idmetric`, `key`, `type`, `name`, `description`, `domain`) VALUES  ?', [p_metrics]);          
        } catch (error) {
            console.log(error)
        }
        
    }

    //PROJECTS
    
    async insertProjects(p_projects: any):Promise<void>{
        try {
            await this.connection
                .query('INSERT INTO `projects` (`key`,`name`,`qualifier`,`lastAnalysis`) VALUES  ?', [p_projects]);         
        } catch (error) {
            console.log(error)
        }
        
    }

    //COMPONENTS
    
    async insertComponents(p_components: any):Promise<void>{  
        try {
            await this.connection
                .query('INSERT INTO `components` (`idproject`,`name`,`qualifier`,`path`,`language`) VALUES ?', [p_components]);
        } catch (error) {
            console.log(error)
        } 
        
    }

    //PROJECTS' MEASURES
    
    async insertProjectMeasures(p_measures: any):Promise<void>{
        try {
            await this.connection
                .query('INSERT INTO `project_measures` (`idproject`, `idmetric`, `value`) VALUES ?', [p_measures]);
        } catch (error) {
            console.log(error)
        }
        
    }

    //COMPONENTS' MEASURES
    
    async insertComponentMeasures(p_measures: any):Promise<void>{
        try {
            await this.connection
                .query('INSERT INTO `component_measures` (`idcomponent`, `idmetric`,`value`) VALUES ?', [p_measures]);
        } catch (error) {
            console.log(error)
        }
        
    }
    
    /*
     --->>>DELETES   
    */
    
    async deleteComponentAndMeasures(p_idcomponent: number):Promise<void>{
        try {
            await this.connection
                .query('DELETE FROM component_measures WHERE idcomponent = ?', p_idcomponent);

            await this.connection
                .query('DELETE FROM components WHERE idcomponent = ?', p_idcomponent);
        } catch (error) {
            console.log(error)
        }
        
    }

    async deleteProjectsNotFullyLoad(){
        try {
            await this.connection
                .query('DELETE FROM projects WHERE idproject NOT IN (SELECT idproject FROM project_measures GROUP BY idproject);');
        } catch (error) {
            console.log(error)
        }
        
    }
    
    /*
     --->>>UPDATES   
    */

    //LASTUPDATE TABLE
    
    async updateDateLastAnalysis(): Promise<void>{
        try {
            const date = new Date();
            await this.connection
                .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date);
        } catch (error) {
            console.log(error)
        }
        
    }

    //LASTANALYSIS OF A PROJECT

    async updateProjLastAnalysis(p_projectKey : string, p_dateLastAnalysis : Date):Promise<void>{
        try {
            await this.connection
                .query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [p_dateLastAnalysis, p_projectKey]);
        } catch (error) {
            console.log(error)
        }
        
    }

    //PROJECT MEASURE

    async updateProjMeasure(p_idmeasure: number, p_measureValue : string): Promise<void>{
        try {
            await this.connection
                .query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure]);
        } catch (error) {
            console.log(error)
        }
        
    }

    //COMPONENT MEASURE

    async updateCompMeasure(p_idmeasure: number, p_measureValue : string): Promise<void>{
        try {
            await this.connection
                .query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure]);
        } catch (error) {
            console.log(error)
        }
        
    }
    
    /*
     --->>>TRANSACTIONAL OPERATIONS   
    */

    //BEGIN AND END SEGMENTS OF A TRANSACTION (START TRANSACTION, COMMIT, ROLLBACK)

    async transactionalOperation(p_operation: string) : Promise<void>{
        try {
            await this.connection.query(p_operation + ';');
        } catch (error) {
            console.log(error)
        }
    }  
}