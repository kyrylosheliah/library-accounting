import { BookMetadata } from "./Book";

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

const ShelfAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  BookId: {
    type: "fkey",
    title: "Код книги",
    nullable: false,
    foreignTable: { metadata: BookMetadata },
  },
  Quantity: { type: "number", title: "Кількість", nullable: false },
};

export const ShelfMetadata = {
  title: "Полиці",
  endpoints: {
    one: "/librarian/shelf",
    many: "/librarian/shelves",
  },
  default: DefaultShelf,
  empty: EmptyShelf,
  annotations: ShelfAnnotations,
};
