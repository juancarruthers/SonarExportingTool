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
class DBOperations {
    /*
     --->>>QUERIES FOR ROWS
    */
    //PROJECTS
    getProjectKeys(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectsKeys;
            if (p_projectsKeyList.length > 0) {
                projectsKeys = yield database_1.default
                    .then((r) => r
                    .query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList])
                    .catch(err => {
                    console.log(err);
                }));
            }
            else {
                projectsKeys = [];
            }
            //Return tuple with values idproject and key
            return projectsKeys;
        });
    }
    getProjectLastAnalysis(p_projKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastAnalysis = yield database_1.default
                .then((r) => r
                .query('SELECT `lastAnalysis` FROM projects WHERE `key` = ?', p_projKey)
                .catch(err => {
                console.log(err);
            }));
            return lastAnalysis[0]['lastAnalysis'];
        });
    }
    //COMPONENTS
    getComponentPathsOfProyects(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            const componentsPath = yield database_1.default
                .then((r) => r
                .query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?', p_project)
                .catch(err => {
                console.log(err);
            }));
            //Return tuple with values idcomponent and path
            return componentsPath;
        });
    }
    //MEASURES
    getProjectIdMeasure(p_idproject, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryIdmeasure = yield database_1.default
                .then((r) => r
                .query('SELECT pm.idmeasure AS id FROM project_measures AS pm WHERE pm.idproject = ? AND pm.idmetric = ?', [p_idproject, p_idmetric])
                .catch(err => {
                console.log(err);
            }));
            let value;
            if (queryIdmeasure.length == 0) {
                value = 0;
            }
            else {
                value = queryIdmeasure[0]['id'];
            }
            return value;
        });
    }
    getComponentIdMeasure(p_idcomponent, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryIdmeasure = yield database_1.default
                .then((r) => r
                .query('SELECT cm.idmeasure AS id FROM component_measures AS cm WHERE cm.idcomponent = ? AND cm.idmetric = ?', [p_idcomponent, p_idmetric])
                .catch(err => {
                console.log(err);
            }));
            let value;
            if (queryIdmeasure.length == 0) {
                value = 0;
            }
            else {
                value = queryIdmeasure[0]['id'];
            }
            return value;
        });
    }
    //METRICS
    getMetricId(p_metricKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const idMetric = yield database_1.default
                .then((r) => r
                .query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', p_metricKey)
                .catch(err => {
                console.log(err);
            }));
            return idMetric[0]['idmetric'];
        });
    }
    //LASTUPDATE TABLE
    getDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryDateLastAnalysis = yield database_1.default
                .then((r) => r
                .query('SELECT date FROM lastUpdate')
                .catch(err => {
                console.log(err);
            }));
            return queryDateLastAnalysis[0]['date'];
        });
    }
    /*
     --->>>QUERIES FOR BOOLEANS (CHECKS EXISTANCE)
    */
    //PROJECTS
    checkProjectExists(p_projectKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const querykeyProj = yield database_1.default
                .then((r) => r
                .query('SELECT p.key FROM projects AS p WHERE p.key = ?', p_projectKey)
                .catch(err => {
                console.log(err);
            }));
            let value = true;
            if (querykeyProj.length == 0) {
                value = false;
            }
            return value;
        });
    }
    //COMPONENTS
    checkComponentExists(p_idproject, p_componentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryNameComp = yield database_1.default
                .then((r) => r
                .query('SELECT c.name FROM components AS c WHERE c.idproject = ? AND c.path = ?', [p_idproject, p_componentPath])
                .catch(err => {
                console.log(err);
            }));
            let value = true;
            if (queryNameComp.length == 0) {
                value = false;
            }
            return value;
        });
    }
    /*
     --->>>INSERTIONS
    */
    //PROJECTS
    insertProjects(p_projects) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('INSERT INTO `projects` (`key`,`name`,`qualifier`,`lastAnalysis`) VALUES  ?', [p_projects])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //COMPONENTS
    insertComponents(p_components) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('INSERT INTO `components` (`idproject`,`name`,`qualifier`,`path`,`language`) VALUES ?', [p_components])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //PROJECTS' MEASURES
    insertProjectMeasures(p_measures) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('INSERT INTO `project_measures` (`idproject`, `idmetric`, `value`) VALUES ?', [p_measures])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //COMPONENTS' MEASURES
    insertComponentMeasures(p_measures) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('INSERT INTO `component_measures` (`idcomponent`, `idmetric`,`value`) VALUES ?', [p_measures])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    /*
     --->>>DELETES
    */
    deleteComponentAndMeasures(p_idcomponent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('DELETE FROM component_measures WHERE idcomponent = ?', p_idcomponent)
                .catch(err => {
                console.log(err);
            }));
            yield database_1.default
                .then((r) => r
                .query('DELETE FROM components WHERE idcomponent = ?', p_idcomponent)
                .catch(err => {
                console.log(err);
            }));
        });
    }
    deleteProjectsNotFullyLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('DELETE FROM projects WHERE idproject NOT IN (SELECT idproject FROM project_measures GROUP BY idproject);')
                .catch(err => {
                console.log(err);
            }));
        });
    }
    /*
     --->>>UPDATES
    */
    //LASTUPDATE TABLE
    updateDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            yield database_1.default
                .then((r) => r
                .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date)
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //LASTANALYSIS OF A PROJECT
    updateProjLastAnalysis(p_projectKey, p_dateLastAnalysis) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [p_dateLastAnalysis, p_projectKey])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //PROJECT MEASURE
    updateProjMeasure(p_idmeasure, p_measureValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //COMPONENT MEASURE
    updateCompMeasure(p_idmeasure, p_measureValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    /*
     --->>>TRANSACTIONAL OPERATIONS
    */
    //BEGIN AND END SEGMENTS OF A TRANSACTION (START TRANSACTION, COMMIT, ROLLBACK)
    transactionalOperation(p_operation) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query(p_operation + ';')
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //TURNS ON AND OFF THE AUTOCOMMIT PROPERTY OF THE DATABASE (1 : ON, 0 : OFF)
    transactionalAutoCommit(p_state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield (yield database_1.default).getConnection())
                .query("SET AUTOCOMMIT=" + p_state + ';');
        });
    }
}
exports.database = new DBOperations();
