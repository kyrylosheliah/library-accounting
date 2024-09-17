import { createEffect, createSignal, on } from "solid-js";
import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { BookMetadata } from "~/models/Book";
import { BookCategoryMetadata } from "~/models/BookCategory";

const control = (val: number | undefined) => ({
  column: "CategoryId",
  value: val,
});

export default function BookCategoryAccounting() {
  const [selected, setSelected] = createSignal<number | undefined>(undefined);
  const [controlled, setControlled] = createSignal<
    { column: string; value: number | undefined }[]
  >([control(selected())]);

  createEffect(on(selected, () => setControlled([control(selected())])));

  return (
    <GenericDBEntityPage
      prevRoute="/accounting"
      icon="i-tabler-category-2"
      title="Категорії книг"
      heading="Категорія книги"
      description="Список категорій друку для каталогізації та подальшого пошуку"
    >
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 xl:col-span-4">
          <EntityTable
            metadata={BookCategoryMetadata}
            singular={{ get: selected, set: setSelected }}
            create
            edit
            refresh
          />
        </div>
        <div class="col-span-12 xl:col-span-8">
          <EntityTable
            metadata={BookMetadata}
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
