import { Select } from "antd";
import { ReactNode } from "react";
import classNames from "classnames";

type InputSelectOptions<K> = {
  label: ReactNode;
  value: K;
};

interface Props<K> {
  className?: string;
  value?: K;
  onChange?: (value: K) => void;
  options: InputSelectOptions<K>[];
}

export function InputSelect<K extends string | boolean | number>({
  className, //
  value,
  onChange,
  options,
}: Props<K>) {
  return (
    <Select
      className={classNames(className)}
      value={value}
      onChange={onChange}
      options={options}
      style={{ width: "100%" }}
    />
  );
}
