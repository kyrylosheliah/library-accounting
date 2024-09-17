import { createEffect, createSignal, on } from "solid-js";
import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { useReturnAccounting } from "~/hooks/useAccounting";
import { ReturnMetadata } from "~/models/Return";
import { ReturnItemMetadata } from "~/models/ReturnItem";
import { Button } from "~/ui/components/Button";

const control = (val: number | undefined) => ({
  column: "ReturnId",
  value: val,
});

export default function ReturnAccounting() {
  const [selected, setSelected] = createSignal<number | undefined>(undefined);
  const [controlled, setControlled] = createSignal<
    { column: string; value: number | undefined }[]
  >([control(selected())]);
  const deleteDebtReturn = useReturnAccounting();

  createEffect(on(selected, () => setControlled([control(selected())])));

  return (
    <GenericDBEntityPage
      prevRoute="/accounting"
      icon="i-tabler-receipt-refund"
      title="Повернення"
      heading="Повернення"
      description="Реєстрація повернення кошику з друком"
    >
      <div class="grid grid-cols-12 gap-3 items-start">
        <div class="col-span-12 xl:col-span-6 flex flex-col items-stretch justify-center gap-3">
          <EntityTable
            metadata={ReturnMetadata}
            singular={{ get: selected, set: setSelected }}
            create
            edit
            refresh
            delete
          />
          <Button
            attributes={{
              disabled: !selected(),
              onClick: () => selected() && deleteDebtReturn(selected()!),
            }}
            size="xl"
            variant="light"
          >
            Списати борг
          </Button>
        </div>
        <div class="col-span-12 xl:col-span-6">
          <EntityTable
            metadata={ReturnItemMetadata}
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
