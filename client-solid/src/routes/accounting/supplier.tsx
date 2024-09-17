import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { SupplierMetadata } from "~/models/Supplier";

export default function SupplierAccounting() {
  return (
    <GenericDBEntityPage
      prevRoute="/accounting"
      icon="i-tabler-user-down"
      title="Постачальники"
      heading="Постачальники"
      description="Список постачальників та джерел надходження фонду"
    >
      <EntityTable
        class="w-full max-w-6xl"
        metadata={SupplierMetadata}
        create
        edit
        refresh
        delete
      />
    </GenericDBEntityPage>
  );
}
