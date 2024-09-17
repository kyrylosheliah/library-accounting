import { UserMetadata } from "./User";

export interface IAppointment {
  Id: number;
  StaffId: number;
  Date: Date;
  Created: Date;
  Modified: Date;
  Text: string;
}

const DefaultAppointment: IAppointment = {
  Id: 0,
  StaffId: 0,
  Date: new Date(Date.now()),
  Created: new Date(Date.now()),
  Modified: new Date(Date.now()),
  Text: "",
};

const EmptyAppointment: IAppointment = DefaultAppointment;

const AppointmentAnnotations = {
  Id: { type: "key", title: "Код", nullable: false },
  StaffId: {
    type: "fkey",
    title: "Код бібліотекаря",
    nullable: false,
    foreignTable: { metadata: UserMetadata },
  },
  Date: {
    type: "dateonly",
    title: "Дата",
    nullable: false,
  },
  Created: {
    type: "constdate",
    title: "Створено",
    nullable: false,
  },
  Modified: {
    type: "constdate",
    title: "Змінено",
    nullable: false,
  },
  Text: { type: "string", title: "Текст", nullable: false },
};

export const AppointmentMetadata = {
  title: "Призначення",
  endpoints: {
    one: "/librarian/appointment",
    many: "/librarian/appointments",
  },
  default: DefaultAppointment,
  empty: EmptyAppointment,
  annotations: AppointmentAnnotations,
};
