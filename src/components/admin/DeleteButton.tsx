"use client";

import SubmitButton from "../SubmitButton";

export default function DeleteButton({
  action,
  label = "削除",
  message = "本当に削除しますか？この操作は取り消せません。",
}: {
  action: (fd: FormData) => Promise<void>;
  label?: string;
  message?: string;
}) {
  return (
    <SubmitButton
      intent="delete"
      formAction={action}
      formNoValidate
      confirmMessage={message}
      pendingText="削除中…"
      className="btn btn--danger btn--sm"
    >
      {label}
    </SubmitButton>
  );
}
