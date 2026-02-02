import { z } from 'zod';
import { insertSignalSchema, signals } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  signals: {
    list: {
      method: 'GET' as const,
      path: '/api/signals',
      responses: {
        200: z.array(z.custom<typeof signals.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/signals/:id',
      responses: {
        200: z.custom<typeof signals.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/signals',
      input: insertSignalSchema,
      responses: {
        201: z.custom<typeof signals.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.internal, // Unauthorized
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/signals/:id',
      input: insertSignalSchema.partial(),
      responses: {
        200: z.custom<typeof signals.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/signals/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type SignalInput = z.infer<typeof api.signals.create.input>;
export type SignalResponse = z.infer<typeof api.signals.create.responses[201]>;
