import mongoose from 'mongoose';
import { Password } from '../helpers/password';

const { ObjectId } = mongoose.Schema.Types;

interface UserAttrs {
	username: string;
	email: string;
	password: string;
}

interface UserDoc extends mongoose.Document {
	username: string;
	email: string;
	password: string;
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
		password: {
			type: String,
			required: true,
		},
		sessionsInQueue: [{ type: ObjectId, ref: 'Session' }],
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
			},
		},
	},
);

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User };
