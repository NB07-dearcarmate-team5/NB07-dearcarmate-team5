import { object, string, optional, number, array, Infer } from 'superstruct';

export const SearchQuery = object({
  search: optional(string()),
});

export const CreateContract = object({
  carId: number(),
  customerId: number(),
  meetings: array(
    object({
      date: string(),
      alrams: array(string()),
    }),
  ),
});

export type CreateContractInput = Infer<typeof CreateContract>;
