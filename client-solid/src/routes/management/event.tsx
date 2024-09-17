import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { EnrollmentEventMetadata } from "~/models/EnrollmentEvent";

export default function EnrollmentEventManagement() {
  return (
    <GenericDBEntityPage
      prevRoute="/management"
      icon="i-tabler-speakerphone"
      title="Посадові події"
      heading="Посадові події"
      description="Управляйте маркерами стану посадовця"
    >
      <EntityTable
        class="w-full max-w-6xl"
        metadata={EnrollmentEventMetadata}
        create
        edit
        refresh
        delete
      />
    </GenericDBEntityPage>
  );
}
