"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ページ移動・フォーム送信のたびに、画面上部に金色の進捗バーを表示する。
 * 0.3秒以上かかるときは「読み込み中」の表示も出す。
 */
export default function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [showBadge, setShowBadge] = useState(false);
  const timers = useRef<number[]>([]);
  const trickle = useRef<number | null>(null);
  const loading = useRef(false);

  const clearAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (trickle.current) window.clearInterval(trickle.current);
    trickle.current = null;
  };

  const finish = useCallback(() => {
    if (!loading.current) return;
    loading.current = false;
    clearAll();
    setProgress(100);
    setPhase("done");
    setShowBadge(false);
    timers.current.push(
      window.setTimeout(() => {
        setPhase("idle");
        setProgress(0);
      }, 450)
    );
  }, []);

  const start = useCallback(() => {
    clearAll();
    loading.current = true;
    setPhase("loading");
    setProgress(12);
    // 少しずつ 90% まで進める（完了したら一気に 100%）
    trickle.current = window.setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
    }, 180);
    timers.current.push(window.setTimeout(() => loading.current && setShowBadge(true), 300));
    // 万一戻ってこなくても表示が残り続けないように
    timers.current.push(window.setTimeout(finish, 20000));
  }, [finish]);

  // URL が変わったら完了
  useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // 同じページ内のスクロール（#menu など）は対象外
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    const onSubmit = () => start();
    // Next.js のリンクや React のフォームは途中でイベントを止めるので、先回り（capture）で拾う
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      clearAll();
    };
  }, [start]);

  return (
    <>
      <div
        className={`nav-progress is-${phase}`}
        role="progressbar"
        aria-hidden={phase === "idle"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="nav-progress__bar" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className={`nav-badge${showBadge ? " is-shown" : ""}`} aria-live="polite">
        <span className="spinner" aria-hidden />
        <span>読み込み中… {Math.round(progress)}%</span>
      </div>
    </>
  );
}
