import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name"),
  userName: varchar("user_name"),
  email: varchar("email").unique(),
  emailVerified: timestamp("email_verified"),
  image: varchar("image"),
  password: varchar("password"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});
