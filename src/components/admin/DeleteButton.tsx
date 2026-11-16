"use client";

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
    <button
      type="submit"
      formAction={action}
      formNoValidate
      className="btn btn--danger btn--sm"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
