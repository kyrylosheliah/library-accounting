import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IUser {
  Id: number;
  Name: string;
  Email: string;
  PasswordHash: string;
  Phone: string | null;
  LockoutEnabled: boolean;
  DateOfBirth: Date | null;
  Address: string | null;
  Gender: string | null;
  RegisterDate: Date;
}

const DefaultUser: IUser = {
  Id: 0,
  Name: "",
  Email: "",
  PasswordHash: "",
  Phone: null,
  LockoutEnabled: false,
  DateOfBirth: null,
  Address: null,
  Gender: null,
  RegisterDate: new Date(0),
};

const EmptyUser: IUser = {
  Id: 0,
  Name: "",
  Email: "",
  PasswordHash: "",
  Phone: "",
  LockoutEnabled: false,
  DateOfBirth: new Date(Date.now()),
  Address: "",
  Gender: "",
  RegisterDate: new Date(Date.now()),
};

const UserAnnotations: IAnnotations<IUser> = {
  Id: { type: "key", title: "Код", nullable: false },
  Name: { type: "string", title: "Ім'я", nullable: false },
  Email: { type: "string", title: "Електронна пошта", nullable: false },
  PasswordHash: { type: "string", title: "Хеш паролю", nullable: false },
  Phone: { type: "string", title: "Телефон", nullable: true },
  LockoutEnabled: { type: "boolean", title: "Заблоковано", nullable: false },
  DateOfBirth: { type: "datetime", title: "Дата народження", nullable: true },
  Address: { type: "string", title: "Адреса", nullable: true },
  Gender: { type: "char", title: "Стать", nullable: true },
  RegisterDate: {
    type: "constdatetime",
    title: "Дата реєстрації",
    nullable: false,
  },
};

export const UserMetadata: IMetadata<IUser> = {
  title: "Користувачі",
  endpoints: {
    one: "/admin/user",
    many: "/admin/users",
  },
  default: DefaultUser,
  empty: EmptyUser,
  annotations: UserAnnotations,
};

export interface IUserForm {
  Name: string;
  Email: string;
  Phone: string | null;
  DateOfBirth: Date | null;
  Address: string | null;
  Gender: string | null;
}

const DefaultUserForm: IUserForm = {
  Name: "",
  Email: "",
  Phone: null,
  DateOfBirth: null,
  Address: null,
  Gender: null,
};

const EmptyUserForm: IUserForm = {
  Name: "",
  Email: "",
  Phone: "",
  DateOfBirth: new Date(Date.now()),
  Address: "",
  Gender: "",
};

const UserFormAnnotations: IAnnotations<IUserForm> = {
  Name: { type: "string", title: "Ім'я", nullable: false },
  Email: { type: "string", title: "Електронна пошта", nullable: false },
  Phone: { type: "string", title: "Телефон", nullable: true },
  DateOfBirth: { type: "date", title: "Дата народження", nullable: true },
  Address: { type: "string", title: "Адреса", nullable: true },
  Gender: { type: "char", title: "Стать", nullable: true },
};

export const UserFormMetadata: IMetadata<IUserForm> = {
  title: "Дані користувача",
  endpoints: { one: "/user", many: "" },
  default: DefaultUserForm,
  empty: EmptyUserForm,
  annotations: UserFormAnnotations,
};

export const FormFromUser = (user: IUser): IUserForm => ({
  Name: user.Name,
  Email: user.Email,
  Phone: user.Phone,
  DateOfBirth: user.DateOfBirth,
  Address: user.Address,
  Gender: user.Gender,
});
