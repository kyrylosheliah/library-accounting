import { For } from "solid-js";
import { Title } from "solid-start";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Blockquote } from "~/ui/components/Blockquote";
import { Divider } from "~/ui/components/Divider";
import { Heading } from "~/ui/components/Heading";
import { IconBox } from "~/ui/components/IconBox";
import { Text } from "~/ui/components/Text";
import { Card } from "~/ui/components/Card";
import { Span } from "~/ui/components/Span";

const featureData = [
  {
    title: "Ми маємо щось і для вас",
    description:
      "Знання - сила! Ми раді, що ви знайшли час, щоб завітати до нашого каталогу. Ми пропонуємо широкий вибір друкованих видань незалежно від вашого інтересу чи віку, у нас є щось для кожного. Долучайтеся!",
    icon: "i-tabler-cookie",
  },
  {
    title: "Читання - це могутність",
    description:
      "Робота з джерелами та усвідомлення добре викладених думок інших людей є незамінним чинником вищої діяльності людини. Дослідження: люди, які багато читають, мають словниковий запас на 20% більше, а також набувають когнітивних навичок: логічне мислення, концентрація, пам'ять і творчість, оскільки воно збільшує кількість з'єднань між нейронами в головному мозку.",
    icon: "i-tabler-gauge",
  },
  {
    title: "Спільнота любителів читання",
    description:
      "Наша бібліотека - це не просто одна велитенська кнжкова полиця. Ми пропонуємо затишні кутки для читання, зручні робочі місця та навіть регулярні заходи, такі як авторські читання і книжкові клуби. Розширюйте свої горизонти приєднавшись до нашої бібліотеки!",
    icon: "i-tabler-users-group",
  },
];

export default function Home() {
  return (
    <>
      <Title>Бібліотека</Title>
      <main class="px-5 py-10 sm:py-20 flex flex-col items-center gap-10 sm:gap-16 lg:gap-24">
        <div class="max-w-2xl text-center">
          <Heading order={1} class="font-black">
            Каталог: <Span variant="gradient">друк та книжки</Span> для всіх
          </Heading>
          <Text variant="dim" class="mt-6 text-lg">
            Шукайте книжки та друковані видання. <br />
            Знаходьте своє наступне натхнення. <br />
            Чекаємо на вас.
          </Text>
          <div class="mt-6 flex items-center justify-center gap-x-10">
            <AnchorButton
              variant="border"
              href="/about"
              size="md"
              class="font-semibold"
            >
              Питання?
            </AnchorButton>
            <AnchorButton
              variant="color"
              href="/library"
              size="md"
              class="font-semibold flex flex-row items-center gap-2"
            >
              <div class="i-tabler-search h-4 w-4" />
              До пошуку
            </AnchorButton>
          </div>
        </div>

        <div class="max-w-6xl flex flex-wrap lg:flex-nowrap gap-10">
          <For each={featureData}>
            {(feature) => (
              <Card class="p-6 w-full lg:w-1/3">
                <IconBox
                  icon={feature.icon}
                  size="xl"
                  variant="subtle"
                  unpadded
                />
                <Text class="mt-3 text-xl font-bold">{feature.title}</Text>
                <Divider variant="color" class="mt-3 w-1/5 h-0.5" />
                <Text variant="dim" class="mt-3 text-justify">
                  {feature.description}
                </Text>
              </Card>
            )}
          </For>
        </div>

        <div class="">
          <Blockquote
            class="mx-auto"
            text="Нехай думки, укладені в книгах, будуть твоїм основним капіталом, а думки, які виникнуть у тебе самого – відсотками з нього"
            author="—Тома Аквінський"
          />
        </div>
      </main>
    </>
  );
}
