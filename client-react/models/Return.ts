import { UserMetadata } from "./User";

export interface IBorrow {
  Id: number;
  ReaderId: number;
  StaffId: number;
  Date: Date;
}

const DefaultReturn: IBorrow = {
  Id: 0,
  ReaderId: 0,
  StaffId: 0,
  Date: new Date(Date.now()),
};

const EmptyReturn: IBorrow = DefaultReturn;

const ReturnAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: true,
    foreignTable: { metadata: UserMetadata },
  },
  StaffId: {
    type: "constfkey",
    title: "Код бібліотекаря",
    nullable: true,
  },
  Date: {
    type: "constdate",
    title: "Дата проведення",
    nullable: false,
  },
};

export const ReturnMetadata = {
  title: "Повернення",
  endpoints: {
    one: "/librarian/return",
    many: "/librarian/returns",
  },
  default: DefaultReturn,
  empty: EmptyReturn,
  annotations: ReturnAnnotations,
};
