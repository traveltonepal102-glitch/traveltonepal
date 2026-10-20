import { useEffect, useState } from "react";

/**
 * Id of the section being read: the one crossing a thin band near the top of the screen. Until the
 * reader scrolls into one, it is the first. Watches the section elements with an IntersectionObserver.
 */
export const useActiveSection = (ids: readonly string[]) => {
  const [activeId, setActiveId] = useState(ids[0]);
  // A string key, so a new array with the same ids doesn't restart the observer.
  const idsKey = ids.join(" ");

  useEffect(() => {
    const sections = idsKey
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const crossing = entries.find((entry) => entry.isIntersecting);
        if (crossing) setActiveId(crossing.target.id);
      },
      // A band from 20% to 25% down the screen: the section passing through it is the one being read.
      { rootMargin: "-20% 0px -75% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
};
