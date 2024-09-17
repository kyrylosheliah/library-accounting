import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

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

const MembershipTransactionAnnotations: IAnnotations<IMembershipTransaction> = {
  Id: { type: "key", title: "Код", nullable: false },
  ReaderId: {
    type: "fkey",
    title: "Код читача",
    nullable: false,
    fk: UserMetadata,
  },
  Amount: {
    type: "decimal",
    title: "Кількість",
    nullable: false,
  },
  Date: {
    type: "constdatetime",
    title: "Дата проведення",
    nullable: false,
  },
};

export const MembershipTransactionMetadata: IMetadata<IMembershipTransaction> =
  {
    title: "Транзакції членства",
    endpoints: {
      one: "/admin/transaction",
      many: "/admin/transactions",
    },
    default: DefaultMembershipTransaction,
    empty: EmptyMembershipTransaction,
    annotations: MembershipTransactionAnnotations,
  };
