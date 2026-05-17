import { FilterQuery, SortOrder } from 'mongoose';
import Lead, { ILead } from '../models/Lead';
import { LeadQuery, CreateLeadInput, UpdateLeadInput, PaginationMeta } from '../types';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../constants';
import { AppError } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';

export interface LeadPage {
  leads: ILead[];
  meta: PaginationMeta;
}

export class LeadRepository {
  private buildFilter(query: LeadQuery): FilterQuery<ILead> {
    const filter: FilterQuery<ILead> = {};

    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;

    if (query.search) {
      const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    return filter;
  }

  async findAll(query: LeadQuery): Promise<LeadPage> {
    const page = Math.max(1, query.page ?? DEFAULT_PAGE);
    const limit = Math.min(Math.max(1, query.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
    const skip = (page - 1) * limit;

    const sortOrder: SortOrder = query.sort === 'oldest' ? 1 : -1;
    const filter = this.buildFilter(query);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limit).exec(),
      Lead.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      leads,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string): Promise<ILead> {
    const lead = await Lead.findById(id).exec();
    if (!lead) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
    return lead;
  }

  async create(input: CreateLeadInput): Promise<ILead> {
    return Lead.create(input);
  }

  async update(id: string, input: UpdateLeadInput): Promise<ILead> {
    const lead = await Lead.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).exec();
    if (!lead) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
    return lead;
  }

  async delete(id: string): Promise<void> {
    const result = await Lead.findByIdAndDelete(id).exec();
    if (!result) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
  }

  // Returns all matching leads without pagination (for CSV export)
  async findAllForExport(query: LeadQuery): Promise<ILead[]> {
    const filter = this.buildFilter(query);
    const sortOrder: SortOrder = query.sort === 'oldest' ? 1 : -1;
    return Lead.find(filter).sort({ createdAt: sortOrder }).exec();
  }
}

export const leadRepository = new LeadRepository();
