import { workerService } from '../services/workerService';
import { checkNoShows } from './noShowWorker';
import { checkOverstays } from './overstayWorker';
import logger from '../utils/logger';

export const initWorkers = async () => {
    logger.info('Initializing Background Workers...');

    // Run every minute
    await workerService.registerWorker('no-show-worker', checkNoShows, 60 * 1000);
    await workerService.registerWorker('overstay-worker', checkOverstays, 60 * 1000);
};
