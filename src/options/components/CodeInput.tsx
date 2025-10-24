import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import classNames from "classnames";

interface Props {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function CodeInput({ className, value, onChange }: Props) {
  return (
    <CodeMirror
      className={classNames(className)}
      value={value}
      extensions={[
        javascript({
          jsx: true,
          typescript: true,
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "16px",
            lineHeight: "24px",
          },
          ".cm-scroller": {
            height: "100%",
            overflow: "auto",
          },
        }),
      ]}
      theme="dark"
      onChange={onChange}
    />
  );
}
