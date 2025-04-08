import { useEffect } from "react";

export function useCss(href: string, id: string) {
  useEffect(() => {
    // Si déjà chargé, ne rien faire
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    document.head.appendChild(link);

    return () => {
      const existingLink = document.getElementById(id);
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [href, id]);
}
