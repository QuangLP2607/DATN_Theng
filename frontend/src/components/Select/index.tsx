import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";
import styles from "./Select.module.scss";

const cx = classNames.bind(styles);

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface SelectProps<T extends string | number> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
  labelId?: string;
  leadingIcon?: string;
  className?: string;
}

export default function Select<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Chọn một giá trị",
  disabled = false,
  error,
  fullWidth = true,
  ariaLabel,
  labelId,
  leadingIcon,
  className,
}: SelectProps<T>) {
  const selectedOption = options.find((option) => option.value === value);

  const containerClassName = [cx("container", { fullWidth }), className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      <Dropdown
        align="start"
        offset={6}
        matchTriggerWidth
        trigger={({ open, toggle }) => (
          <button
            className={cx("trigger", {
              open,
              hasError: Boolean(error),
            })}
            type="button"
            onClick={toggle}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={labelId}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-invalid={Boolean(error)}
          >
            {leadingIcon && (
              <Icon
                className={cx("leading-icon")}
                icon={leadingIcon}
                aria-hidden="true"
              />
            )}

            <span className={cx("value", { placeholder: !selectedOption })}>
              {selectedOption?.label ?? placeholder}
            </span>

            <Icon
              className={cx("chevron", { rotated: open })}
              icon="lucide:chevron-down"
              aria-hidden="true"
            />
          </button>
        )}
      >
        {({ close }) => (
          <div
            className={cx("menu")}
            role="listbox"
            aria-label={ariaLabel}
            aria-labelledby={labelId}
          >
            {options.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={String(option.value)}
                  className={cx("option", { selected })}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                >
                  <span>{option.label}</span>

                  {selected && (
                    <Icon
                      className={cx("check-icon")}
                      icon="lucide:check"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Dropdown>

      {error && (
        <p className={cx("error")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
