import { BookMetadata } from "./Book";
import { ReturnMetadata } from "./Return";
import { IAnnotations, IMetadata } from "./_ModelTypes";

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

const ReturnItemAnnotations: IAnnotations<IReturnItem> = {
  Id: { type: "key", title: "Код", nullable: false },
  ReturnId: {
    type: "fkey",
    title: "Код повернення",
    nullable: false,
    fk: ReturnMetadata,
  },
  BookId: {
    type: "fkey",
    title: "Код книги",
    nullable: false,
    fk: BookMetadata,
  },
  Quantity: { type: "number", title: "Кількість", nullable: false },
};

export const ReturnItemMetadata: IMetadata<IReturnItem> = {
  title: "Кошик повернення",
  endpoints: {
    one: "/librarian/returnitem",
    many: "/librarian/returnitems",
  },
  default: DefaultReturnItem,
  empty: EmptyReturnItem,
  annotations: ReturnItemAnnotations,
};
