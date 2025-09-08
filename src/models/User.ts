import mongoose from "../services/db";

const UserSchema = new (mongoose as any).Schema(
	{
		username: { type: String, required: true, unique: true, index: true },
		fan: { type: String, required: true, unique: true, index: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

const User = (mongoose as any).models.User || (mongoose as any).model("User", UserSchema);

export default User;


