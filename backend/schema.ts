import { pgTable, serial, text,varchar } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  sender: text("sender").notNull(),
  sticker: varchar("sticker", { length: 255 }),
});


export type Message = typeof messages.$inferSelect; 
export type NewMessage = typeof messages.$inferInsert; 
