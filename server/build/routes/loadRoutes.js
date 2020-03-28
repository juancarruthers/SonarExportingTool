"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loadController_1 = require("../controllers/loadController");
class LoadRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/metrics', loadController_1.loadController.metrics);
        this.router.get('/projects', loadController_1.loadController.projects);
        this.router.get('/project_measures', loadController_1.loadController.projectMeasures);
    }
}
const loadRoutes = new LoadRoutes();
exports.default = loadRoutes.router;
