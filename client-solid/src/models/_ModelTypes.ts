export type IMetadata<T> = {
  title: string;
  endpoints: {
    one: string;
    many: string;
  };
  default: T;
  empty: T;
  annotations: IAnnotations<T>;
};

export type IAnnotations<T> = { [key in keyof T]: IAnnotation };

export type IAnnotation = {
  type: DBType;
  title: string;
  nullable: boolean;
  fk?: IMetadata<any>;
};

export type DBType =
  | "key"
  | "fkey"
  | "constfkey"
  | "const"
  | "constdatetime"
  | "datetime"
  | "date"
  | "number"
  | "decimal"
  | "string"
  | "text"
  | "boolean"
  | "char";
