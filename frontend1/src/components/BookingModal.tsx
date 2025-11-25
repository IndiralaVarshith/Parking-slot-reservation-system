import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ParkingSlot } from '../hooks/useSlots';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Stripe (Replace with your actual publishable key)
const stripePromise = loadStripe('pk_test_placeholder');

interface BookingModalProps {
    slot: ParkingSlot;
    onClose: () => void;
    onSuccess: () => void;
}

const CheckoutForm = ({ slot, startDate, endDate, onSuccess }: { slot: ParkingSlot, startDate: Date, endDate: Date, onSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            // 1. Create Reservation & PaymentIntent on Backend
            const { data } = await api.post('/reservations', {
                slotId: slot._id,
                startDateTime: startDate,
                endDateTime: endDate,
                vehicleNumber: 'ABC-123', // TODO: Add input for this
            });

            const clientSecret = data.clientSecret;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });

            if (result.error) {
                setError(result.error.message || 'Payment failed');
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    onSuccess();
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-md">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
                {processing ? 'Processing...' : 'Pay & Book'}
            </button>
        </form>
    );
};

const BookingModal = ({ slot, onClose, onSuccess }: BookingModalProps) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // +1 hour

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Book {slot.label}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => date && setStartDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => date && setEndDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full border rounded-md px-3 py-2"
                                minDate={startDate}
                            />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600">Rate: ₹{slot.hourlyRate}/hr</p>
                            {/* Calculate total here if needed */}
                        </div>
                    </div>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm slot={slot} startDate={startDate} endDate={endDate} onSuccess={onSuccess} />
                    </Elements>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BookingModal;
