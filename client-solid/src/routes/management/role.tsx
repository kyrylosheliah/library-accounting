import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { UserClaimMetadata } from "~/models/UserClaim";

export default function RoleManagement() {
  return (
    <GenericDBEntityPage
      prevRoute="/management"
      icon="i-tabler-certificate"
      title="Користувацькі ролі"
      heading="Користувацькі ролі"
      description="Управляйте списком ролей серед усіх користувачів"
    >
      <EntityTable
        class="w-full max-w-6xl"
        metadata={UserClaimMetadata}
        create
        edit
        refresh
        delete
      />
    </GenericDBEntityPage>
  );
}
