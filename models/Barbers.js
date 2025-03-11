import mongoose, { model, models, Schema } from "mongoose";

const barberSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
})

const Barber = models.Barber || model("Barber", barberSchema);

export default Barber;