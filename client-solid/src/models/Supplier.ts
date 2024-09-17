import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface ISupplier {
  Id: number;
  Name: string;
  Phone: string;
  Address: string | null;
  Organization: string | null;
}

const DefaultSupplier: ISupplier = {
  Id: 0,
  Name: "",
  Phone: "",
  Address: null,
  Organization: null,
};

const EmptySupplier: ISupplier = {
  Id: 0,
  Name: "",
  Phone: "",
  Address: "",
  Organization: "",
};

const SupplierAnnotations: IAnnotations<ISupplier> = {
  Id: { type: "key", title: "Код", nullable: false },
  Name: { type: "string", title: "Ім'я", nullable: false },
  Phone: { type: "string", title: "Телефон", nullable: false },
  Address: { type: "string", title: "Адреса", nullable: true },
  Organization: { type: "string", title: "Організація", nullable: true },
};

export const SupplierMetadata: IMetadata<ISupplier> = {
  title: "Постачальники",
  endpoints: {
    one: "/librarian/supplier",
    many: "/librarian/suppliers",
  },
  default: DefaultSupplier,
  empty: EmptySupplier,
  annotations: SupplierAnnotations,
};
