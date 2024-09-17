import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IMembership {
  Id: number;
  ReaderId: number;
  StartDate: Date;
  ExpirationDate: Date;
}

const DefaultMembership: IMembership = {
  Id: 0,
  ReaderId: 0,
  StartDate: new Date(Date.now()),
  ExpirationDate: new Date(Date.now()),
};

const EmptyMembership: IMembership = DefaultMembership;

const MembershipAnnotations: IAnnotations<IMembership> = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    fk: UserMetadata,
  },
  StartDate: {
    type: "datetime",
    title: "Початок терміну дії",
    nullable: false,
  },
  ExpirationDate: {
    type: "constdatetime",
    title: "Закінчення терміну дії",
    nullable: false,
  },
};

export const MembershipMetadata: IMetadata<IMembership> = {
  title: "Членство",
  endpoints: {
    one: "/admin/membership",
    many: "/admin/memberships",
  },
  default: DefaultMembership,
  empty: EmptyMembership,
  annotations: MembershipAnnotations,
};
