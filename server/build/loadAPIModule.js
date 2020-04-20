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
const database_1 = __importDefault(require("./database"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const path_1 = require("path");
const metric_1 = require("./models/metric");
const project_1 = require("./models/project");
const project_measure_1 = require("./models/project_measure");
const component_measure_1 = require("./models/component_measure");
const component_1 = require("./models/component");
class LoadAPIModule {
    //Carga de las metricas obtenidas de la API de SONAR
    metrics() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = "https://sonarcloud.io/api/metrics/search?p=1&ps=105";
            let api_query = yield node_fetch_1.default(url)
                .then(response => {
                return response.json();
            })
                .catch(err => {
                console.log(err);
            });
            let response = api_query["metrics"];
            for (let met of response) {
                let respMetric = new metric_1.Metric(met["id"], met["key"], met["type"], met["name"], met["description"], met["domain"]);
                database_1.default
                    .then((r) => r.query('INSERT INTO metrics set ?', [respMetric])
                    .catch(err => {
                    console.log(err);
                }));
            }
            console.log('Metrics is Loaded!');
        });
    }
    //Carga de las proyectos analizados de la API de SONAR
    projects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var key;
                var path = path_1.resolve(__dirname, '../key.sonar');
                key = fs_1.readFileSync(path, 'utf8');
                //Headers con el token de autorizacion
                let url = 'https://sonarcloud.io/api/projects/search?organization=unne-sonar-corpus&ps=500';
                let head = {
                    'content-type': 'application/json',
                    'authorization': 'Basic ' + key
                };
                let api_query = yield node_fetch_1.default(url, {
                    method: 'GET',
                    headers: head
                })
                    .then(response => {
                    return response.json();
                })
                    .catch(err => {
                    console.log(err);
                });
                let response = api_query["components"];
                for (let proj of response) {
                    let timestamp = proj["lastAnalysisDate"].split('T');
                    let date = timestamp[0].split('-');
                    let time = timestamp[1].split('+');
                    let hours = time[0].split(':');
                    let ms = time[1];
                    let timestampAnalysis = new Date(date[0], date[1] - 1, date[2], hours[0], hours[1], hours[2], ms);
                    let respProj = new project_1.Project(proj["key"], proj["name"], proj["qualifier"], timestampAnalysis);
                    database_1.default
                        .then((r) => r.query('INSERT INTO projects set ?', [respProj])
                        .catch(err => {
                        console.log(err);
                    }));
                }
            }
            catch (error) {
                console.log(error);
            }
            console.log('Projects is Loaded!');
        });
    }
    //Carga de los componentes de los proyectos analizados de la API de SONAR. Eliminados dos componentes del proyecto Jedit
    components() {
        return __awaiter(this, void 0, void 0, function* () {
            let projectsKeys = yield database_1.default
                .then((r) => r.query('SELECT p.idproject, p.key FROM projects AS p')
                .catch(err => {
                console.log(err);
            }));
            for (let proj of projectsKeys) {
                let url = "https://sonarcloud.io/api/components/tree?component=" + proj['key'] + "&p=1&ps=500";
                let api_query = yield node_fetch_1.default(url)
                    .then(response => {
                    return response.json();
                })
                    .catch(err => {
                    console.log(err);
                });
                let response_page = api_query["paging"];
                let totalPages = response_page["total"] / 500;
                let cont = 0;
                let response_components;
                while (cont < totalPages) {
                    url = "https://sonarcloud.io/api/components/tree?component=" + proj['key'] + "&p=" + (cont + 1) + "&ps=500";
                    api_query = yield node_fetch_1.default(url)
                        .then(response => {
                        return response.json();
                    })
                        .catch(err => {
                        console.log(err);
                    });
                    response_components = api_query["components"];
                    for (let comp of response_components) {
                        let respComp = new component_1.Component(proj["idproject"], comp["name"], comp["qualifier"], comp["path"], comp["language"]);
                        database_1.default
                            .then((r) => r.query('INSERT INTO components set ?', [respComp])
                            .catch(err => {
                            console.log(err);
                        }));
                    }
                    cont = cont + 1;
                }
            }
            console.log('Components is Loaded!');
        });
    }
    //Carga de las medidas de los proyectos obtenidas de la API de SONAR
    projectMeasures() {
        return __awaiter(this, void 0, void 0, function* () {
            let projectsKeys = yield database_1.default
                .then((r) => r.query('SELECT p.idproject, p.key FROM projects AS p')
                .catch(err => {
                console.log(err);
            }));
            for (let proj of projectsKeys) {
                //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
                let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + "&metricKeys=new_technical_debt, blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, new_branch_coverage, conditions_to_cover, new_conditions_to_cover, confirmed_issues, coverage, new_coverage, critical_violations, complexity, last_commit_date, development_cost, new_development_cost, directories, duplicated_blocks, new_duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, new_duplicated_lines, new_duplicated_lines_density, duplications_data, effort_to_reach_maintainability_rating_a, executable_lines_data, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, new_line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, new_lines_to_cover, sqale_rating, new_maintainability_rating, major_violations, minor_violations, ncloc_data, new_blocker_violations, new_bugs, new_code_smells, new_critical_violations, new_info_violations, new_violations, new_lines, new_major_violations, new_minor_violations, new_security_hotspots, new_vulnerabilities, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, new_reliability_rating, reliability_remediation_effort, new_reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, new_security_rating, security_remediation_effort, new_security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, new_sqale_debt_ratio, uncovered_conditions, new_uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
                let api_query_measures = yield node_fetch_1.default(url)
                    .then(response => {
                    return response.json();
                })
                    .catch(err => {
                    console.log(err);
                });
                let response = api_query_measures["component"]["measures"];
                for (let mea of response) {
                    let idMetric = yield database_1.default
                        .then((r) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', mea["metric"])
                        .catch(err => {
                        console.log(err);
                    }));
                    let respMeas = new project_measure_1.Project_measure(proj["idproject"], idMetric['0']['idmetric'], mea["value"]);
                    yield database_1.default
                        .then((r) => r.query('INSERT INTO project_measures set ?', [respMeas])
                        .catch(err => {
                        console.log(err);
                    }));
                }
            }
            console.log('Project Measures is Loaded!');
        });
    }
    //Carga de las medidas de los componentes del proyecto obtenidas de la API de SONAR
    componentMeasures() {
        return __awaiter(this, void 0, void 0, function* () {
            let projectsKeys = yield database_1.default
                .then((r) => r.query('SELECT p.idproject, p.key FROM projects AS p')
                .catch(err => {
                console.log(err);
            }));
            for (let proj of projectsKeys) {
                let componentsPaths = yield database_1.default
                    .then((r) => r.query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?', proj['idproject'])
                    .catch(err => {
                    console.log(err);
                }));
                for (let comp of componentsPaths) {
                    //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
                    let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + ':' + comp['path'] + "&metricKeys=blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, conditions_to_cover, confirmed_issues, coverage, critical_violations, complexity, last_commit_date, development_cost, directories, duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, effort_to_reach_maintainability_rating_a, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, sqale_rating, major_violations, minor_violations, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
                    let api_query = yield node_fetch_1.default(url)
                        .then(response => {
                        return response.json();
                    })
                        .catch(err => {
                        console.log(err);
                    });
                    let idComponent = yield database_1.default
                        .then((r) => r.query('SELECT c.idcomponent FROM components AS c WHERE c.path = ? AND c.idproject = ?', [comp["path"], proj['idproject']])
                        .catch(err => {
                        console.log(err);
                    }));
                    let response = api_query["component"]["measures"];
                    for (let mea of response) {
                        let idMetric = yield database_1.default
                            .then((r) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', mea["metric"])
                            .catch(err => {
                            console.log(err);
                        }));
                        let respMeas = new component_measure_1.Component_measure(idComponent['0']['idcomponent'], idMetric['0']['idmetric'], mea["value"]);
                        yield database_1.default
                            .then((r) => r.query('INSERT INTO component_measures set ?', [respMeas])
                            .catch(err => {
                            console.log(err);
                        }));
                    }
                }
            }
            console.log('Components Measures is Loaded!');
        });
    }
}
exports.loadModule = new LoadAPIModule();
exports.loadModule.metrics();
exports.loadModule.projects();
exports.loadModule.components();
exports.loadModule.projectMeasures();
exports.loadModule.componentMeasures();
