import {
  pgTable,
  varchar,
  timestamp,
  integer,
  text,
  boolean,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// User Table
export const users = pgTable("user", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name"),
  email: varchar("email").unique(),
  emailVerified: timestamp("email_verified"),
  image: varchar("image"),
  password: varchar("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  userName: varchar("user_name"),
});

// User Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  watchlists: many(watchlists),
  continueWatching: many(continueWatching),
  bookmarks: many(bookmarks),
  comments: many(comments),
  commentLikes: many(commentLikes),
  commentDislikes: many(commentDislikes),
  replies: many(replyComments),
  replyLikes: many(likeReplyComments),
  accounts: many(accounts),
}));

// Account Table
export const accounts = pgTable(
  "account",
  {
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("provider_account_id").notNull(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").notNull(),
    refreshToken: varchar("refresh_token"),
    accessToken: varchar("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type"),
    scope: varchar("scope"),
    idToken: varchar("id_token"),
    sessionState: varchar("session_state"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ]
);

// Account Relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Session Table
export const sessions = pgTable("session", {
  sessionToken: varchar("session_token").primaryKey().notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

// Session Relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// VerificationToken Table
export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// Watchlist Table
export const watchlists = pgTable("watchlist", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  animeId: varchar("anime_id").notNull(),
  image: varchar("image").notNull(),
  title: varchar("title").notNull(),
  episodeNumber: integer("episode_number"),
  timeWatched: integer("time_watched").default(0),
  duration: integer("duration").default(0),
  episodeId: varchar("episode_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  anilistId: varchar("anilist_id").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Watchlist Relations
export const watchlistsRelations = relations(watchlists, ({ one }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.id],
  }),
}));

// Bookmark Table
export const bookmarks = pgTable("bookmark", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  animeId: varchar("anime_id").notNull(),
  image: varchar("image").notNull(),
  title: varchar("title").notNull(),
  anilistId: varchar("anilist_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Bookmark Relations
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

// ContinueWatching Table
export const continueWatching = pgTable("continue_watching", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  animeId: varchar("anime_id").notNull(),
  image: varchar("image").notNull(),
  title: varchar("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  anilistId: varchar("anilist_id").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ContinueWatching Relations
export const continueWatchingRelations = relations(
  continueWatching,
  ({ one }) => ({
    user: one(users, {
      fields: [continueWatching.userId],
      references: [users.id],
    }),
  })
);

// ViewCounter Table
export const viewCounters = pgTable("view_counter", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  view: integer("view").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  animeId: varchar("anime_id").notNull(),
  title: varchar("title").notNull(),
  image: varchar("image").notNull(),
  anilistId: varchar("anilist_id").notNull(),
  latestEpisodeNumber: integer("latest_episode_number"),
});

// Comment Table
export const comments = pgTable("comment", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  animeId: varchar("anime_id").notNull(),
  anilistId: varchar("anilist_id").notNull(),
  episodeId: varchar("episode_id").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  episodeNumber: varchar("episode_number").notNull(),
  isEdited: boolean("is_edited"),
  title: varchar("title"),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Comment Relations
export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  commentLikes: many(commentLikes),
  commentDislikes: many(commentDislikes),
  replyComments: many(replyComments),
}));

// CommentLike Table
export const commentLikes = pgTable(
  "comment_like",
  {
    id: varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    commentId: varchar("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("comment_like_user_id_comment_id_unique").on(
      table.userId,
      table.commentId
    ),
  ]
);

// CommentLike Relations
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));

// CommentDislike Table
export const commentDislikes = pgTable(
  "comment_dislike",
  {
    id: varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    commentId: varchar("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("comment_dislike_user_id_comment_id_unique").on(
      table.userId,
      table.commentId
    ),
  ]
);

// CommentDislike Relations
export const commentDislikesRelations = relations(
  commentDislikes,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentDislikes.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentDislikes.userId],
      references: [users.id],
    }),
  })
);

// ReplyComment Table
export const replyComments = pgTable("reply_comment", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  isEdited: boolean("is_edited"),
  commentId: varchar("comment_id")
    .notNull()
    .references(() => comments.id, { onDelete: "cascade" }),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ReplyComment Relations
export const replyCommentsRelations = relations(
  replyComments,
  ({ one, many }) => ({
    comment: one(comments, {
      fields: [replyComments.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [replyComments.userId],
      references: [users.id],
    }),
    replyLikes: many(likeReplyComments),
  })
);

// LikeReplyComment Table
export const likeReplyComments = pgTable(
  "like_reply_comment",
  {
    id: varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    replyId: varchar("reply_id")
      .notNull()
      .references(() => replyComments.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("like_reply_comment_user_id_reply_id_unique").on(
      table.userId,
      table.replyId
    ),
  ]
);

// LikeReplyComment Relations
export const likeReplyCommentsRelations = relations(
  likeReplyComments,
  ({ one }) => ({
    reply: one(replyComments, {
      fields: [likeReplyComments.replyId],
      references: [replyComments.id],
    }),
    user: one(users, {
      fields: [likeReplyComments.userId],
      references: [users.id],
    }),
  })
);
