"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * スクロール演出をまとめて担当するコンポーネント。
 *  - .reveal 要素：画面に入るとグラデーションのマスクがゆっくり開いて現れる
 *  - [data-parallax] 要素：スクロールに合わせて写真が少しずつ動く
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));

    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));

    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const speed = Number(el.dataset.parallax) || 0.12;
        const center = r.top + r.height / 2 - vh / 2;
        const max = r.height * 0.075; // 写真の端が見えないように動く幅を制限
        const v = Math.max(-max, Math.min(max, -center * speed));
        el.style.setProperty("--py", `${v.toFixed(1)}px`);
      });
      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) {
        const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight || 1)));
        hero.style.setProperty("--hero-p", p.toFixed(3));
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
