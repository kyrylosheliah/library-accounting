import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { UserMetadata } from "~/models/User";

export default function UserManagement() {
  return (
    <GenericDBEntityPage
      prevRoute="/management"
      icon="i-tabler-user-edit"
      title="Облік користувачів"
      heading="Користувач"
      description="Управляйте користувацькими записами або блокуйте їх"
    >
      <EntityTable
        class="w-full max-w-6xl"
        metadata={UserMetadata}
        create
        edit
        refresh
        delete
      />
    </GenericDBEntityPage>
  );
}
