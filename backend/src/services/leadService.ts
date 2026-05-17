import { leadRepository } from '../repositories/leadRepository';
import { LeadQuery, CreateLeadInput, UpdateLeadInput } from '../types';
import { ILead } from '../models/Lead';
import { LeadPage } from '../repositories/leadRepository';

export class LeadService {
  async getLeads(query: LeadQuery): Promise<LeadPage> {
    return leadRepository.findAll(query);
  }

  async getLeadById(id: string): Promise<ILead> {
    return leadRepository.findById(id);
  }

  async createLead(input: CreateLeadInput): Promise<ILead> {
    return leadRepository.create(input);
  }

  async updateLead(id: string, input: UpdateLeadInput): Promise<ILead> {
    return leadRepository.update(id, input);
  }

  async deleteLead(id: string): Promise<void> {
    return leadRepository.delete(id);
  }

  async exportLeadsAsCsv(query: LeadQuery): Promise<string> {
    const leads = await leadRepository.findAllForExport(query);

    const header = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((lead) => [
      lead._id.toString(),
      this.csvEscape(lead.name),
      this.csvEscape(lead.email),
      this.csvEscape(lead.phone ?? ''),
      this.csvEscape(lead.company ?? ''),
      lead.status,
      lead.source,
      this.csvEscape(lead.notes ?? ''),
      lead.createdAt.toISOString(),
    ]);

    const lines = [header, ...rows].map((r) => r.join(','));
    return lines.join('\n');
  }

  // Escape values that contain commas, quotes, or newlines
  private csvEscape(value: string): string {
    if (/[",\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

export const leadService = new LeadService();
