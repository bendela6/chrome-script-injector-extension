import classNames from "classnames";

interface Props {
  className?: string;
}

export function Header({ className }: Props) {
  return (
    <div
      className={classNames(
        className,
        "flex items-center justify-between p-4",
        "bg-gradient-to-r from-blue-600 to-purple-600",
        "text-white"
      )}
    >
      <div className="text-xl font-bold">🚀 Script Injector</div>
    </div>
  );
}
