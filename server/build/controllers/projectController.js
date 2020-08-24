"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const checkNumericArray_1 = __importDefault(require("../checkNumericArray"));
class ProjectController {
    listProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = yield database_1.default
                    .query('SELECT * FROM projects ORDER BY lastAnalysis DESC');
                res.set('Content-Type', 'application/json');
                res.json(query);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query;
                const { idproj } = req.params;
                const projectsIds = idproj.split(',');
                if (checkNumericArray_1.default.checkArray(projectsIds)) {
                    query = yield database_1.default
                        .query('SELECT * FROM projects WHERE idproject IN ( ? ) ORDER BY lastAnalysis DESC', [projectsIds]);
                }
                else {
                    query = { "Error": "The ids should be numeric values." };
                }
                res.set('Content-Type', 'application/json');
                res.json(query);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let projectUpdate of req.body) {
                    yield database_1.default
                        .query('UPDATE projects SET projectLink = ?, version = ? WHERE idproject = ?', projectUpdate);
                }
                res.set('Content-Type', 'application/json');
                res.json('Request completed successfully');
            }
            catch (error) {
                console.log(error);
                res.set('Content-Type', 'application/json');
                res.json('Request could not be fullfilled');
            }
        });
    }
    listProjectsMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idproj } = req.params;
                const { idmet } = req.params;
                const projectsIds = idproj.split(',');
                const metricsIds = idmet.split(',');
                let queryProject;
                if (checkNumericArray_1.default.checkArray(projectsIds) && checkNumericArray_1.default.checkArray(metricsIds)) {
                    queryProject = yield database_1.default
                        .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? ) ORDER BY p.idproject ASC', [projectsIds]);
                    let index = 0;
                    for (let proj of queryProject) {
                        let queryMeasures = yield database_1.default
                            .query('SELECT m.domain, m.key, m.name, m.description, m.type, pm.value FROM project_measures AS pm JOIN metrics as m ON pm.idmetric = m.idmetric WHERE idproject = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC', [proj['idproject'], metricsIds]);
                        proj['project_measure'] = queryMeasures;
                        queryProject[index] = proj;
                        index = index + 1;
                    }
                }
                else {
                    queryProject = { "Error": "The ids should be numeric values." };
                }
                res.set('Content-Type', 'application/json');
                res.json(queryProject);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    listProjectsComponents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idproj } = req.params;
                const projectsIds = idproj.split(',');
                let queryProjects;
                if (checkNumericArray_1.default.checkArray(projectsIds)) {
                    if (projectsIds.length <= 5) {
                        queryProjects = yield database_1.default
                            .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? ) ORDER BY p.idproject ASC', [projectsIds]);
                        let index = 0;
                        for (let proj of queryProjects) {
                            let queryMeasures = yield database_1.default
                                .query('SELECT * FROM components WHERE idproject = ? ORDER BY idcomponent ASC', proj['idproject']);
                            proj['component'] = queryMeasures;
                            queryProjects[index] = proj;
                            index = index + 1;
                        }
                    }
                    else {
                        queryProjects = { "Error": "You cannot ask for more than 5 projects at once" };
                    }
                }
                else {
                    queryProjects = { "Error": "The ids should be numeric values." };
                }
                res.set('Content-Type', 'application/json');
                res.json(queryProjects);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    counts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projects = yield database_1.default
                    .query('SELECT count(idproject) as `count` FROM projects');
                const components = yield database_1.default
                    .query('SELECT count(idcomponent) as `count` FROM components');
                const projMeasures = yield database_1.default
                    .query('SELECT count(idproject) as `count` FROM project_measures');
                const compMeasures = yield database_1.default
                    .query('SELECT count(idcomponent) as `count` FROM component_measures');
                res.json({ "projects": projects[0]["count"],
                    "components": components[0]["count"],
                    "projMeasures": projMeasures[0]["count"],
                    "compMeasures": compMeasures[0]["count"] });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.projectController = new ProjectController();
