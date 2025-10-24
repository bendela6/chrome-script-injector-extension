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

export function InputSelect<K extends string>({
  className, //
  value,
  onChange,
  options,
}: Props<K>) {
  return (
    <select
      className={classNames(
        className,
        "w-full px-4 py-2",
        "border-2 border-slate-200 rounded-lg",
        "focus:border-blue-500 focus:outline-none",
        "transition-all"
      )}
      value={value as unknown as string}
      onChange={(e) => onChange?.(e.target.value as unknown as K)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
