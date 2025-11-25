"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWorkers = void 0;
const noShowWorker_1 = require("./noShowWorker");
const overstayWorker_1 = require("./overstayWorker");
const initWorkers = () => {
    (0, noShowWorker_1.startNoShowWorker)();
    (0, overstayWorker_1.startOverstayWorker)();
};
exports.initWorkers = initWorkers;
