import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a company name'],
      unique: true,
    },
    industry: {
      type: String,
      required: [true, 'Please provide an industry'],
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
