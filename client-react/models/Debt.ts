import { BorrowItemMetadata } from "./BorrowItem";
import { UserMetadata } from "./User";

export interface IDebt {
  Id: number;
  ReaderId: number;
  BorrowItemId: number;
}

const DefaultDebt: IDebt = {
  Id: 0,
  ReaderId: 0,
  BorrowItemId: 0,
};

const EmptyDebt: IDebt = DefaultDebt;

const DebtAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    foreignTable: { metadata: UserMetadata },
  },
  BorrowItemId: {
    type: "fkey",
    title: "Код предмета запозичення",
    nullable: false,
    foreignTable: { metadata: BorrowItemMetadata },
  },
};

export const DebtMetadata = {
  title: "Кошик запозичення",
  endpoints: {
    one: "/librarian/debt",
    many: "/librarian/borrowitems",
  },
  default: DefaultDebt,
  empty: EmptyDebt,
  annotations: DebtAnnotations,
};
