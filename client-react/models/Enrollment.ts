import { EnrollmentEventMetadata } from "./EnrollmentEvent";
import { UserMetadata } from "./User";

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

const EnrollmentAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  StaffId: {
    type: "fkey",
    title: "Код користувача",
    nullable: false,
    foreignTable: { metadata: UserMetadata },
  },
  EventId: {
    type: "fkey",
    title: "Код події",
    nullable: false,
    foreignTable: { metadata: EnrollmentEventMetadata },
  },
  EventDate: {
    type: "constdate",
    title: "Дата події",
    nullable: false,
  },
};

export const EnrollmentMetadata = {
  title: "Зарахування",
  endpoints: {
    one: "/admin/enrollment",
    many: "/admin/enrollments",
  },
  default: DefaultEnrollment,
  empty: EmptyEnrollment,
  annotations: EnrollmentAnnotations,
};
