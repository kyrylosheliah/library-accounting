import { BookCategoryMetadata } from "./BookCategory";
import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IBook {
  Id: number;
  CategoryId: number | null;
  Title: string;
  Author: string;
  Year: number;
  Isbn: string | null;
  Annotation: string | null;
  BookingPolicy: number | null;
  QuantityPolicy: number | null;
}

const DefaultBook: IBook = {
  Id: 0,
  CategoryId: null,
  Title: "",
  Author: "",
  Year: new Date(Date.now()).getFullYear(),
  Isbn: null,
  Annotation: null,
  BookingPolicy: null,
  QuantityPolicy: null,
};

const EmptyBook: IBook = {
  Id: 0,
  CategoryId: 0,
  Title: "",
  Author: "",
  Year: new Date(Date.now()).getFullYear(),
  Isbn: "",
  Annotation: "",
  BookingPolicy: 14,
  QuantityPolicy: 2,
};

const BookAnnotations: IAnnotations<IBook> = {
  Id: { type: "key", title: "Код", nullable: false },
  CategoryId: {
    type: "fkey",
    title: "Код категорії",
    nullable: true,
    fk: BookCategoryMetadata,
  },
  Title: { type: "string", title: "Назва", nullable: false },
  Author: { type: "string", title: "Автор", nullable: false },
  Year: { type: "number", title: "Рік", nullable: false },
  Isbn: { type: "string", title: "Isbn", nullable: true },
  Annotation: { type: "text", title: "Примітка", nullable: true },
  BookingPolicy: { type: "number", title: "Днів запозичення", nullable: true },
  QuantityPolicy: {
    type: "number",
    title: "Кількість запозичення",
    nullable: true,
  },
};

export const BookMetadata: IMetadata<IBook> = {
  title: "Книги",
  endpoints: {
    one: "/librarian/book",
    many: "/librarian/books",
  },
  default: DefaultBook,
  empty: EmptyBook,
  annotations: BookAnnotations,
};

export const BookSearchFilterPurpose: {
  description: string;
  key: string | undefined;
}[] = ([{ description: "-", key: undefined }] as any).concat(
  Array.from(Object.entries(BookAnnotations))
    .map((item) => ({
      description: item[1].title,
      key: item[0],
    }))
    .filter((item) => item.key !== "CategoryId")
);
