import { Router } from 'express';

import { indexController } from '../controllers/indexController';

class IndexRoutes {

    router: Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    config(): void {
        this.router.get('/', indexController.metricLoad);
    }

}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;