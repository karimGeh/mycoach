import { SessionDoc } from './Session.model';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

interface UserAttrs {
	username: string;
	email: string;
}

interface UserDoc extends mongoose.Document {
	username: string;
	email: string;
	sessionsInQueue: SessionDoc[];
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			username: true,
		},
		email: {
			type: String,
			required: true,
		},
		sessionsInQueue: [{ type: ObjectId, ref: 'Session' }],
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	},
);

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User, UserAttrs, UserDoc };
