import { IAnnotations, IMetadata } from "./_ModelTypes";

export interface IEnrollmentEvent {
  Id: number;
  Event: string;
}

const DefaultEnrollmentEvent: IEnrollmentEvent = {
  Id: 0,
  Event: "",
};

const EmptyEnrollmentEvent: IEnrollmentEvent = DefaultEnrollmentEvent;

const EnrollmentEventAnnotations: IAnnotations<IEnrollmentEvent> = {
  Id: { type: "key", title: "Код", nullable: false },
  Event: {
    type: "string",
    title: "Подія",
    nullable: false,
  },
};

export const EnrollmentEventMetadata: IMetadata<IEnrollmentEvent> = {
  title: "Посадові події",
  endpoints: {
    one: "/admin/enrollmentevent",
    many: "/admin/enrollmentevents",
  },
  default: DefaultEnrollmentEvent,
  empty: EmptyEnrollmentEvent,
  annotations: EnrollmentEventAnnotations,
};
