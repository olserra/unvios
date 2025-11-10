#!/usr/bin/env node

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

async function setupTestDb() {
  // Create test database connection
  const migrationClient = postgres(process.env.POSTGRES_URL!, { max: 1 });

  try {
    // Drop test database if it exists
    await migrationClient.unsafe("DROP DATABASE IF EXISTS test_db;");

    // Create fresh test database
    await migrationClient.unsafe("CREATE DATABASE test_db;");

    // Connect to test database
    const testDb = postgres(
      process.env.POSTGRES_URL!.replace(/[^/]+$/, "test_db")
    );
    const db = drizzle(testDb, { schema });

    // Run migrations
    await migrate(db as any, { migrationsFolder: "drizzle" });

    console.log("✅ Test database setup complete");
  } catch (error) {
    console.error("❌ Test database setup failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

// Only run if directly executed
if (process.argv[1] === import.meta.url) {
  await setupTestDb();
}
