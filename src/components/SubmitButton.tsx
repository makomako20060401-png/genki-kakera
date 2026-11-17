"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  disabled?: boolean;
  /** 削除ボタンなど、同じフォーム内の別ボタン用 */
  intent?: string;
  formAction?: (fd: FormData) => Promise<void>;
  confirmMessage?: string;
  formNoValidate?: boolean;
};

/**
 * 押すとすぐに「保存中…」とくるくるを表示し、二度押しを防ぐ送信ボタン。
 */
export default function SubmitButton({
  children,
  pendingText = "処理中…",
  className = "btn btn--gold",
  disabled,
  intent = "save",
  formAction,
  confirmMessage,
  formNoValidate,
}: Props) {
  const { pending, data } = useFormStatus();
  const submittedIntent = (data?.get("_intent") as string | null) ?? "save";
  const mine = pending && submittedIntent === intent;

  return (
    <button
      type="submit"
      name="_intent"
      value={intent}
      formAction={formAction}
      formNoValidate={formNoValidate}
      disabled={disabled || pending}
      aria-busy={mine}
      className={`${className}${mine ? " is-pending" : ""}`}
      onClick={(e) => {
        if (confirmMessage && !confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {mine && <span className="spinner" aria-hidden />}
      <span>{mine ? pendingText : children}</span>
    </button>
  );
}
