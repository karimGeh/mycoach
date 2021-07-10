import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

interface SessionAttrs {
	user: string;
	coach: string;
	link: string;
	transaction: string;
	time: Date;
}

interface SessionDoc extends mongoose.Document {
	user: string;
	coach: string;
	link: string;
	transaction: string;
	time: Date;
}

interface SessionModel extends mongoose.Model<SessionDoc> {
	build(attrs: SessionAttrs): SessionDoc;
}

const sessionSchema = new mongoose.Schema(
	{
		user: {
			type: ObjectId,
			ref: 'User',
			required: true,
		},
		coach: {
			type: ObjectId,
			ref: 'Coach',
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		transaction: {
			type: ObjectId,
			ref: 'Transaction',
			required: true,
		},
		time: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true },
);

sessionSchema.statics.build = (attrs: SessionAttrs) => {
	return new Session(attrs);
};

const Session = mongoose.model<SessionDoc, SessionModel>(
	'Session',
	sessionSchema,
);
export { Session };
