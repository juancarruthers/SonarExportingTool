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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cron_1 = require("cron");
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const refreshAPIModule_1 = require("./refreshAPI/refreshAPIModule");
const DBOperations_1 = require("./refreshAPI/DBOperations");
class APIServer {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
        this.config();
        this.routes();
        this.startRefreshModuleJob();
        this.errorHandlingConfig();
    }
    getPort() {
        return this.port;
    }
    start() {
        this.server = this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
    changeListeningPort(p_port) {
        if (this.server) {
            this.server.close();
        }
        this.app.set('port', process.env.PORT || p_port);
        this.start();
    }
    config() {
        this.app.set('port', process.env.PORT || this.port);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(publicRoutes_1.default);
        this.app.use(adminRoutes_1.default);
    }
    startRefreshModuleJob() {
        this.cronJob = new cron_1.CronJob('00 00 02 * * *', () => __awaiter(this, void 0, void 0, function* () {
            const refreshModule = new refreshAPIModule_1.RefreshAPIModule(0, 14400);
            yield refreshModule.main();
        }));
        this.cronJob.start();
    }
    errorHandlingConfig() {
        this.app
            .use((err, req, res, next) => {
            res.status(200).end();
            next();
        }, (err, req, res, next) => {
            res.status(400).send('Need Authentication token to make that request');
            next();
        }, (err, req, res, next) => {
            console.log(err.stack);
            res.status(500).send('Server does not know how to handle the situation');
            next();
        });
    }
    checkDatabaseConsistency() {
        return __awaiter(this, void 0, void 0, function* () {
            let database = new DBOperations_1.DBOperations();
            yield database.deleteProjectsNotFullyLoad();
        });
    }
}
exports.APIserver = new APIServer();
exports.APIserver.checkDatabaseConsistency();
exports.APIserver.start();
