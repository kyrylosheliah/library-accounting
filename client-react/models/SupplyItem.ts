import { BookMetadata } from "./Book";
import { SupplyMetadata } from "./Supply";

export interface ISupplyItem {
  Id: number;
  SupplyId: number;
  BookId: number;
  UnitPrice: number;
  Quantity: number;
}

const DefaultSupplyItem: ISupplyItem = {
  Id: 0,
  SupplyId: 0,
  BookId: 0,
  UnitPrice: 0,
  Quantity: 0,
};

const EmptySupplyItem: ISupplyItem = DefaultSupplyItem;

const SupplyItemAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  SupplyId: {
    type: "fkey",
    title: "Код постачання",
    nullable: false,
    foreignTable: { metadata: SupplyMetadata },
  },
  BookId: {
    type: "fkey",
    title: "Код книги",
    nullable: false,
    foreignTable: { metadata: BookMetadata },
  },
  UnitPrice: {
    type: "decimal",
    title: "Ціна за одиницю",
    nullable: false,
  },
  Quantity: { type: "number", title: "Кількість", nullable: false },
};

export const SupplyItemMetadata = {
  title: "Кошик постачання",
  endpoints: {
    one: "/librarian/supplyitem",
    many: "/librarian/supplyitems",
  },
  default: DefaultSupplyItem,
  empty: EmptySupplyItem,
  annotations: SupplyItemAnnotations,
};
