import { EnrollmentEventMetadata } from "./EnrollmentEvent";
import { UserMetadata } from "./User";
import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IEnrollment {
  Id: number;
  StaffId: number;
  EventId: number;
  EventDate: Date;
}

const DefaultEnrollment: IEnrollment = {
  Id: 0,
  StaffId: 0,
  EventId: 0,
  EventDate: new Date(Date.now()),
};

const EmptyEnrollment: IEnrollment = DefaultEnrollment;

const EnrollmentAnnotations: IAnnotations<IEnrollment> = {
  Id: { type: "key", title: "Код", nullable: false },
  StaffId: {
    type: "fkey",
    title: "Код користувача",
    nullable: false,
    fk: UserMetadata,
  },
  EventId: {
    type: "fkey",
    title: "Код події",
    nullable: false,
    fk: EnrollmentEventMetadata,
  },
  EventDate: {
    type: "constdatetime",
    title: "Дата події",
    nullable: false,
  },
};

export const EnrollmentMetadata: IMetadata<IEnrollment> = {
  title: "Зарахування",
  endpoints: {
    one: "/admin/enrollment",
    many: "/admin/enrollments",
  },
  default: DefaultEnrollment,
  empty: EmptyEnrollment,
  annotations: EnrollmentAnnotations,
};
