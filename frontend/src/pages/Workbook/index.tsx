// import { useEffect, useRef, useState } from "react";

// import classNames from "classnames/bind";

// import Toolbar from "@/features/spreadsheet/components/Toolbar";
// import Sheet from "@/features/spreadsheet/components/Sheet";
// import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";

// import {
//   createEmptyCell,
//   createInitialSheet,
//   DEFAULT_CELL_STYLE,
// } from "@/features/spreadsheet/model/defaults";

// import type { CellKey } from "@/types/cell";
// import type { CellStyle } from "@/types/cell-style";

// import { useRichTextEditor } from "@/features/spreadsheet/components/RichTextEditor/hooks";

// import styles from "./Workbook.module.scss";

// const cx = classNames.bind(styles);

// export default function Workbook() {
//   const [zoom, setZoom] = useState(100);

//   const [sheet, setSheet] = useState(createInitialSheet);

//   const [selectedCell, setSelectedCell] = useState<CellKey | null>(null);

//   const [editingCell, setEditingCell] = useState<CellKey | null>(null);

//   const cellsRef = useRef(sheet.cells);

//   const editor = useRichTextEditor();

//   useEffect(() => {
//     cellsRef.current = sheet.cells;
//   }, [sheet.cells]);

//   const activeCell = selectedCell ? sheet.cells[selectedCell] : null;

//   const activeCellStyle = activeCell?.style ?? DEFAULT_CELL_STYLE;

//   /*
//    * Load content khi chuyển cell edit.
//    */
//   useEffect(() => {
//     if (!editor) return;
//     if (!editingCell) return;

//     const cell = cellsRef.current[editingCell];

//     editor.commands.setContent(cell?.content ?? "<p></p>", {
//       emitUpdate: false,
//     });
//   }, [editor, editingCell]);

//   /*
//    * Editor -> Cell
//    */
//   useEffect(() => {
//     if (!editor) return;

//     const handleUpdate = () => {
//       if (!editingCell) return;

//       const content = editor.getHTML();

//       setSheet((prev) => {
//         const cell = prev.cells[editingCell] ?? createEmptyCell();

//         if (cell.content === content) {
//           return prev;
//         }

//         return {
//           ...prev,

//           cells: {
//             ...prev.cells,

//             [editingCell]: {
//               ...cell,
//               content,
//             },
//           },
//         };
//       });
//     };

//     editor.on("update", handleUpdate);

//     return () => {
//       editor.off("update", handleUpdate);
//     };
//   }, [editor, editingCell]);

//   /*
//    * Cell style
//    */
//   const handleUpdateCellStyle = (patch: Partial<CellStyle>) => {
//     if (!selectedCell) return;

//     setSheet((prev) => {
//       const currentCell = prev.cells[selectedCell] ?? createEmptyCell();

//       return {
//         ...prev,

//         cells: {
//           ...prev.cells,

//           [selectedCell]: {
//             ...currentCell,

//             style: {
//               ...currentCell.style,
//               ...patch,
//             },
//           },
//         },
//       };
//     });
//   };

//   /*
//    * Select cell
//    */
//   const handleCellSelect = (cellKey: CellKey | null) => {
//     if (editingCell && editingCell !== cellKey) {
//       setEditingCell(null);
//     }

//     setSelectedCell(cellKey);
//   };

//   /*
//    * Double click -> edit
//    */
//   const handleCellDoubleClick = (cellKey: CellKey) => {
//     setSheet((prev) => {
//       if (prev.cells[cellKey]) {
//         return prev;
//       }

//       return {
//         ...prev,

//         cells: {
//           ...prev.cells,

//           [cellKey]: createEmptyCell(),
//         },
//       };
//     });

//     setSelectedCell(cellKey);
//     setEditingCell(cellKey);
//   };

//   return (
//     <div className={cx("workbook")}>
//       <Toolbar
//         editing={editingCell !== null}
//         cellKey={selectedCell}
//         editor={editor}
//         cellStyle={activeCellStyle}
//         updateCellStyle={handleUpdateCellStyle}
//         zoom={zoom}
//         setZoom={setZoom}
//       />

//       <Sheet
//         rowCount={sheet.rowCount}
//         columnCount={sheet.columnCount}
//         cells={sheet.cells}
//         selectedCell={selectedCell}
//         editingCell={editingCell}
//         defaultCellStyle={DEFAULT_CELL_STYLE}
//         onCellSelect={handleCellSelect}
//         onCellDoubleClick={handleCellDoubleClick}
//         renderEditor={(cellKey) => (
//           <div className={cx("editing")}>
//             <RichTextEditor key={cellKey} editor={editor} />
//           </div>
//         )}
//       />
//     </div>
//   );
// }
