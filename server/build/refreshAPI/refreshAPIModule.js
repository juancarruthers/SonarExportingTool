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
Object.defineProperty(exports, "__esModule", { value: true });
const APIDataRecolection_1 = require("./APIDataRecolection");
const DBOperations_1 = require("./DBOperations");
const index_1 = require("../index");
//MODULE TO REFRESH THE DATA FROM DATABASE DEPENDING SONAR UPDATES
class RefreshAPIModule {
    constructor(p_listeningPort, p_limitTime) {
        this.database = new DBOperations_1.DBOperations();
        this.refreshProjects = [];
        this.newProjects = [];
        this.insertBlock = 750;
        this.startTime = this.getTimeSeconds();
        this.limitTime = p_limitTime; //Time in Seconds
        this.listeningPort = p_listeningPort;
    }
    getNewProjects() {
        return this.newProjects;
    }
    getRefreshProjects() {
        return this.refreshProjects;
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.APIserver.changeListeningPort(this.listeningPort);
            console.time('DBTime');
            let flagTransaction = true;
            yield this.searchLastAnalysis();
            yield this.updateProjects();
            console.timeLog('DBTime', 'Projects Updated!');
            yield this.insertNewProjects(flagTransaction);
            yield this.refreshOldProjects(flagTransaction);
            if (flagTransaction) {
                yield this.database.updateDateLastAnalysis();
                console.timeLog('DBTime', "Finish Refreshing");
            }
            else {
                console.timeLog('DBTime', "Refreshing Process did not Finish");
            }
            console.timeEnd('DBTime');
            index_1.APIserver.changeListeningPort(index_1.APIserver.getPort());
            this.database.closeConnection();
            return 1;
        });
    }
    /*
    --->>> INSERT NEW PROJECTS
    */
    insertNewProjects(p_flagTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const keysString = this.listKeyProjects(this.newProjects);
            const projectsKeys = yield this.database.getProjectKeys(keysString);
            try {
                for (let i = 0; i < projectsKeys.length; i++) {
                    yield this.database.transactionalOperation('START TRANSACTION');
                    yield this.updateComponents(projectsKeys[i]);
                    console.timeLog('DBTime', projectsKeys[i]['key'] + " Components Inserted!");
                    yield this.updateProjectMeasures(projectsKeys[i]);
                    console.timeLog('DBTime', projectsKeys[i]['key'] + " Measures Inserted!");
                    yield this.insertComponentMeasures(projectsKeys[i]);
                    console.timeLog('DBTime', projectsKeys[i]['key'] + " Components' Measures Inserted!");
                    yield this.database.transactionalOperation('COMMIT');
                    if ((this.getTimeSeconds() - this.startTime) > this.limitTime) {
                        yield this.database.deleteProjectsNotFullyLoad();
                        i = projectsKeys.length;
                        p_flagTransaction = false;
                    }
                }
            }
            catch (error) {
                console.timeLog('DBTime', error);
                yield this.database.transactionalOperation('ROLLBACK');
                yield this.database.deleteProjectsNotFullyLoad();
                p_flagTransaction = false;
            }
            return p_flagTransaction;
        });
    }
    /*
    --->>> UPDATE OLD PROJECTS
    */
    refreshOldProjects(p_flagTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const keysString = this.listKeyProjects(this.refreshProjects);
            const projectsKeys = yield this.database.getProjectKeys(keysString);
            if (p_flagTransaction) {
                try {
                    for (let i = 0; i < projectsKeys.length; i++) {
                        yield this.database.transactionalOperation('START TRANSACTION');
                        yield this.updateComponents(projectsKeys[i]);
                        console.timeLog('DBTime', projectsKeys[i]['key'] + " Components Updated!");
                        yield this.updateProjectMeasures(projectsKeys[i]);
                        console.timeLog('DBTime', projectsKeys[i]['key'] + " Measures Updated!");
                        yield this.updateComponentMeasures(projectsKeys[i]);
                        console.timeLog('DBTime', projectsKeys[i]['key'] + " Components' Measures Updated!");
                        yield this.database.transactionalOperation('COMMIT');
                        if ((this.getTimeSeconds() - this.startTime) > this.limitTime) {
                            i = projectsKeys.length;
                            p_flagTransaction = false;
                        }
                    }
                }
                catch (error) {
                    console.timeLog('DBTime', error);
                    yield this.database.transactionalOperation('ROLLBACK');
                    p_flagTransaction = false;
                }
            }
            return p_flagTransaction;
        });
    }
    /*
    --->>> GET THE ACTUAL TIME IN SECONDS
    */
    getTimeSeconds() {
        const timeNanoSec = process.hrtime.bigint();
        let timeSeconds = Number(timeNanoSec);
        timeSeconds = timeSeconds / 1000000000;
        return timeSeconds;
    }
    /*
    --->>> CONVERTS A RETURN FROM THE API TO A STRING ARRAY FOR QUERY POURPOSES
    */
    listKeyProjects(p_projects) {
        let keyArray = [];
        for (let project of p_projects) {
            keyArray.push(project[0]);
        }
        return keyArray;
    }
    /*
    --->>> SETS THE ATRIBUTES newProjects AND refreshProjects
    */
    searchLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = 'https://sonarcloud.io/api/projects/search?organization=' + APIDataRecolection_1.sonarAPI.organization + '&p=1&ps=1';
                const pages = yield APIDataRecolection_1.sonarAPI.numberPages(url);
                const dateLastAnalysis = yield this.database.getDateLastAnalysis();
                for (let i = 1; i <= pages; i++) {
                    let projects = yield APIDataRecolection_1.sonarAPI.getProjects(i);
                    for (let proj of projects) {
                        const timestamp = proj.lastAnalysisDate.split('T');
                        let date = timestamp[0].split('-');
                        const time = timestamp[1].split('+');
                        let hours = time[0].split(':');
                        hours[0] = hours[0] - 2;
                        if (hours[0] < 0) {
                            hours[0] = hours[0] + 24;
                            date[2] = date[2] - 1;
                        }
                        let timestampAnalysis = new Date();
                        timestampAnalysis.setUTCFullYear(date[0]);
                        timestampAnalysis.setUTCMonth(date[1] - 1);
                        timestampAnalysis.setUTCDate(date[2]);
                        timestampAnalysis.setUTCHours(hours[0]);
                        timestampAnalysis.setUTCMinutes(hours[1]);
                        timestampAnalysis.setUTCSeconds(hours[2]);
                        if (timestampAnalysis > dateLastAnalysis) {
                            let respProj = [proj.key, proj.name, proj.qualifier, timestampAnalysis];
                            if (yield this.database.checkProjectExists(proj.key)) {
                                //Refresh Only if the project was not refreshed before! (Exception Happened)
                                if ((yield this.database.getProjectLastAnalysis(proj.key)) < dateLastAnalysis) {
                                    this.refreshProjects.push(respProj);
                                }
                            }
                            else {
                                this.newProjects.push(respProj);
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    --->>> UPDATE AND INSERT THE PROJECTS OBTAINED FROM THE API
    */
    updateProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.newProjects.length > 0) {
                    yield this.database.insertProjects(this.newProjects);
                }
                for (let proj of this.refreshProjects) {
                    yield this.database.updateProjLastAnalysis(proj[0], proj[3]);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    --->>> UPDATE AND INSERT THE COMPONENTS OBTAINED FROM THE API
    */
    updateComponents(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compToInsert = [];
                let url = 'https://sonarcloud.io/api/components/tree?component=' + p_project['key'] + '&p=1&ps=1';
                let pages = yield APIDataRecolection_1.sonarAPI.numberPages(url);
                let components;
                for (let i = 1; i <= pages; i++) {
                    components = yield APIDataRecolection_1.sonarAPI.getComponents(p_project['key'], i);
                    for (let component of components) {
                        if (!(yield this.database.checkComponentExists(p_project["idproject"], component.path))) {
                            let respComp = [p_project["idproject"], component.name, component.qualifier, component.path, component.language];
                            compToInsert.push(respComp);
                        }
                    }
                    if (compToInsert.length >= this.insertBlock) {
                        yield this.database.insertComponents(compToInsert);
                        compToInsert = [];
                    }
                }
                if (compToInsert.length > 0) {
                    yield this.database.insertComponents(compToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    --->>> UPDATE AND INSERT THE PROYECTS' MEASURES OBTAINED FROM THE API
    */
    updateProjectMeasures(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projMeaToInsert = [];
                let projMeasures = yield APIDataRecolection_1.sonarAPI.getProjectMeasures(p_project['key']);
                let idMeasure;
                for (let measure of projMeasures) {
                    let idMetric = yield this.database.getMetricId(measure.metric);
                    idMeasure = yield this.database.getProjectIdMeasure(p_project["idproject"], idMetric);
                    if (idMeasure == 0) {
                        let respMeas = [p_project["idproject"], idMetric, measure.value];
                        projMeaToInsert.push(respMeas);
                    }
                    else {
                        yield this.database.updateProjMeasure(idMeasure, measure.value);
                    }
                }
                if (projMeaToInsert.length > 0) {
                    yield this.database.insertProjectMeasures(projMeaToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    --->>> INSERT THE NEW COMPONENTS' MEASURES GOT FROM THE API
    */
    insertComponentMeasures(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compMeaToInsert = [];
                let componentsPaths = yield this.database.getComponentPathsOfProyects(p_project['idproject']);
                for (let comp of componentsPaths) {
                    let compMeasures = yield APIDataRecolection_1.sonarAPI.getComponentMeasures(p_project['key'] + ':' + comp['path']);
                    for (let measure of compMeasures) {
                        let idMetric = yield this.database.getMetricId(measure.metric);
                        let respMeas = [comp['idcomponent'], idMetric, measure.value];
                        compMeaToInsert.push(respMeas);
                    }
                    if (compMeaToInsert.length >= this.insertBlock) {
                        yield this.database.insertComponentMeasures(compMeaToInsert);
                        compMeaToInsert = [];
                    }
                }
                if (compMeaToInsert.length > 0) {
                    yield this.database.insertComponentMeasures(compMeaToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    --->>> UPDATE THE COMPONENTS' MEASURES OBTAINED FROM THE API
    */
    updateComponentMeasures(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compMeaToInsert = [];
                let componentsPaths = yield this.database.getComponentPathsOfProyects(p_project['idproject']);
                for (let comp of componentsPaths) {
                    let compMeasures = yield APIDataRecolection_1.sonarAPI.getComponentMeasures(p_project['key'] + ':' + comp['path']);
                    if (compMeasures[0].metric != 'not found') {
                        let idMeasure;
                        for (let measure of compMeasures) {
                            let idMetric = yield this.database.getMetricId(measure.metric);
                            idMeasure = yield this.database.getComponentIdMeasure(comp['idcomponent'], idMetric);
                            if (idMeasure == 0) {
                                let respMeas = [comp['idcomponent'], idMetric, measure.value];
                                compMeaToInsert.push(respMeas);
                            }
                            else {
                                yield this.database.updateCompMeasure(idMeasure, measure.value);
                            }
                        }
                    }
                    else {
                        yield this.database.deleteComponentAndMeasures(comp['idcomponent']);
                    }
                    if (compMeaToInsert.length >= this.insertBlock) {
                        yield this.database.insertComponentMeasures(compMeaToInsert);
                        compMeaToInsert = [];
                    }
                }
                if (compMeaToInsert.length > 0) {
                    yield this.database.insertComponentMeasures(compMeaToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.RefreshAPIModule = RefreshAPIModule;
