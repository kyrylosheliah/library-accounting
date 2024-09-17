import { BorrowItemMetadata } from "./BorrowItem";
import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

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

const DebtAnnotations: IAnnotations<IDebt> = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    fk: UserMetadata,
  },
  BorrowItemId: {
    type: "fkey",
    title: "Код предмета запозичення",
    nullable: false,
    fk: BorrowItemMetadata,
  },
};

export const DebtMetadata: IMetadata<IDebt> = {
  title: "Кошик запозичення",
  endpoints: {
    one: "/librarian/debt",
    many: "/librarian/borrowitems",
  },
  default: DefaultDebt,
  empty: EmptyDebt,
  annotations: DebtAnnotations,
};
