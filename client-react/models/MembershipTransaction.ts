import { UserMetadata } from "./User";

export interface IMembershipTransaction {
  Id: number;
  ReaderId: number;
  Amount: number;
  Date: Date;
}

const DefaultMembershipTransaction: IMembershipTransaction = {
  Id: 0,
  ReaderId: 0,
  Amount: 0,
  Date: new Date(Date.now()),
};

const EmptyMembershipTransaction: IMembershipTransaction =
  DefaultMembershipTransaction;

const MembershipTransactionAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    foreignTable: { metadata: UserMetadata },
  },
  Amount: {
    type: "decimal",
    title: "Кількість",
    nullable: false,
  },
  Date: {
    type: "constdate",
    title: "Дата проведення",
    nullable: false,
  },
};

export const MembershipTransactionMetadata = {
  title: "Транзакції членства",
  endpoints: {
    one: "/admin/transaction",
    many: "/admin/transactions",
  },
  default: DefaultMembershipTransaction,
  empty: EmptyMembershipTransaction,
  annotations: MembershipTransactionAnnotations,
};
