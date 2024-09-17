import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IBorrow {
  Id: number;
  StaffId: number;
  ReaderId: number;
  Date: Date;
}

const DefaultBorrow: IBorrow = {
  Id: 0,
  StaffId: 0,
  ReaderId: 0,
  Date: new Date(Date.now()),
};

const EmptyBorrow: IBorrow = DefaultBorrow;

const BorrowAnnotations: IAnnotations<IBorrow> = {
  Id: { type: "key", title: "Код", nullable: false },
  StaffId: {
    type: "constfkey",
    title: "Код бібліотекаря",
    nullable: false,
  },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    fk: UserMetadata,
  },
  Date: {
    type: "constdatetime",
    title: "Дата проведення",
    nullable: false,
  },
};

export const BorrowMetadata: IMetadata<IBorrow> = {
  title: "Запозичення",
  endpoints: {
    one: "/librarian/borrow",
    many: "/librarian/borrows",
  },
  default: DefaultBorrow,
  empty: EmptyBorrow,
  annotations: BorrowAnnotations,
};
