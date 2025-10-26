import { Hono } from "hono";
import type { Env } from './core-utils';
import { DocumentEntity, UserEntity, FeedbackEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Document, User } from "@shared/types";
// --- Helper for password hashing ---
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// --- Zod Schemas ---
const documentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  personelName: z.string().min(1, 'Personel name is required'),
  name: z.string().min(1, 'Document name is required'),
  startDate: z.number().positive('Start date is required'),
  endDate: z.number().positive('End date is required')
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
});
const authSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const feedbackSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  username: z.string().min(1, 'Username is required'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});
export function userRoutes(app: Hono<{ Bindings: Env; }>) {
  // --- Auth Routes ---
  app.post('/api/auth/register', zValidator('json', authSchema), async (c) => {
    const { username, password } = c.req.valid('json');
    const userEntity = new UserEntity(c.env, username);
    if (await userEntity.exists()) {
      return bad(c, 'Username already taken');
    }
    const hashedPassword = await hashPassword(password);
    const allUsers = await UserEntity.list(c.env);
    const isAdmin = allUsers.items.length === 0;
    const user: User = { id: username, username, password: hashedPassword, isAdmin };
    await UserEntity.create(c.env, user);
    const { password: _, ...userToReturn } = user;
    return ok(c, userToReturn);
  });
  app.post('/api/auth/login', zValidator('json', authSchema), async (c) => {
    const { username, password } = c.req.valid('json');
    const userEntity = new UserEntity(c.env, username);
    if (!(await userEntity.exists())) {
      return notFound(c, 'Invalid username or password');
    }
    const user = await userEntity.getState();
    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      return bad(c, 'Invalid username or password');
    }
    const { password: _, ...userToReturn } = user;
    return ok(c, userToReturn);
  });
  // --- Document Routes ---
  app.get('/api/documents', async (c) => {
    const userId = c.req.query('userId');
    if (!isStr(userId)) return bad(c, 'userId is required');
    const page = await DocumentEntity.list(c.env);
    const userDocuments = page.items.filter(doc => doc.userId === userId);
    return ok(c, userDocuments);
  });
  app.post(
    '/api/documents',
    zValidator('json', documentSchema),
    async (c) => {
      const docData = c.req.valid('json');
      const document = { id: crypto.randomUUID(), ...docData };
      const created = await DocumentEntity.create(c.env, document);
      return ok(c, created);
    }
  );
  app.put(
    '/api/documents/:id',
    zValidator('json', documentSchema),
    async (c) => {
      const id = c.req.param('id');
      if (!isStr(id)) return bad(c, 'Invalid ID');
      const docData = c.req.valid('json');
      const documentEntity = new DocumentEntity(c.env, id);
      if (!(await documentEntity.exists())) {
        return notFound(c, 'Document not found');
      }
      const existingDoc = await documentEntity.getState();
      if (existingDoc.userId !== docData.userId) {
        return c.json({ success: false, error: 'Unauthorized' }, 403);
      }
      const updatedDocument: Document = { id, ...docData };
      await documentEntity.save(updatedDocument);
      return ok(c, updatedDocument);
    }
  );
  app.delete('/api/documents/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const { userId } = await c.req.json<{ userId: string }>();
    if (!isStr(userId)) return bad(c, 'userId is required');
    const documentEntity = new DocumentEntity(c.env, id);
    if (!(await documentEntity.exists())) {
      return notFound(c, 'Document not found');
    }
    const existingDoc = await documentEntity.getState();
    if (existingDoc.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    const deleted = await DocumentEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Document not found');
    return ok(c, { id, deleted });
  });
  // --- Feedback Routes ---
  app.post('/api/feedback', zValidator('json', feedbackSchema), async (c) => {
    const feedbackData = c.req.valid('json');
    const feedback = {
      id: crypto.randomUUID(),
      ...feedbackData,
      timestamp: Date.now(),
    };
    const created = await FeedbackEntity.create(c.env, feedback);
    return ok(c, created);
  });
  app.get('/api/feedback', async (c) => {
    const userId = c.req.query('userId');
    if (!isStr(userId)) return bad(c, 'userId is required');
    const userEntity = new UserEntity(c.env, userId);
    if (!(await userEntity.exists())) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    const user = await userEntity.getState();
    if (!user.isAdmin) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    const page = await FeedbackEntity.list(c.env);
    const sortedFeedback = page.items.sort((a, b) => b.timestamp - a.timestamp);
    return ok(c, sortedFeedback);
  });
}