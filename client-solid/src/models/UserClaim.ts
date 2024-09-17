import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

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

const UserClaimAnnotations: IAnnotations<IUserClaim> = {
  Id: { type: "key", title: "Код", nullable: false },
  UserId: {
    type: "fkey",
    title: "Код користувача",
    nullable: false,
    fk: UserMetadata,
  },
  Type: { type: "string", title: "Тип", nullable: false },
  Value: { type: "string", title: "Значення", nullable: false },
};

export const UserClaimMetadata: IMetadata<IUserClaim> = {
  title: "Користувацькі ролі",
  endpoints: {
    one: "/admin/claim",
    many: "/admin/claims",
  },
  default: DefaultUserClaim,
  empty: EmptyUserClaim,
  annotations: UserClaimAnnotations,
};
