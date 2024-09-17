import { Component, JSX } from "solid-js";
import { Button } from "./Button";
import { ButtonVariant, SizeType } from "../Types";

export const FileButton: Component<{
  children: JSX.Element;
  class?: string;
  attributes?: JSX.InputHTMLAttributes<HTMLInputElement>;
  size?: SizeType;
  variant?: ButtonVariant;
  unpadded?: boolean;
  unrounded?: boolean;
}> = (props) => {
  let inputRef: HTMLInputElement;
  return (
    <Button
      size={props.size}
      variant={props.variant}
      unpadded={props.unpadded}
      unrounded={props.unrounded}
      class={props.class}
      attributes={{
        onClick: () => {
          inputRef.click();
        },
      }}
    >
      <input {...props.attributes} ref={inputRef!} type="file" class="hidden" />
      {props.children}
    </Button>
  );
  //e.target.files ? e.target.files[0] || undefined : undefined
};
