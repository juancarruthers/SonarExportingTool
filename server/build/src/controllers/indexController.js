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
const metric_1 = require("../models/metric");
class IndexController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = "https://sonarcloud.io/api/metrics/search?p=1&ps=1";
            yield cross_fetch_1.default(url).then(response => {
                return response.json();
            })
                .then(data => {
                let resp = data["metrics"]["0"];
                let respMetric = new metric_1.Metric(resp["key"], resp["type"], resp["name"], resp["description"], resp["domain"]);
                database_1.default.then((r) => r.query('INSERT INTO metrics set ?', [respMetric]));
                res.json(data["metrics"]["0"]);
            });
            /*.catch(err => {
              // Do something for an error here
            })*/
        });
    }
}
exports.indexController = new IndexController();
