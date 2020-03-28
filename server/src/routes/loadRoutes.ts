import { Router } from 'express';

import { loadController } from '../controllers/loadController';

class LoadRoutes {

    router: Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    config(): void {
        this.router.get('/metrics', loadController.metrics);
        this.router.get('/projects', loadController.projects);
        this.router.get('/project_measures', loadController.projectMeasures);
    }

}

const loadRoutes = new LoadRoutes();
export default loadRoutes.router;