export default function Flash({ msg, error }: { msg?: string; error?: string }) {
  if (!msg && !error) return null;
  return (
    <div className={`flash ${error ? "flash--error" : "flash--ok"}`} role="status">
      {error ? `エラー：${error}` : `✓ ${msg}`}
    </div>
  );
}
