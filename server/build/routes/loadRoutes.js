"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class LoadRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        /*this.router.get('/metrics', loadController.metrics);
        this.router.get('/projects', loadController.projects);
        this.router.get('/components', loadController.components);
        this.router.get('/project_measures', loadController.projectMeasures);
        this.router.get('/component_measures1', loadController.componentMeasures);*/
    }
}
const loadRoutes = new LoadRoutes();
exports.default = loadRoutes.router;
