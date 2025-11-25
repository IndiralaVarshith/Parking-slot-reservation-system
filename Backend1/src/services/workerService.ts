import { Queue, Worker } from 'bullmq';
import redisClient from '../config/redis';
import logger from '../utils/logger';

type JobHandler = () => Promise<void>;

class WorkerService {
    private useRedis: boolean;
    private queues: Record<string, Queue> = {};
    private workers: Record<string, Worker> = {};
    private intervals: Record<string, NodeJS.Timeout> = {};

    constructor() {
        this.useRedis = process.env.USE_REDIS === 'true' && !!redisClient;
    }

    async registerWorker(name: string, handler: JobHandler, intervalMs: number) {
        if (this.useRedis) {
            logger.info(`Registering Redis worker: ${name}`);

            // Create Queue
            this.queues[name] = new Queue(name, {
                connection: redisClient as any // Redis client is compatible
            });

            // Create Worker
            this.workers[name] = new Worker(name, async () => {
                await handler();
            }, {
                connection: redisClient as any
            });

            // Schedule repeatable job
            await this.queues[name].add(name, {}, {
                repeat: {
                    every: intervalMs
                }
            });

        } else {
            logger.info(`Registering In-Memory worker: ${name}`);
            // Use setInterval for local development
            this.intervals[name] = setInterval(async () => {
                try {
                    await handler();
                } catch (error) {
                    logger.error(`Error in worker ${name}:`, error);
                }
            }, intervalMs);
        }
    }

    async shutdown() {
        if (this.useRedis) {
            for (const worker of Object.values(this.workers)) {
                await worker.close();
            }
            for (const queue of Object.values(this.queues)) {
                await queue.close();
            }
        } else {
            for (const interval of Object.values(this.intervals)) {
                clearInterval(interval);
            }
        }
    }
}

export const workerService = new WorkerService();
