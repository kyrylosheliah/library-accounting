import { BookMetadata } from "./Book";
import { BorrowMetadata } from "./Borrow";
import { UserMetadata } from "./User";

export interface IBorrowItem {
  Id: number;
  BorrowId: number;
  BookId: number;
  Quantity: number;
  ExpirationDate: Date;
}

const DefaultBorrowItem: IBorrowItem = {
  Id: 0,
  BorrowId: 0,
  BookId: 0,
  Quantity: 0,
  ExpirationDate: new Date(Date.now()),
};

const EmptyBorrowItem: IBorrowItem = DefaultBorrowItem;

const BorrowItemAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  BorrowId: {
    type: "fkey",
    title: "Код запозичення",
    nullable: false,
    foreignTable: { metadata: BorrowMetadata },
  },
  BookId: {
    type: "fkey",
    title: "Код книги",
    nullable: false,
    foreignTable: { metadata: BookMetadata },
  },
  Quantity: { type: "number", title: "Кількість", nullable: false },
  ExpirationDate: {
    type: "constdate",
    title: "Закінчення терміну дії",
    nullable: false,
  },
};

export const BorrowItemMetadata = {
  title: "Кошик запозичення",
  endpoints: {
    one: "/librarian/borrowitem",
    many: "/librarian/borrowitems",
  },
  default: DefaultBorrowItem,
  empty: EmptyBorrowItem,
  annotations: BorrowItemAnnotations,
};
