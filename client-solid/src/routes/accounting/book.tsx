import { createSignal } from "solid-js";
import { BookCoverForm } from "~/components/BookCoverForm";
import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { BookMetadata } from "~/models/Book";

export default function BookAccounting() {
  const [selected, setSelected] = createSignal<number | undefined>(undefined);
  return (
    <GenericDBEntityPage
      prevRoute="/accounting"
      icon="i-tabler-clipboard-text"
      title="Облік книг"
      heading="Книга"
      description="Список описів видань та створення згадки про них у системі"
    >
      <div class="max-w-7xl grid grid-cols-12 gap-3">
        <div class="col-span-12 md:col-span-9">
          <EntityTable
            metadata={BookMetadata}
            singular={{ get: selected, set: setSelected }}
            create
            delete
            edit
            refresh
          />
        </div>
        <div class="col-span-12 md:col-span-3">
          <BookCoverForm id={selected} />
        </div>
      </div>
    </GenericDBEntityPage>
  );
}
