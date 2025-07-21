import {Lease} from '../models/index.js';

export interface LeaseServiceError {
  error: true;
  message: string;
  details?: unknown;
}

export const getLeaseByIdForUser = async (
  leaseId: number,
  userId: number
): Promise<Lease | null | LeaseServiceError> => {
  try {
    return await Lease.findOne({where: {id: leaseId, userId}});
  } catch (err) {
    return {
      error: true,
      message: 'Failed to fetch lease.',
      details: err instanceof Error ? err.message : err,
    };
  }
};

export const getAllLeasesForUser = async (
  userId: number
): Promise<Lease[] | LeaseServiceError> => {
  try {
    return await Lease.findAll({
      where: {userId},
      order: [['createdAt', 'DESC']],
    });
  } catch (err) {
    return {
      error: true,
      message: 'Failed to fetch leases.',
      details: err instanceof Error ? err.message : err,
    };
  }
};
