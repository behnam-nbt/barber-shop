import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barber",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true, // Example: "10:00 - 10:30"
    },
    isAvailable: {
        type: Boolean,
        default: true, // Initially, the slot is available
    },
});

export default mongoose.models.TimeSlot || mongoose.model("TimeSlot", TimeSlotSchema);
