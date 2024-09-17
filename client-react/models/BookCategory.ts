export interface IBookCategory {
  Id: number;
  Category: string;
}

const DefaultBookCategory: IBookCategory = {
  Id: 0,
  Category: "",
};

const EmptyBookCategory: IBookCategory = DefaultBookCategory;

const BookCategoryAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  Category: { type: "string", title: "Назва", nullable: false },
};

export const BookCategoryMetadata = {
  title: "Категорії книг",
  endpoints: {
    one: "/librarian/category",
    many: "/librarian/categories",
  },
  default: DefaultBookCategory,
  empty: EmptyBookCategory,
  annotations: BookCategoryAnnotations,
};
