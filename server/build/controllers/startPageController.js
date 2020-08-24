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
class StartPageController {
    numberOfProjects(req, res) {
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
exports.startPageController = new StartPageController();
