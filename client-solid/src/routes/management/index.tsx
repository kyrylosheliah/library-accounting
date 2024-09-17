import { For } from "solid-js";
import { Title } from "solid-start";
import { EntityButton } from "~/components/EntityButton";
import { EnrollmentMetadata } from "~/models/Enrollment";
import { EnrollmentEventMetadata } from "~/models/EnrollmentEvent";
import { UserMetadata } from "~/models/User";
import { UserClaimMetadata } from "~/models/UserClaim";
import { Text } from "~/ui/components/Text";

const managementEntities = [
  {
    icon: undefined,
    metadata: UserMetadata,
    href: "/management/user",
  },
  {
    icon: undefined,
    metadata: UserClaimMetadata,
    href: "/management/role",
  },
  {
    icon: undefined,
    metadata: EnrollmentEventMetadata,
    href: "/management/event",
  },
  {
    icon: "i-tabler-address-book",
    metadata: EnrollmentMetadata,
    href: "/management/enrollment",
  },
];

export default function Management() {
  return (
    <>
      <Title>Управління</Title>
      <main class="px-5 py-10 sm:py-20 flex flex-col items-center">
        <div class="max-w-4xl w-full grid grid-cols-12 justify-center justify-items-center content-center items-center place-content-center place-items-center gap-3">
          <Text class="col-span-12 my-10 text-4xl sm:text-6xl text-center font-semibold">
            Екран управління
          </Text>
          <For each={managementEntities}>
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
