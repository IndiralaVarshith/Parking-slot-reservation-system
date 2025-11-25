"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect); // All routes require auth
router.post('/', reservationController_1.createReservation);
router.get('/my', reservationController_1.getMyReservations);
router.post('/:id/cancel', reservationController_1.cancelReservation);
router.post('/:id/checkin', reservationController_1.checkIn);
exports.default = router;
