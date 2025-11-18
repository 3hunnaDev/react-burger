import React from "react";
import { Input as PractikumInput } from "@ya.praktikum/react-developer-burger-ui-components";

type BaseProps = Pick<
  React.ComponentProps<typeof PractikumInput>,
  | "name"
  | "placeholder"
  | "value"
  | "onChange"
  | "type"
  | "icon"
  | "onIconClick"
  | "disabled"
  | "error"
  | "extraClass"
  | "onBlur"
  | "onFocus"
  | "autoComplete"
  | "errorText"
>;

export interface TextInputProps extends BaseProps {
  isIcon?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ isIcon, icon, ...rest }, ref) => (
    <PractikumInput
      {...(rest as React.ComponentProps<typeof PractikumInput>)}
      icon={isIcon ? icon ?? "EditIcon" : icon}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";

export default TextInput;
