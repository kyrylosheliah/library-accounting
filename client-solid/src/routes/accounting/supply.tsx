import { createEffect, createSignal, on } from "solid-js";
import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { useSupplyAccounting } from "~/hooks/useAccounting";
import { SupplyMetadata } from "~/models/Supply";
import { SupplyItemMetadata } from "~/models/SupplyItem";
import { Button } from "~/ui/components/Button";

const control = (val: number | undefined) => ({
  column: "SupplyId",
  value: val,
});

export default function SupplyAccounting() {
  const [selected, setSelected] = createSignal<number | undefined>(undefined);
  const [controlled, setControlled] = createSignal<
    { column: string; value: number | undefined }[]
  >([control(selected())]);
  const postShelfSupply = useSupplyAccounting();

  createEffect(on(selected, () => setControlled([control(selected())])));

  return (
    <GenericDBEntityPage
      prevRoute="/accounting"
      icon="i-tabler-square-rounded-plus"
      title="Постачання"
      heading="Постачання"
      description="Реєстрація надходження до фонду постачання з матеріалом"
    >
      <div class="grid grid-cols-12 gap-3 items-start">
        <div class="col-span-12 xl:col-span-6 flex flex-col items-stretch justify-center gap-3">
          <EntityTable
            metadata={SupplyMetadata}
            singular={{ get: selected, set: setSelected }}
            create
            edit
            refresh
            delete
          />
          <Button
            attributes={{
              disabled: !selected(),
              onClick: () => selected() && postShelfSupply(selected()!),
            }}
            size="xl"
            variant="light"
          >
            Прорахувати полиці
          </Button>
        </div>
        <div class="col-span-12 xl:col-span-6">
          <EntityTable
            metadata={SupplyItemMetadata}
            controlled={controlled as any}
            create
            edit
            refresh
            delete
          />
        </div>
      </div>
    </GenericDBEntityPage>
  );
}
