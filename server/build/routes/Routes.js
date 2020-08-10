"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TokenAuthorization_1 = __importDefault(require("../TokenAuthorization/TokenAuthorization"));
const projectController_1 = require("../controllers/projectController");
const metricController_1 = require("../controllers/metricController");
const componentController_1 = require("../controllers/componentController");
const refreshAPIController_1 = require("../controllers/refreshAPIController");
class Routes {
    constructor() {
        this.rootPath = "/api";
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // Define an endpoint that must be called with an access token
        // private routes
        this.router.put(this.rootPath + "/projects", TokenAuthorization_1.default.getCheckJwt(), projectController_1.projectController.editProject);
        this.router.post(this.rootPath + "/projects/update", TokenAuthorization_1.default.getCheckJwt(), refreshAPIController_1.refreshAPIController.refreshProjects);
        this.router.get(this.rootPath + "/projects/update", TokenAuthorization_1.default.getCheckJwt(), refreshAPIController_1.refreshAPIController.getProjectsToUpdate);
        //public routes
        //projects
        this.router.get(this.rootPath + '/projects', projectController_1.projectController.listProjects);
        this.router.get(this.rootPath + '/projects/measures/:idproj/:idmet', projectController_1.projectController.listProjectsMeasures);
        this.router.get(this.rootPath + '/projects/components/:idproj', projectController_1.projectController.listProjectsComponents);
        //components             
        this.router.get(this.rootPath + '/components/measures/:idproj/:idmet', componentController_1.componentController.listComponentsMeasures);
        this.router.get(this.rootPath + '/components/measures/count/:idproj/:idmet', componentController_1.componentController.countComponentsMeasures);
        //metrics
        this.router.get(this.rootPath + '/metrics/projects', metricController_1.metricController.listProjectMetrics);
        this.router.get(this.rootPath + '/metrics/components', metricController_1.metricController.listComponentMetrics);
        //another routes...
        this.router.get("*", (req, res) => { res.status(404).json({ "Error": "Element not found in " + req.url }); });
    }
}
const routes = new Routes();
exports.default = routes.router;
