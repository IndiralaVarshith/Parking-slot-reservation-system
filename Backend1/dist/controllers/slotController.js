"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSlot = exports.updateSlot = exports.createSlot = exports.getSlotById = exports.getSlots = void 0;
const ParkingSlot_1 = __importDefault(require("../models/ParkingSlot"));
const logger_1 = __importDefault(require("../utils/logger"));
const getSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot_1.default.find();
        res.json(slots);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSlots = getSlots;
const getSlotById = async (req, res) => {
    try {
        const slot = await ParkingSlot_1.default.findById(req.params.id);
        if (slot) {
            res.json(slot);
        }
        else {
            res.status(404).json({ message: 'Slot not found' });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSlotById = getSlotById;
const createSlot = async (req, res) => {
    try {
        const { slotId, label, coordinates, size, hourlyRate, status } = req.body;
        const slotExists = await ParkingSlot_1.default.findOne({ slotId });
        if (slotExists) {
            return res.status(400).json({ message: 'Slot already exists' });
        }
        const slot = await ParkingSlot_1.default.create({
            slotId,
            label,
            coordinates,
            size,
            hourlyRate,
            status,
        });
        res.status(201).json(slot);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createSlot = createSlot;
const updateSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot_1.default.findById(req.params.id);
        if (slot) {
            slot.label = req.body.label || slot.label;
            slot.coordinates = req.body.coordinates || slot.coordinates;
            slot.size = req.body.size || slot.size;
            slot.hourlyRate = req.body.hourlyRate || slot.hourlyRate;
            slot.status = req.body.status || slot.status;
            const updatedSlot = await slot.save();
            res.json(updatedSlot);
        }
        else {
            res.status(404).json({ message: 'Slot not found' });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateSlot = updateSlot;
const deleteSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot_1.default.findById(req.params.id);
        if (slot) {
            await slot.deleteOne();
            res.json({ message: 'Slot removed' });
        }
        else {
            res.status(404).json({ message: 'Slot not found' });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteSlot = deleteSlot;
