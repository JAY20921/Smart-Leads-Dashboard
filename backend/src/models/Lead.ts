import mongoose, { Schema, Document, Model } from 'mongoose';
import { LeadStatus, LeadSource } from '../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../constants';

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  phone?: string;
  company?: string;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
      required: [true, 'Status is required'],
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: [true, 'Source is required'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient filtering and searching
LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ status: 1, source: 1, createdAt: -1 });

const Lead: Model<ILead> = mongoose.model<ILead>('Lead', LeadSchema);
export default Lead;
