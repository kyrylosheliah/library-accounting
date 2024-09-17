import { Component, JSX } from "solid-js";
import { Title } from "solid-start";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Heading } from "~/ui/components/Heading";
import { IconBox } from "~/ui/components/IconBox";
import { Text } from "~/ui/components/Text";

export const GenericDBEntityPage: Component<{
  children: JSX.Element;
  prevRoute: string;
  icon: string;
  title: string;
  heading: string;
  description: string;
}> = (props) => (
  <>
    <Title>{props.title}</Title>
    <main class="px-5 mt-5 sm:mt-10 flex flex-col items-center text-center">
      <AnchorButton
        variant="subtle"
        href={props.prevRoute}
        unpadded
        class="pr-3 flex flex-row items-center"
      >
        <IconBox icon="i-tabler-chevron-left" size="md" variant="unstyle" />
        <div>Назад</div>
      </AnchorButton>
      <Heading
        order={1}
        class="font-semibold mt-5 flex flex-row items-center gap-4"
      >
        <IconBox
          class="h-10 w-10 sm:h-15 sm:w-15"
          variant="subtle"
          icon={props.icon}
        />
        <div>{props.heading}</div>
      </Heading>
      <Text class="mt-5 mb-5 sm:mb-10">{props.description}</Text>
      {props.children}
    </main>
  </>
);
