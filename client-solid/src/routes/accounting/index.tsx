import { For } from "solid-js";
import { Title } from "solid-start";
import { EntityButton } from "~/components/EntityButton";
import { BookMetadata } from "~/models/Book";
import { BookCategoryMetadata } from "~/models/BookCategory";
import { BorrowMetadata } from "~/models/Borrow";
import { ReturnMetadata } from "~/models/Return";
import { SupplierMetadata } from "~/models/Supplier";
import { SupplyMetadata } from "~/models/Supply";
import { Text } from "~/ui/components/Text";

const accountingEntities = [
  {
    icon: undefined,
    metadata: BookCategoryMetadata,
    href: "/accounting/bookcategory",
  },
  {
    icon: undefined,
    metadata: BookMetadata,
    href: "/accounting/book",
  },
  {
    icon: "i-tabler-receipt",
    metadata: BorrowMetadata,
    href: "/accounting/borrow",
  },
  {
    icon: "i-tabler-receipt-refund",
    metadata: ReturnMetadata,
    href: "/accounting/return",
  },
  {
    icon: undefined,
    metadata: SupplierMetadata,
    href: "/accounting/supplier",
  },
  {
    icon: "i-tabler-square-rounded-plus",
    metadata: SupplyMetadata,
    href: "/accounting/supply",
  },
];

export default function Accounting() {
  return (
    <>
      <Title>Облік</Title>
      <main class="px-5 py-10 sm:py-20 flex flex-col items-center">
        <div class="max-w-4xl w-full grid grid-cols-12 gap-3">
          <Text class="col-span-12 my-10 text-4xl sm:text-6xl text-center font-semibold">
            Екран обліку
          </Text>
          <For each={accountingEntities}>
            {(entity) => (
              <EntityButton
                class="col-span-12 md:col-span-6"
                icon={entity.icon}
                metadata={entity.metadata}
                href={entity.href}
              />
            )}
          </For>
        </div>
      </main>
    </>
  );
}
