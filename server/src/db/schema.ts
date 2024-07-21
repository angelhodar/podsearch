import { sql } from "drizzle-orm";
import { index, pgTable, serial, text, integer, doublePrecision, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).unique().notNull(),
  link: text("link"),
  description: text("description"),
  language: varchar("language", { length: 255 }),
  categories: varchar("categories", { length: 255 }).array(),
  author: varchar("author", { length: 255 }).notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  podcastId: integer("podcastId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  processed: boolean("processed").default(false),
  description: text("description"),
  releaseDate: timestamp("releaseDate").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  audioFileUrl: text("audioFileUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const segments = pgTable("segments", {
  id: serial("id").primaryKey(),
  episodeId: integer("episodeId").notNull(),
  processed: boolean("processed").default(false),
  duration: integer("duration").notNull(),
  position: integer("position").notNull(), // Order of the segment in the episode
  audioFileUrl: text("audioFileUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const transcriptions = pgTable(
  "transcriptions",
  {
    id: serial("id").primaryKey(),
    segmentId: integer("segmentId").notNull(),
    startTime: doublePrecision("startTime").notNull(), // Time in seconds from the start of the segment
    endTime: doublePrecision("endTime").notNull(), // Time in seconds from the start of the segment
    transcription: text("transcription").notNull(), // Transcription text
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    transcriptionSearchIndex: index("transcription_search_index").using(
      "gin",
      sql`to_tsvector('spanish', ${table.transcription})`,
    ),
  }),
);

// Define the relations
export const podcastsRelations = relations(podcasts, ({ many }) => ({
  episodes: many(episodes),
}));

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  podcast: one(podcasts, {
    fields: [episodes.podcastId],
    references: [podcasts.id],
  }),
  segments: many(segments),
}));

export const segmentsRelations = relations(segments, ({ one, many }) => ({
  episode: one(episodes, {
    fields: [segments.episodeId],
    references: [episodes.id],
  }),
  transcriptions: many(transcriptions),
}));

export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  segment: one(segments, {
    fields: [transcriptions.segmentId],
    references: [segments.id],
  }),
}));

export type Podcast = typeof podcasts.$inferSelect;
export type CreatePodcast = typeof podcasts.$inferInsert;
export type Episode = typeof episodes.$inferSelect;
export type CreateEpisode = typeof episodes.$inferInsert;
export type Segment = typeof segments.$inferSelect;
export type CreateSegment = typeof segments.$inferInsert;
export type Transcription = typeof transcriptions.$inferSelect;
export type CreateTranscription = typeof transcriptions.$inferInsert;
