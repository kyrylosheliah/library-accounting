import { UserMetadata } from "./User";

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

const MembershipAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    foreignTable: { metadata: UserMetadata },
  },
  StartDate: {
    type: "date",
    title: "Початок терміну дії",
    nullable: false,
  },
  ExpirationDate: {
    type: "constdate",
    title: "Закінчення терміну дії",
    nullable: false,
  },
};

export const MembershipMetadata = {
  title: "Членство",
  endpoints: {
    one: "/admin/membership",
    many: "/admin/memberships",
  },
  default: DefaultMembership,
  empty: EmptyMembership,
  annotations: MembershipAnnotations,
};
