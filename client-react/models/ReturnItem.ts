import { BookMetadata } from "./Book";
import { ReturnMetadata } from "./Return";

export interface IReturnItem {
  Id: number;
  ReturnId: number;
  BookId: number;
  Quantity: number;
}

const DefaultReturnItem: IReturnItem = {
  Id: 0,
  ReturnId: 0,
  BookId: 0,
  Quantity: 0,
};

const EmptyReturnItem: IReturnItem = DefaultReturnItem;

const ReturnItemAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  ReturnId: {
    type: "fkey",
    title: "Код повернення",
    nullable: false,
    foreignTable: { metadata: ReturnMetadata },
  },
  BookId: {
    type: "fkey",
    title: "Код книги",
    nullable: false,
    foreignTable: { metadata: BookMetadata },
  },
  Quantity: { type: "number", title: "Кількість", nullable: false },
};

export const ReturnItemMetadata = {
  title: "Кошик повернення",
  endpoints: {
    one: "/librarian/returnitem",
    many: "/librarian/returnitems",
  },
  default: DefaultReturnItem,
  empty: EmptyReturnItem,
  annotations: ReturnItemAnnotations,
};
