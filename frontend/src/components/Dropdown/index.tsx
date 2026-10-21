import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";

import styles from "./Dropdown.module.scss";

interface DropdownTriggerProps {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

interface DropdownContentProps {
  close: () => void;
}

type DropdownAlign = "start" | "center" | "end";

interface DropdownProps {
  trigger: (props: DropdownTriggerProps) => ReactNode;
  children: (props: DropdownContentProps) => ReactNode;
  offset?: number;
  align?: DropdownAlign;
}

const VIEWPORT_PADDING = 8;

export default function Dropdown({
  trigger,
  children,
  offset = 0,
  align = "start",
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const dropdown = dropdownRef.current;

      if (!trigger || !dropdown) {
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();

      let left = triggerRect.left;

      if (align === "center") {
        left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2;
      }

      if (align === "end") {
        left = triggerRect.right - dropdownRect.width;
      }

      let top = triggerRect.bottom + offset;

      // Prevent overflow right.
      if (left + dropdownRect.width > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - VIEWPORT_PADDING - dropdownRect.width;
      }

      // Prevent overflow left.
      left = Math.max(left, VIEWPORT_PADDING);

      // Prevent overflow bottom.
      if (top + dropdownRect.height > window.innerHeight - VIEWPORT_PADDING) {
        top = triggerRect.top - dropdownRect.height - offset;
      }

      // Prevent overflow top.
      top = Math.max(top, VIEWPORT_PADDING);

      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${left}px`;
      dropdown.style.visibility = "visible";
    };

    updatePosition();

    const dropdown = dropdownRef.current;

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    if (dropdown) {
      resizeObserver.observe(dropdown);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, offset, align]);

  const toggle = () => {
    setOpen((current) => !current);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={triggerRef} className={styles.trigger}>
        {trigger({
          open,
          toggle,
          close,
        })}
      </div>

      {open && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {children({
            close,
          })}
        </div>
      )}
    </div>
  );
}
