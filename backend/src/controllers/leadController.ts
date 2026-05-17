import { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { leadService } from '../services/leadService';
import { asyncHandler, sendSuccess } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';
import { LeadQuery, CreateLeadInput, UpdateLeadInput, LeadStatus, LeadSource } from '../types';

const parseQuery = (req: AuthRequest): LeadQuery => ({
  page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
  limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  search: req.query.search as string | undefined,
  status: req.query.status as LeadStatus | undefined,
  source: req.query.source as LeadSource | undefined,
  sort: req.query.sort as 'latest' | 'oldest' | undefined,
});

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = parseQuery(req);
  const { leads, meta } = await leadService.getLeads(query);
  return sendSuccess(res, leads, 'Leads fetched', HTTP_STATUS.OK, meta);
});

export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id);
  return sendSuccess(res, lead, 'Lead fetched');
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const input: CreateLeadInput = {
    name: req.body.name as string,
    email: req.body.email as string,
    status: req.body.status as LeadStatus,
    source: req.body.source as LeadSource,
    phone: req.body.phone as string | undefined,
    company: req.body.company as string | undefined,
    notes: req.body.notes as string | undefined,
  };
  const lead = await leadService.createLead(input);
  return sendSuccess(res, lead, 'Lead created', HTTP_STATUS.CREATED);
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const input: UpdateLeadInput = { ...req.body } as UpdateLeadInput;
  const lead = await leadService.updateLead(req.params.id, input);
  return sendSuccess(res, lead, 'Lead updated');
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await leadService.deleteLead(req.params.id);
  return sendSuccess(res, null, 'Lead deleted', HTTP_STATUS.OK);
});

export const exportLeadsCsv = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = parseQuery(req);
  const csv = await leadService.exportLeadsAsCsv(query);
  const filename = `smart-leads-${Date.now()}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(HTTP_STATUS.OK).send(csv);
  return;
});
