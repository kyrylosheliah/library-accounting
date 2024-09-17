import { SupplierMetadata } from "./Supplier";
import { IAnnotations, IMetadata } from "./_ModelTypes";

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

const SupplyAnnotations: IAnnotations<ISupply> = {
  Id: { type: "key", title: "Код", nullable: false },
  Date: {
    type: "constdatetime",
    title: "Дата проведення",
    nullable: false,
  },
  SupplierId: {
    type: "fkey",
    title: "Код постачальника",
    nullable: true,
    fk: SupplierMetadata,
  },
};

export const SupplyMetadata: IMetadata<ISupply> = {
  title: "Постачання",
  endpoints: {
    one: "/librarian/supply",
    many: "/librarian/supplies",
  },
  default: DefaultSupply,
  empty: EmptySupply,
  annotations: SupplyAnnotations,
};
