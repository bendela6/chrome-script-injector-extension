import classNames from "classnames";

interface Props {
  className?: string;
}

export function MainScreen({ className }: Props) {
  return (
    <div
      className={classNames(
        className,
        "flex items-center justify-center",
        "bg-gradient-to-br from-slate-50 to-slate-100"
      )}
    >
      <div className="text-center text-slate-400">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-xl font-medium mb-2">Select a script to edit</p>
        <p className="text-sm">or create a new one to get started</p>
      </div>
    </div>
  );
}
