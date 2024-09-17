import { SupplierMetadata } from "./Supplier";

export interface ISupply {
  Id: number;
  Date: Date;
  SupplierId: number;
}

const DefaultSupply: ISupply = {
  Id: 0,
  Date: new Date(Date.now()),
  SupplierId: 0,
};

const EmptySupply: ISupply = DefaultSupply;

const SupplyAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  Date: {
    type: "constdate",
    title: "Дата проведення",
    nullable: false,
  },
  SupplierId: {
    type: "fkey",
    title: "Код постачальника",
    nullable: true,
    foreignTable: { metadata: SupplierMetadata },
  },
};

export const SupplyMetadata = {
  title: "Постачання",
  endpoints: {
    one: "/librarian/supply",
    many: "/librarian/supplies",
  },
  default: DefaultSupply,
  empty: EmptySupply,
  annotations: SupplyAnnotations,
};
