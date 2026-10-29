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
  matchTriggerWidth?: boolean;
}

const VIEWPORT_PADDING = 8;

export default function Dropdown({
  trigger,
  children,
  offset = 0,
  align = "start",
  matchTriggerWidth = false,
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
      const triggerElement = triggerRef.current;
      const dropdownElement = dropdownRef.current;

      if (!triggerElement || !dropdownElement) {
        return;
      }

      const triggerRect = triggerElement.getBoundingClientRect();

      if (matchTriggerWidth) {
        dropdownElement.style.width = `${triggerRect.width}px`;
      } else {
        dropdownElement.style.removeProperty("width");
      }

      const dropdownRect = dropdownElement.getBoundingClientRect();

      let left = triggerRect.left;

      if (align === "center") {
        left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2;
      }

      if (align === "end") {
        left = triggerRect.right - dropdownRect.width;
      }

      let top = triggerRect.bottom + offset;

      if (left + dropdownRect.width > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - VIEWPORT_PADDING - dropdownRect.width;
      }

      left = Math.max(left, VIEWPORT_PADDING);

      if (top + dropdownRect.height > window.innerHeight - VIEWPORT_PADDING) {
        top = triggerRect.top - dropdownRect.height - offset;
      }

      top = Math.max(top, VIEWPORT_PADDING);

      dropdownElement.style.top = `${top}px`;
      dropdownElement.style.left = `${left}px`;
      dropdownElement.style.visibility = "visible";
    };

    updatePosition();

    const dropdownElement = dropdownRef.current;
    const triggerElement = triggerRef.current;

    const resizeObserver = new ResizeObserver(updatePosition);

    if (dropdownElement) {
      resizeObserver.observe(dropdownElement);
    }

    if (triggerElement) {
      resizeObserver.observe(triggerElement);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, offset, align, matchTriggerWidth]);

  const toggle = () => {
    setOpen((current) => !current);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={[
        styles.container,
        matchTriggerWidth ? styles.matchTriggerWidth : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div ref={triggerRef} className={styles.trigger}>
        {trigger({ open, toggle, close })}
      </div>

      {open && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {children({ close })}
        </div>
      )}
    </div>
  );
}
