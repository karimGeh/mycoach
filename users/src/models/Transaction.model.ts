import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

interface TransactionAttrs {
	user: string;
	coach: string;
	amount: number;
}

interface TransactionDoc extends mongoose.Document {
	user: string;
	coach: string;
	amount: number;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
	build(attrs: TransactionAttrs): TransactionDoc;
}

const transactionSchema = new mongoose.Schema(
	{
		user: {
			type: ObjectId,
			ref: 'User',
		},
		coach: {
			type: ObjectId,
			ref: 'Coach',
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
	return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>(
	'Transaction',
	transactionSchema,
);
export { Transaction };
