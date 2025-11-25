"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseLock = exports.acquireLock = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const logger_1 = __importDefault(require("./logger"));
const acquireLock = async (key, ttlSeconds) => {
    try {
        const result = await redis_1.default.set(key, 'LOCKED', {
            NX: true, // Only set if not exists
            EX: ttlSeconds, // Expire after ttlSeconds
        });
        return result === 'OK';
    }
    catch (error) {
        logger_1.default.error(`Error acquiring lock for ${key}:`, error);
        return false;
    }
};
exports.acquireLock = acquireLock;
const releaseLock = async (key) => {
    try {
        await redis_1.default.del(key);
    }
    catch (error) {
        logger_1.default.error(`Error releasing lock for ${key}:`, error);
    }
};
exports.releaseLock = releaseLock;
