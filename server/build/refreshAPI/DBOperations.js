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
    //GETS
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
    getProjectKeys(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectsKeys = yield database_1.default
                .then((r) => r
                .query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList])
                .catch(err => {
                console.log(err);
            }));
            //Return tuple with values idproject and key
            return projectsKeys;
        });
    }
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
    //INSERT
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
    //DELETE
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
    //UPDATE
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
    //CHECK EXISTANCE
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
    transactionalAutoCommit(p_state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield (yield database_1.default).getConnection())
                .query("SET AUTOCOMMIT=" + p_state + ';');
        });
    }
}
exports.database = new DBOperations();
