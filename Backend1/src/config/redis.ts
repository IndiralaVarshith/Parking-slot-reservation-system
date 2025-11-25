import { createClient } from 'redis';
import logger from '../utils/logger';

const useRedis = process.env.USE_REDIS === 'true';

let redisClient: ReturnType<typeof createClient> | null = null;

if (useRedis) {
    redisClient = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    (async () => {
        await redisClient.connect();
    })();
} else {
    logger.info('Redis is disabled. Using in-memory fallback where possible.');
}

export default redisClient;
