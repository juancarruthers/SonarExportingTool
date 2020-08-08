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
const util_1 = require("util");
const mysql_1 = __importDefault(require("mysql"));
const keys_1 = __importDefault(require("../keys"));
class DBOperations {
    constructor() {
        this.connection = this.getConnection();
    }
    //USE OF A CONNECTION INSTEAD OF A POOL BECAUSE IS NOT POSSIBLE TO MAKE BLOCK TANSACTIONS WITH MULTIPLE CONNECTIONS
    getConnection() {
        const connection = mysql_1.default.createConnection(keys_1.default.database);
        connection.connect();
        console.log('Connection Established');
        connection.query = util_1.promisify(connection.query);
        return connection;
    }
    //DESTROYS THE CONNECTION
    closeConnection() {
        this.connection.destroy();
    }
    /*
     --->>>QUERIES FOR ROWS
    */
    //PROJECTS
    getProjectKeys(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projectsKeys;
                if (p_projectsKeyList.length > 0) {
                    projectsKeys = yield this.connection
                        .query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList]);
                }
                else {
                    projectsKeys = [];
                }
                //Return tuple with values idproject and key
                return projectsKeys;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getProjectLastAnalysis(p_projKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastAnalysis = yield this.connection
                    .query('SELECT `lastAnalysis` FROM projects WHERE `key` = ?', p_projKey);
                return lastAnalysis[0]['lastAnalysis'];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //COMPONENTS
    getComponentPathsOfProyects(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const componentsPath = yield this.connection
                    .query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?', p_project);
                return componentsPath;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //MEASURES
    getProjectIdMeasure(p_idproject, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryIdmeasure = yield this.connection
                    .query('SELECT pm.idmeasure AS id FROM project_measures AS pm WHERE pm.idproject = ? AND pm.idmetric = ?', [p_idproject, p_idmetric]);
                let value;
                if (queryIdmeasure.length == 0) {
                    value = 0;
                }
                else {
                    value = queryIdmeasure[0]['id'];
                }
                return value;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getComponentIdMeasure(p_idcomponent, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryIdmeasure = yield this.connection
                    .query('SELECT cm.idmeasure AS id FROM component_measures AS cm WHERE cm.idcomponent = ? AND cm.idmetric = ?', [p_idcomponent, p_idmetric]);
                let value;
                if (queryIdmeasure.length == 0) {
                    value = 0;
                }
                else {
                    value = queryIdmeasure[0]['id'];
                }
                return value;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //METRICS
    getMetricId(p_metricKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idMetric = yield this.connection
                    .query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', p_metricKey);
                return idMetric[0]['idmetric'];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //LASTUPDATE TABLE
    getDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryDateLastAnalysis = yield this.connection
                    .query('SELECT date FROM lastUpdate');
                return queryDateLastAnalysis[0]['date'];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
     --->>>QUERIES FOR BOOLEANS (CHECKS EXISTANCE)
    */
    //PROJECTS
    checkProjectExists(p_projectKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const querykeyProj = yield this.connection
                    .query('SELECT p.key FROM projects AS p WHERE p.key = ?', p_projectKey);
                let value = true;
                if (querykeyProj.length == 0) {
                    value = false;
                }
                return value;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //COMPONENTS
    checkComponentExists(p_idproject, p_componentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryNameComp = yield this.connection
                    .query('SELECT c.name FROM components AS c WHERE c.idproject = ? AND c.path = ?', [p_idproject, p_componentPath]);
                let value = true;
                if (queryNameComp.length == 0) {
                    value = false;
                }
                return value;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
     --->>>INSERTIONS
    */
    //METRICS
    //To adapt the data from the API to the Database send the values of p_metrics as an array of arrays, e.g. [[idmetric, key, type, name, description, domain]]
    insertMetrics(p_metrics) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('INSERT INTO `projects` (`idmetric`, `key`, `type`, `name`, `description`, `domain`) VALUES  ?', [p_metrics]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //PROJECTS
    insertProjects(p_projects) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('INSERT INTO `projects` (`key`,`name`,`qualifier`,`lastAnalysis`) VALUES  ?', [p_projects]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //COMPONENTS
    insertComponents(p_components) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('INSERT INTO `components` (`idproject`,`name`,`qualifier`,`path`,`language`) VALUES ?', [p_components]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //PROJECTS' MEASURES
    insertProjectMeasures(p_measures) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('INSERT INTO `project_measures` (`idproject`, `idmetric`, `value`) VALUES ?', [p_measures]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //COMPONENTS' MEASURES
    insertComponentMeasures(p_measures) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('INSERT INTO `component_measures` (`idcomponent`, `idmetric`,`value`) VALUES ?', [p_measures]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
     --->>>DELETES
    */
    deleteComponentAndMeasures(p_idcomponent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('DELETE FROM component_measures WHERE idcomponent = ?', p_idcomponent);
                yield this.connection
                    .query('DELETE FROM components WHERE idcomponent = ?', p_idcomponent);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteProjectsNotFullyLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('DELETE FROM projects WHERE idproject NOT IN (SELECT idproject FROM project_measures GROUP BY idproject);');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
     --->>>UPDATES
    */
    //LASTUPDATE TABLE
    updateDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = new Date();
                yield this.connection
                    .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //LASTANALYSIS OF A PROJECT
    updateProjLastAnalysis(p_projectKey, p_dateLastAnalysis) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [p_dateLastAnalysis, p_projectKey]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //PROJECT MEASURE
    updateProjMeasure(p_idmeasure, p_measureValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //COMPONENT MEASURE
    updateCompMeasure(p_idmeasure, p_measureValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection
                    .query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [p_measureValue, p_idmeasure]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
     --->>>TRANSACTIONAL OPERATIONS
    */
    //BEGIN AND END SEGMENTS OF A TRANSACTION (START TRANSACTION, COMMIT, ROLLBACK)
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query('START TRANSACTION;');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query('COMMIT;');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query('ROLLBACK;');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.DBOperations = DBOperations;
