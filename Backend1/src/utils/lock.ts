import redisClient from '../config/redis';
import logger from '../utils/logger';

const useRedis = process.env.USE_REDIS === 'true';
const memoryLocks: Set<string> = new Set();

export const acquireLock = async (key: string, ttl: number): Promise<boolean> => {
    if (useRedis && redisClient) {
        const result = await redisClient.set(key, 'locked', {
            NX: true,
            PX: ttl
        });
        return result === 'OK';
    } else {
        if (memoryLocks.has(key)) {
            return false;
        }
        memoryLocks.add(key);
        // Auto-release after TTL
        setTimeout(() => {
            memoryLocks.delete(key);
        }, ttl);
        return true;
    }
};

export const releaseLock = async (key: string): Promise<void> => {
    if (useRedis && redisClient) {
        await redisClient.del(key);
    } else {
        memoryLocks.delete(key);
    }
};
