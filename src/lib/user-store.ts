import fs from "fs";
import path from "path";
import os from "os";
import { prisma } from "@/lib/prisma";

export interface StoredUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  role: "FREELANCER" | "CLIENT" | "DEMO";
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const BASE_USER_DIR = process.env.VERCEL ? os.tmpdir() : process.cwd();
const STORE_FILE_PATH = path.join(BASE_USER_DIR, ".users-store.json");

// In-memory cache on globalThis for development hot-reloading
const globalUserStore = globalThis as unknown as {
  _luminaUserStore?: Map<string, StoredUser>;
};

function getLocalStore(): Map<string, StoredUser> {
  if (!globalUserStore._luminaUserStore) {
    globalUserStore._luminaUserStore = new Map<string, StoredUser>();

    // Load from disk if exists
    try {
      if (fs.existsSync(STORE_FILE_PATH)) {
        const fileContent = fs.readFileSync(STORE_FILE_PATH, "utf-8");
        const list: StoredUser[] = JSON.parse(fileContent);
        for (const u of list) {
          globalUserStore._luminaUserStore.set(u.email.toLowerCase().trim(), {
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
          });
        }
      }
    } catch (e) {
      console.warn("Could not read local users store file:", (e as Error).message);
    }
  }

  return globalUserStore._luminaUserStore;
}

function persistLocalStore() {
  try {
    const store = getLocalStore();
    const list = Array.from(store.values());
    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write local users store file:", (e as Error).message);
  }
}

/**
 * Resilient lookup: checks PostgreSQL first; falls back to persistent local store if DB is offline.
 */
export async function findUserByEmail(rawEmail: string): Promise<StoredUser | null> {
  const email = rawEmail.toLowerCase().trim();

  // Try Prisma first
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      // Sync to local store for future resilience
      getLocalStore().set(email, {
        id: user.id,
        name: user.name,
        email: user.email!,
        password: user.password,
        role: user.role as StoredUser["role"],
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      return user as StoredUser;
    }
  } catch (dbError) {
    console.warn(
      "Prisma DB unavailable during user lookup, using resilient local store:",
      (dbError as Error).message
    );
  }

  // Fallback to local store
  const localUser = getLocalStore().get(email);
  return localUser || null;
}

/**
 * Resilient user creation: saves to PostgreSQL; falls back to local store if DB is offline.
 */
export async function createNewUser(data: {
  name: string;
  email: string;
  hashedPassword: string;
  role?: "FREELANCER" | "CLIENT" | "DEMO";
}): Promise<StoredUser> {
  const email = data.email.toLowerCase().trim();
  const role = data.role || "FREELANCER";
  const now = new Date();

  // Try saving to Prisma
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email,
        password: data.hashedPassword,
        role,
      },
    });

    const storedUser: StoredUser = {
      id: user.id,
      name: user.name,
      email: user.email!,
      password: user.password,
      role: user.role as StoredUser["role"],
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    getLocalStore().set(email, storedUser);
    persistLocalStore();
    return storedUser;
  } catch (dbError) {
    console.warn(
      "Prisma DB unavailable during user creation, saving to resilient persistent store:",
      (dbError as Error).message
    );
  }

  // Fallback: save to persistent local store
  const fallbackUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name: data.name.trim(),
    email,
    password: data.hashedPassword,
    role,
    image: null,
    createdAt: now,
    updatedAt: now,
  };

  getLocalStore().set(email, fallbackUser);
  persistLocalStore();
  return fallbackUser;
}
