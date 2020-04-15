import { Router } from 'express';

import { projectController } from '../controllers/projectController';
import { metricController } from '../controllers/metricController';
import { componentController } from '../controllers/componentController';

class ProjectRoutes {

    router: Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    config(): void {

        this.router.get('/api/projects', projectController.listProjects);
        this.router.get('/api/projects/metrics', metricController.listProjectMetrics);
        this.router.get('/api/projects/components/metrics', metricController.listComponentMetrics);
        this.router.get('/api/projects/measures/:idproj/:idmet', projectController.listProjectsMeasures);
        this.router.get('/api/projects/components/measures/:idproj/:idmet', componentController.listComponentsMeasures);
        this.router.get('/api/projects/components/measures/count/:idproj/:idmet', componentController.countComponentsMeasures);
    }

}

const projectRoutes = new ProjectRoutes();
export default projectRoutes.router;
