import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IReturn {
  Id: number;
  ReaderId: number;
  StaffId: number;
  Date: Date;
}

const DefaultReturn: IReturn = {
  Id: 0,
  ReaderId: 0,
  StaffId: 0,
  Date: new Date(Date.now()),
};

const EmptyReturn: IReturn = DefaultReturn;

const ReturnAnnotations: IAnnotations<IReturn> = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: true,
    fk: UserMetadata,
  },
  StaffId: {
    type: "constfkey",
    title: "Код бібліотекаря",
    nullable: true,
  },
  Date: {
    type: "constdatetime",
    title: "Дата проведення",
    nullable: false,
  },
};

export const ReturnMetadata: IMetadata<IReturn> = {
  title: "Повернення",
  endpoints: {
    one: "/librarian/return",
    many: "/librarian/returns",
  },
  default: DefaultReturn,
  empty: EmptyReturn,
  annotations: ReturnAnnotations,
};
