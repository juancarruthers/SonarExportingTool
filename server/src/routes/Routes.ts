import { Router } from 'express';
import tokenAuthorization from '../TokenAuthorization/TokenAuthorization';
import { projectController } from '../controllers/projectController';
import { metricController } from '../controllers/metricController';
import { componentController } from '../controllers/componentController';
import { refreshAPIController } from '../controllers/refreshAPIController';

class Routes {

    rootPath: string;
    router: Router;

    constructor(){
        this.rootPath = "/api";
        this.router = Router();
        this.config();
    }

    private config(): void {
        // Define an endpoint that must be called with an access token
        // private routes
        this.router.put(this.rootPath + "/projects", tokenAuthorization.getCheckJwt(), projectController.editProject);
        this.router.post(this.rootPath + "/projects/update", tokenAuthorization.getCheckJwt(), refreshAPIController.refreshProjects);
        this.router.get(this.rootPath + "/projects/update", tokenAuthorization.getCheckJwt(), refreshAPIController.getProjectsToUpdate);

        //public routes
        //projects
        this.router.get(this.rootPath + '/projects', projectController.listProjects);       
        this.router.get(this.rootPath + '/projects/measures/:idproj/:idmet', projectController.listProjectsMeasures);
        this.router.get(this.rootPath + '/projects/components/:idproj', projectController.listProjectsComponents);
        
        //components             
        this.router.get(this.rootPath + '/components/measures/:idproj/:idmet', componentController.listComponentsMeasures);
        this.router.get(this.rootPath + '/components/measures/count/:idproj/:idmet', componentController.countComponentsMeasures);

        //metrics
        this.router.get(this.rootPath + '/metrics/projects', metricController.listProjectMetrics); 
        this.router.get(this.rootPath + '/metrics/components', metricController.listComponentMetrics); 

        //another routes...
        this.router.get("*", (req, res) => { res.status(404).json({"Error":"Element not found in " + req.url}) } );
        
    }

}

const routes = new Routes();
export default routes.router;
