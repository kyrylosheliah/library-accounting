import "./about.css";
import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import { Title } from "solid-start";
import {
  Accordion,
  AccordionTab,
  AccordionTabData,
} from "~/ui/components/Accordion";
import { Button } from "~/ui/components/Button";
import { Heading } from "~/ui/components/Heading";
import { IconBox } from "~/ui/components/IconBox";
import { Text } from "~/ui/components/Text";
import { cx } from "~/ui/utils/cx";

const accordionData: AccordionTabData[] = [
  {
    title: "Як я можу змінити свій пароль?",
    drawer:
      "Ви можете скористатися відповідною формою на сторінці налаштувань вашого облікового запису. Ви можете знайти цей пункт натиснувши іконку користувача праворуч у шапці.",
  },
  {
    title: "Чи можу я створити більше, ніж один акаунт?",
    drawer:
      "Так, ви можете. Але операції по запозиченню та поверненню друку проводить фізично відповідальний за них співробітник бібліотеки, до обов`язків якого входить посвідчення ваших даних.",
  },
  {
    title: "Як я можу підписатися на щомісячну поштову розсилку?",
    drawer:
      "Ви не можете. На даний момент сервер бібліотеки не передбачає такої послуги.",
  },
  {
    title: "Чи ви зберігаєте інформацію про мене безпечним чином?",
    drawer:
      "Особа може отримати доступ до перегляду користувацьких даних облікового запису лише після введення правильних даних облікового запису із наступним створенням вашого відбитка у Cookie браузера.\n\nВідбиток припиняє свою чинність у питанні виконання операцій на сайті від вашої особи за умови, якщо користувач не знаходиться на будь-якій сторінці сайту упродовж 30 хвилин.\n\nЗа умови витоку цього відбитка з нього можна зчитати лише ваш ідентификатор користувача та наявну роль в системі.",
  },
];

const ImageButton: Component<{
  title: string;
  class?: string;
  style?: string | JSX.CSSProperties;
  href: string;
  image: any;
}> = (props) => (
  <A
    target="_blank"
    href={props.href}
    title={props.title}
    class={cx(
      props.class,
      "flex items-center justify-center rounded-[1.5rem] shadow-xl hover:scale-110"
    )}
    style={props.style}
  >
    {props.image}
  </A>
);

export default function About() {
  const accordionTabs: AccordionTab[] = [
    {
      title: () => <div class="text-left ml-3">Як з вами зв&apos;язатися?</div>,
      drawer: () => (
        <div class="m-3 flex flex-row items-center justify-around flex-wrap gap-3">
          <Text>Зв&apos;язок за нашими контактами у футері сайту.</Text>
          <Button
            variant="border"
            class="p-3 flex flex-row items-center gap-3"
            attributes={{
              onClick: () =>
                document
                  .getElementById("footer_scroll_purpose")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  }),
            }}
          >
            <div class="ml-2">Вниз</div>
            <div class="i-tabler-arrow-move-down" />
          </Button>
        </div>
      ),
    },
  ].concat(
    accordionData.map((item) => ({
      title: () => <div class="text-left ml-3">{item.title}</div>,
      drawer: () => (
        <Text class="m-5 text-justify whitespace-pre-line">{item.drawer}</Text>
      ),
    }))
  );
  const accordionIcon = () => (
    <IconBox variant="unstyle" icon="i-tabler-chevron-down" size="md" />
  );

  return (
    <>
      <Title>Про нас</Title>
      <main class="px-5 py-10 sm:py-20 flex flex-col items-center justify-center">
        <Heading order={1} class="font-700 mb-10">
          Хто ми?
        </Heading>
        <Text class="max-w-xl text-justify">
          Наша платформа робить доступним перегляд каталогу цієї бібліотеки
          онлайн.
          <br />
          <br />
          Ви можете зареєструвати у нас обліковий запис, до якого у фізичному
          закладі ми матимемо змогу прив&apos;язати запозичені вами екземпляри
          будь-яких наявних у нас друкованих видань.
          <br />
          <br />
          Це дозволить вам переглядати ваші чеки з приводу подій запозичення та
          повернення книжок, які проходили через вас. Але найголовніше у цій
          функціональності - це перегляд ваших боргів по всіх запозиченнях, що
          облегшує інформування та взаємодію нас з вами.
        </Text>

        <Heading order={2} class="mt-10 sm:mt-20 font-700 mb-10">
          Часті запитання
        </Heading>
        <Accordion
          titleVariant="border"
          group
          class="max-w-xl w-full"
          titleClass="p-3"
          icon={accordionIcon}
          data={accordionTabs}
        />

        <Heading order={2} class="mt-10 sm:mt-20 font-700 mb-10">
          Створено за допомоги
        </Heading>
        <div class="flex flex-row items-center justify-center">
          <div class="flex flex-row flex-wrap justify-center gap-10">
            <ImageButton
              title="Solid Start"
              href="https://start.solidjs.com/"
              class="h-30 w-30 font-600 text-3xl leading-none flex-col bg-white"
              image={
                <>
                  <div class="text-black">SOLID</div>
                  <div class="text-[#446B9E]">START</div>
                </>
              }
            />
            <ImageButton
              title="Solid JS"
              class="h-30 w-30 p-3 bg-[#4f88c6] dark:bg-[#4f88c666]"
              href="https://www.solidjs.com/"
              image={<div class="i-solidjs-brand w-full h-full" />}
            />
            <ImageButton
              title="UnoCSS"
              class="h-30 w-30 p-3 dark:bg-[#1e1e20]"
              href="https://unocss.dev/"
              image={<div class="i-unocss-brand w-full h-full" />}
            />
            <ImageButton
              title="Entity Framework Core"
              class="text-11 h-30 w-30 bg-[#68217a]"
              href="https://learn.microsoft.com/en-us/ef/core/"
              image={
                <div class="text-white font-700 leading-none">
                  EF
                  <br />
                  Core
                </div>
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
