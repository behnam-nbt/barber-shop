import { model, models, Schema } from "mongoose";

const profileSchema = new Schema({
    name: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
})

const Profile = models.Profile || model("Profile", profileSchema);

export default Profile;