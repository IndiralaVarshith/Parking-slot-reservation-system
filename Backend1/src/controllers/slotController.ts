import { Request, Response } from 'express';
import ParkingSlot from '../models/ParkingSlot';
import logger from '../utils/logger';

export const getSlots = async (req: Request, res: Response) => {
    try {
        const slots = await ParkingSlot.find();
        res.json(slots);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSlotById = async (req: Request, res: Response) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (slot) {
            res.json(slot);
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createSlot = async (req: Request, res: Response) => {
    try {
        const { slotId, label, coordinates, size, hourlyRate, status } = req.body;

        const slotExists = await ParkingSlot.findOne({ slotId });
        if (slotExists) {
            return res.status(400).json({ message: 'Slot already exists' });
        }

        const slot = await ParkingSlot.create({
            slotId,
            label,
            coordinates,
            size,
            hourlyRate,
            status,
        });

        res.status(201).json(slot);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateSlot = async (req: Request, res: Response) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);

        if (slot) {
            slot.label = req.body.label || slot.label;
            slot.coordinates = req.body.coordinates || slot.coordinates;
            slot.size = req.body.size || slot.size;
            slot.hourlyRate = req.body.hourlyRate || slot.hourlyRate;
            slot.status = req.body.status || slot.status;

            const updatedSlot = await slot.save();
            res.json(updatedSlot);
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteSlot = async (req: Request, res: Response) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);

        if (slot) {
            await slot.deleteOne();
            res.json({ message: 'Slot removed' });
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
