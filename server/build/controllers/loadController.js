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
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const fs_1 = require("fs");
const path_1 = require("path");
const metric_1 = require("../models/metric");
const project_1 = require("../models/project");
class LoadController {
    //Carga de las metricas obtenidas de la API de SONAR
    metrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = "https://sonarcloud.io/api/metrics/search?p=1&ps=105";
            let api_query = yield cross_fetch_1.default(url).then(response => {
                return response.json();
            });
            let resp = api_query["metrics"];
            for (let met of resp) {
                let respMetric = new metric_1.Metric(met["id"], met["key"], met["type"], met["name"], met["description"], met["domain"]);
                database_1.default.then((r) => r.query('INSERT INTO metrics set ?', [respMetric])
                    .catch(err => {
                    console.log(err);
                }));
            }
            res.json(api_query["metrics"]);
        });
    }
    projects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var key;
                var path = path_1.resolve(__dirname, './key.sonar');
                key = fs_1.readFileSync(path, 'utf8');
                let url = 'https://sonarcloud.io/api/projects/search?organization=unne-sonar-corpus&ps=500';
                let head = {
                    'content-type': 'application/json',
                    'authorization': 'Basic ' + key
                };
                let api_query = yield cross_fetch_1.default(url, {
                    method: 'GET',
                    headers: head
                })
                    .then(response => {
                    return response.json();
                });
                let resp = api_query["components"];
                for (let proj of resp) {
                    let timestamp = proj["lastAnalysisDate"].split('T');
                    ;
                    let date = timestamp[0].split('-');
                    let time = timestamp[1].split('+');
                    let hours = time[0].split(':');
                    let ms = time[1];
                    let timestampAnalysis = new Date(date[0], date[1] - 1, date[2], hours[0], hours[1], hours[2], ms);
                    let respProj = new project_1.Project(proj["key"], proj["name"], proj["qualifier"], timestampAnalysis);
                    database_1.default.then((r) => r.query('INSERT INTO projects set ?', [respProj])
                        .catch(err => {
                        console.log(err);
                    }));
                }
                res.json(api_query);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.loadController = new LoadController();
