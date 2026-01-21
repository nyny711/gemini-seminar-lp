import { getDb } from './db';
import { seminarRegistrations, InsertSeminarRegistration } from '../drizzle/schema';

/**
 * セミナー登録をデータベースに保存
 */
export async function createSeminarRegistration(data: InsertSeminarRegistration) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const result = await db.insert(seminarRegistrations).values(data);
  return result;
}

/**
 * すべてのセミナー登録を取得
 */
export async function getAllSeminarRegistrations() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const result = await db.select().from(seminarRegistrations);
  return result;
}
