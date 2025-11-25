import { createReservation } from '../controllers/reservationController';
import { Request, Response } from 'express';
import ParkingSlot from '../models/ParkingSlot';
import Reservation from '../models/Reservation';
import * as lockUtils from '../utils/lock';

// Mock dependencies
jest.mock('../models/ParkingSlot');
jest.mock('../models/Reservation');
jest.mock('../utils/lock');
jest.mock('../utils/logger');

describe('Reservation Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });
        req = {
            body: {
                slotId: 'slot123',
                startDateTime: new Date().toISOString(),
                endDateTime: new Date(Date.now() + 3600000).toISOString(),
                vehicleNumber: 'AB-123',
            },
            user: { id: 'user123', role: 'user' },
        } as any;
        res = { status, json };
    });

    it('should return 404 if slot not found', async () => {
        (lockUtils.acquireLock as jest.Mock).mockResolvedValue(true);
        (ParkingSlot.findById as jest.Mock).mockResolvedValue(null);

        await createReservation(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: 'Slot not found' });
    });

    it('should return 409 if lock cannot be acquired', async () => {
        (lockUtils.acquireLock as jest.Mock).mockResolvedValue(false);

        await createReservation(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(409);
    });
});
