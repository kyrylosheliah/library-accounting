import { createEffect, createSignal, on } from "solid-js";
import { EntityTable } from "~/components/EntityTable";
import { GenericDBEntityPage } from "~/components/GenericDBEntityPage";
import { EnrollmentMetadata } from "~/models/Enrollment";
import { UserMetadata } from "~/models/User";

const control = (val: number | undefined) => ({
  column: "StaffId",
  value: val,
});

export default function EnrollmentManagement() {
  const [selected, setSelected] = createSignal<number | undefined>(undefined);
  const [controlled, setControlled] = createSignal<
    { column: string; value: number | undefined }[]
  >([control(selected())]);

  createEffect(on(selected, () => setControlled([control(selected())])));

  return (
    <GenericDBEntityPage
      prevRoute="/management"
      icon="i-tabler-category-2"
      title="Зарахування"
      heading="Зарахування"
      description="Управляйте подіями зарахування на посаду"
    >
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 xl:col-span-6">
          <EntityTable
            metadata={UserMetadata}
            singular={{ get: selected, set: setSelected }}
            create
            edit
            refresh
          />
        </div>
        <div class="col-span-12 xl:col-span-6">
          <EntityTable
            metadata={EnrollmentMetadata}
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
