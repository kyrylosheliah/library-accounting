import { Accessor, Setter, createEffect, createSignal } from "solid-js";

interface IFormState {
  [key: string]: any;
}

interface IFormRule {
  [key: string]:
    | ((field: any, fields: any) => Array<string | null>)
    | undefined;
}

interface IFormValidation {
  [key: string]: () => boolean | undefined;
}

export interface IFormError {
  [key: string]: () => Array<string | null> | undefined;
}

export const useForm = (props: {
  initialState: IFormState;
  validation: IFormRule;
  submitAction: (param: Accessor<IFormState>) => void;
}): {
  state: { get: Accessor<IFormState>; set: Setter<IFormState> };
  valid: Accessor<IFormValidation>;
  error: Accessor<IFormError>;
  canSubmit: Accessor<boolean>;
  handleChange: (key: string, newFieldValue: any) => void;
  handleSubmit: () => void;
} => {
  const checkValid = () => {
    let valid: IFormValidation = {};
    for (const [key, rule] of Object.entries(props.validation)) {
      if (props.validation[key] === undefined) {
        valid[key] = () => undefined;
      } else {
        valid[key] = rule
          ? () => rule(state[0]()[key], state[0]()).findIndex((i) => i) === -1
          : () => undefined;
      }
    }
    return valid;
  };
  const checkError = () => {
    let error: IFormError = {};
    for (const [key, rule] of Object.entries(props.validation)) {
      if (props.validation[key] === undefined) {
        error[key] = () => undefined;
      } else {
        error[key] = rule
          ? () => rule(state[0]()[key], state[0]())
          : () => undefined;
      }
    }
    return error;
  };

  const state = createSignal<IFormState>(props.initialState);
  const [valid, setValid] = createSignal<IFormValidation>(checkValid());
  const [error, setError] = createSignal<IFormError>(checkError());
  const canSubmit = () => {
    let canSubmitFlag = true;
    for (const isValid of Object.values(checkValid())) {
      if (isValid() === undefined) {
        continue;
      } else if (!isValid()) {
        canSubmitFlag = false;
      }
    }
    return canSubmitFlag;
  };

  createEffect(() => {
    setValid(checkValid());
    setError(checkError());
  });

  const handleChange = (key: string, newFieldValue: any) => {
    state[1]((current) => ({ ...current, [key]: newFieldValue }));
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      props.submitAction(state[0]);
    }
  };

  return {
    state: { get: state[0], set: state[1] },
    valid,
    error,
    canSubmit,
    handleChange,
    handleSubmit,
  };
};
