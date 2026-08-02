import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollToHashSection = (hash, offset = 73) => {
  const element = document.getElementById(String(hash || "").replace(/^#/, ""));
  if (!element) return;
  const top = Math.max(element.getBoundingClientRect().top + window.scrollY - offset, 0);
  window.scrollTo({ top, behavior: "smooth" });
};

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const frame = window.requestAnimationFrame(() => scrollToHashSection(hash));
    const retry = window.setTimeout(() => scrollToHashSection(hash), 250);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
