import "./Footer.css";
import { For } from "solid-js";
import { SiteInfo } from "~/config/SiteInfo";
import { Div } from "~/ui/components/Div";
import { IconBox } from "~/ui/components/IconBox";
import { useTheme } from "~/ui/hooks/useTheme";

const data = [
  {
    title: "Поштова скринька",
    description: SiteInfo.email,
    icon: "i-tabler-at",
  },
  { title: "Телефон", description: SiteInfo.phone, icon: "i-tabler-phone" },
  { title: "Адреса", description: SiteInfo.address, icon: "i-tabler-map-pin" },
  {
    title: "Робочі години",
    description: SiteInfo.workingTime,
    icon: "i-tabler-sun",
  },
];

export const Footer = () => {
  const { dark } = useTheme();
  return (
    <div
      id="footer_scroll_purpose"
      class="footer mt-5 p-5 flex flex-col xl:flex-row justify-around items-center gap-5 xl:gap-0"
    >
      <div class="basis-0 grow flex justify-center items-center">
        <IconBox
          icon={dark() ? "i-tabler-book-2" : "i-tabler-book"}
          size="md"
        />
      </div>

      <Div
        variant="gradient"
        class="radius p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        <For each={data}>
          {(item) => (
            <div class="flex flex-row items-center">
              <IconBox
                variant="unstyle"
                class="mr-2"
                icon={item.icon}
                size="md"
              />
              <div>
                <div class="text-xs">{item.title}</div>
                <div>{item.description}</div>
              </div>
            </div>
          )}
        </For>
      </Div>

      <div class="basis-0 grow flex justify-center items-center gap-3 flex-row xl:flex-col">
        <IconBox icon="i-tabler-brand-telegram" size="md" variant="border" />
        <IconBox icon="i-tabler-brand-youtube" size="md" variant="border" />
        <IconBox icon="i-tabler-brand-instagram" size="md" variant="border" />
      </div>
    </div>
  );
};
