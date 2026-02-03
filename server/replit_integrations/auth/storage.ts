import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  private users = new Map<string, User>();

  async getUser(id: string): Promise<User | undefined> {
    if (db) {
      try {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      } catch (err) {
        console.error("DB error in getUser, falling back to memory:", err);
      }
    }
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (db) {
      try {
        const [user] = await db
          .insert(users)
          .values(userData)
          .onConflictDoUpdate({
            target: users.id,
            set: {
              ...userData,
              updatedAt: new Date(),
            },
          })
          .returning();
        return user;
      } catch (err) {
        console.error("DB error in upsertUser, falling back to memory:", err);
      }
    }

    const user: User = {
      ...userData,
      id: userData.id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
    };
    this.users.set(user.id, user);
    return user;
  }
}

export const authStorage = new AuthStorage();
