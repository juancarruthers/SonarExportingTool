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
        this.router.get('/api/projects/measures', projectController.listProjectsMeasures);
    }

}

const projectRoutes = new ProjectRoutes();
export default projectRoutes.router;
