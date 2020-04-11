"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const metricController_1 = require("../controllers/metricController");
class ProjectRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/api/projects', projectController_1.projectController.listProjects);
        this.router.get('/api/projects/metrics', metricController_1.metricController.listProjectMetrics);
        this.router.get('/api/projects/measures/:idproj/:idmet', projectController_1.projectController.listProjectsMeasures);
    }
}
const projectRoutes = new ProjectRoutes();
exports.default = projectRoutes.router;
