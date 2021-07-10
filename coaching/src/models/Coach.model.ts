import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

enum Sports {
	yoga = 'yoga',
	pert_de_poids = 'perte de poids',
	dance_orientale = 'dance orientale',
	masse_musculair = 'masse musculaire',
}

interface CoachAttrs {
	username: string;
	email: string;
	calendar: string;
	sports: Sports;
}

interface CoachDoc extends mongoose.Document {
	username: string;
	email: string;
	calendar: string;
	sports: string;
}

interface CoachModel extends mongoose.Model<CoachDoc> {
	build(attr: CoachAttrs): CoachDoc;
}

const coachSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		calendar: { type: String, required: true },
		sports: [
			{
				type: String,
				required: true,
				enum: Object.values(Sports),
			},
		],
		balance: { type: Number, default: 0 },
		sessionsInQueue: [{ type: ObjectId, ref: 'Session' }],
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.createdAt;
				delete ret.updatedAt;
				delete ret.calendar;
			},
		},
	},
);

coachSchema.statics.build = (attrs: CoachAttrs) => {
	return new Coach(attrs);
};

const Coach = mongoose.model<CoachDoc, CoachModel>('Coach', coachSchema);

export { Coach, Sports };
