import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Single shared Prisma client (PostgreSQL).
 * Reused across the app to avoid exhausting DB connections.
 *
 * Prisma 7 removed `url` from the schema datasource and the `datasources`/`datasourceUrl`
 * client options — the runtime connects through a driver adapter. We pass the Postgres
 * adapter the DATABASE_URL (loaded by `dotenv/config` above, before this module runs).
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

export default prisma;
