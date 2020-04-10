import { Router } from 'express';

import { projectController } from '../controllers/projectController';

class ProjectRoutes {

    router: Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    config(): void {

        this.router.get('/api/projects', projectController.listProjects);
        this.router.get('/api/projects/measures/:id/:type', projectController.downloadProjectMeasures);
    }

}

const projectRoutes = new ProjectRoutes();
export default projectRoutes.router;
