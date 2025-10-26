import { IndexedEntity } from "./core-utils";
import type { Document, User, Feedback } from "@shared/types";
export class DocumentEntity extends IndexedEntity<Document> {
  static readonly entityName = "document";
  static readonly indexName = "documents";
  static readonly initialState: Document = { id: "", userId: "", personelName: "", name: "", startDate: 0, endDate: 0 };
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", username: "", password: "", isAdmin: false };
}
export class FeedbackEntity extends IndexedEntity<Feedback> {
  static readonly entityName = "feedback";
  static readonly indexName = "feedbacks";
  static readonly initialState: Feedback = { id: "", userId: "", username: "", comment: "", timestamp: 0 };
}