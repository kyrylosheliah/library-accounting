import { UserMetadata } from "./User";

export interface IUserClaim {
  Id: number;
  UserId: number;
  Type: string;
  Value: string;
}

const DefaultUserClaim: IUserClaim = {
  Id: 0,
  UserId: 0,
  Type: "",
  Value: "",
};

const EmptyUserClaim: IUserClaim = DefaultUserClaim;

const UserClaimAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  UserId: {
    type: "fkey",
    title: "Код користувача",
    nullable: false,
    foreignTable: { metadata: UserMetadata },
  },
  Type: { type: "string", title: "Тип", nullable: false },
  Value: { type: "string", title: "Значення", nullable: false },
};

export const UserClaimMetadata = {
  title: "Користувацькі ролі",
  endpoints: {
    one: "/admin/claim",
    many: "/admin/claims",
  },
  default: DefaultUserClaim,
  empty: EmptyUserClaim,
  annotations: UserClaimAnnotations,
};
