import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import type { Sheet } from "@/interfaces/sheet";

import Dropdown from "@/components/Dropdown";

import styles from "./SheetTabs.module.scss";

const cx = classNames.bind(styles);

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onChange: (sheetId: string) => void;
  onAdd: () => void;
  onRename: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
}

export default function SheetTabs({
  sheets,
  activeSheetId,
  onChange,
  onAdd,
  onRename,
  onDelete,
}: SheetTabsProps) {
  return (
    <div className={cx("wrapper")}>
      <button
        type="button"
        className={cx("addButton")}
        onClick={onAdd}
        aria-label="Add sheet"
      >
        <Icon icon="material-symbols:add" />
      </button>

      <div className={cx("tabs")}>
        {sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId;

          return (
            <Dropdown
              key={sheet.id}
              align="start"
              trigger={({ toggle }) => (
                <div
                  className={cx("tab", {
                    active: isActive,
                  })}
                  onClick={() => onChange(sheet.id)}
                >
                  <button type="button" className={cx("tabName")}>
                    {sheet.name}
                  </button>

                  <button
                    type="button"
                    className={cx("menuButton")}
                    onClick={() => {
                      if (isActive) {
                        toggle();
                      }
                    }}
                    aria-label={`Options for ${sheet.name}`}
                  >
                    <Icon icon="material-symbols:arrow-drop-down-rounded" />
                  </button>
                </div>
              )}
            >
              {({ close }) => (
                <div className={cx("menu")}>
                  <button
                    type="button"
                    className={cx("menuItem")}
                    onClick={() => {
                      close();
                      onRename(sheet.id);
                    }}
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    className={cx("menuItem", "danger")}
                    onClick={() => {
                      close();
                      onDelete(sheet.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </Dropdown>
          );
        })}
      </div>
    </div>
  );
}
