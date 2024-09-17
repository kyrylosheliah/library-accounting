import { createEffect, createSignal, on } from "solid-js";
import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { useBorrowAccounting } from "~/hooks/useAccounting";
import { BorrowMetadata } from "~/models/Borrow";
import { BorrowItemMetadata } from "~/models/BorrowItem";
import { Button } from "~/ui/components/Button";

const control = (val: number | undefined) => ({
  column: "BorrowId",
  value: val,
});

export default function BorrowAccounting() {
  const [selected, setSelected] = createSignal<number | undefined>(undefined);
  const [controlled, setControlled] = createSignal<
    { column: string; value: number | undefined }[]
  >([control(selected())]);
  const postBorrowDebt = useBorrowAccounting();

  createEffect(on(selected, () => setControlled([control(selected())])));

  return (
    <GenericDBEntityPage
      prevRoute="/accounting"
      icon="i-tabler-receipt"
      title="Запозичення"
      heading="Запозичення"
      description="Реєстрація запозичення кошику з друком"
    >
      <div class="grid grid-cols-12 gap-3 items-start">
        <div class="col-span-12 xl:col-span-6 flex flex-col items-stretch justify-center gap-3">
          <EntityTable
            metadata={BorrowMetadata}
            singular={{ get: selected, set: setSelected }}
            create
            edit
            refresh
            delete
          />
          <Button
            attributes={{
              disabled: !selected(),
              onClick: () => selected() && postBorrowDebt(selected()!),
            }}
            size="xl"
            variant="light"
          >
            Зарахувати борг
          </Button>
        </div>
        <div class="col-span-12 xl:col-span-6">
          <EntityTable
            metadata={BorrowItemMetadata}
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
