"use strict";
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
class Server {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
        this.config();
        this.routes();
        this.startRefreshModuleJob();
        this.errorHandlingConfig();
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
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
    startRefreshModuleJob() {
        this.cronJob = new cron_1.CronJob('00 00 02 * * *', () => refreshAPIModule_1.refreshModule.main());
        this.cronJob.start();
    }
    errorHandlingConfig() {
        this.app
            .use((err, req, res, next) => {
            res.status(400).send('Need Authentication token to make that request');
            next();
        }, (err, req, res, next) => {
            console.log(err.stack);
            res.status(500).send('Server does not know how to handle the situation');
            next();
        });
    }
}
exports.server = new Server();
exports.server.start();
