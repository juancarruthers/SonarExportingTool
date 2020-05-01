"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const metricController_1 = require("../controllers/metricController");
const componentController_1 = require("../controllers/componentController");
class ProjectRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/api/projects', projectController_1.projectController.listProjects);
        this.router.get('/api/projects/metrics', metricController_1.metricController.listProjectMetrics);
        this.router.get('/api/projects/components/metrics', metricController_1.metricController.listComponentMetrics);
        this.router.get('/api/projects/measures/:idproj/:idmet', projectController_1.projectController.listProjectsMeasures);
        this.router.get('/api/projects/components/measures/:idproj/:idmet', componentController_1.componentController.listComponentsMeasures);
        this.router.get('/api/projects/components/measures/count/:idproj/:idmet', componentController_1.componentController.countComponentsMeasures);
        this.router.get('/api/projects/edit/:idproj/:field/:value', projectController_1.projectController.editProject);
    }
}
const projectRoutes = new ProjectRoutes();
exports.default = projectRoutes.router;
