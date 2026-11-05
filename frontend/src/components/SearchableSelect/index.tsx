import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import type { SelectOption } from "@/components/Select";

import styles from "./SearchableSelect.module.scss";

const cx = classNames.bind(styles);

interface SearchableSelectProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  ariaLabel?: string;
  leadingIcon?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

export default function SearchableSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không tìm thấy kết quả.",
  ariaLabel = "Chọn một mục",
  leadingIcon,
  disabled = false,
  fullWidth = false,
}: SearchableSelectProps<T>) {
  const id = useId();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    normalizeText(option.label).includes(normalizeText(search.trim())),
  );

  const closeDropdown = () => {
    setOpen(false);
    setSearch("");
  };

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    closeDropdown();
  };

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={cx("wrapper", {
        "full-width": fullWidth,
        open,
        disabled,
      })}
    >
      <button
        type="button"
        className={cx("trigger")}
        onClick={() => {
          if (disabled) return;

          if (open) {
            closeDropdown();
          } else {
            setOpen(true);
          }
        }}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
      >
        {leadingIcon && (
          <Icon
            className={cx("leading-icon")}
            icon={leadingIcon}
            aria-hidden="true"
          />
        )}

        <span
          className={cx("selected-value", {
            placeholder: !selectedOption,
          })}
          title={selectedOption?.label}
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <Icon
          className={cx("chevron", { rotated: open })}
          icon="lucide:chevron-down"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={cx("dropdown")}>
          <div className={cx("search-wrapper")}>
            <Icon
              className={cx("search-icon")}
              icon="lucide:search"
              aria-hidden="true"
            />

            <input
              ref={searchRef}
              id={`${id}-search`}
              className={cx("search-input")}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={`Tìm kiếm ${ariaLabel.toLowerCase()}`}
              autoComplete="off"
            />
          </div>

          <div
            id={`${id}-listbox`}
            className={cx("options")}
            role="listbox"
            aria-label={ariaLabel}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cx("option", { selected: isSelected })}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className={cx("option-label")}>{option.label}</span>

                    {isSelected && (
                      <Icon
                        className={cx("check-icon")}
                        icon="lucide:check"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className={cx("empty")}>
                <Icon icon="lucide:search-x" aria-hidden="true" />
                <span>{emptyMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
