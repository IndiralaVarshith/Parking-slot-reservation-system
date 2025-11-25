"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slotController_1 = require("../controllers/slotController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(slotController_1.getSlots)
    .post(authMiddleware_1.protect, authMiddleware_1.admin, slotController_1.createSlot);
router.route('/:id')
    .get(slotController_1.getSlotById)
    .put(authMiddleware_1.protect, authMiddleware_1.admin, slotController_1.updateSlot)
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, slotController_1.deleteSlot);
exports.default = router;
