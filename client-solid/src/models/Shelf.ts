import { BookMetadata } from "./Book";
import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IShelf {
  Id: number;
  BookId: number;
  Quantity: number;
}

const DefaultShelf: IShelf = {
  Id: 0,
  BookId: 0,
  Quantity: 0,
};

const EmptyShelf: IShelf = DefaultShelf;

const ShelfAnnotations: IAnnotations<IShelf> = {
  Id: { type: "key", title: "Код", nullable: false },
  BookId: {
    type: "fkey",
    title: "Код книги",
    nullable: false,
    fk: BookMetadata,
  },
  Quantity: { type: "number", title: "Кількість", nullable: false },
};

export const ShelfMetadata: IMetadata<IShelf> = {
  title: "Полиці",
  endpoints: {
    one: "/librarian/shelf",
    many: "/librarian/shelves",
  },
  default: DefaultShelf,
  empty: EmptyShelf,
  annotations: ShelfAnnotations,
};
