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
const refreshAPIModule_1 = require("../refreshAPI/refreshAPIModule");
class RefreshAPIController {
    refreshProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshModule = new refreshAPIModule_1.RefreshAPIModule(req.body[0], req.body[1]);
            yield refreshModule.main();
            res.set('Content-Type', 'application/json');
            res.json('Finish Update');
        });
    }
    getProjectsToUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshModule = new refreshAPIModule_1.RefreshAPIModule(0, 0);
            yield refreshModule.searchLastAnalysis();
            res.set('Content-Type', 'application/json');
            res.json([refreshModule.getNewProjects(), refreshModule.getRefreshProjects()]);
        });
    }
}
exports.refreshAPIController = new RefreshAPIController();
