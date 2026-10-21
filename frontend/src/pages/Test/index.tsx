// import type { JSONContent } from "@tiptap/core";

// import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";

// import {
//   useRichTextEditor,
//   useTextStyle,
//   useTextStyleCommands,
// } from "@/features/spreadsheet/components/RichTextEditor/hooks";

// import Toolbar from "@/features/spreadsheet/components/Toolbar";

// import { DEFAULT_CELL_STYLE } from "@/features/spreadsheet/types";

// import styles from "./Test.module.scss";

// const INITIAL_CONTENT: JSONContent = {
//   type: "doc",
//   content: [
//     {
//       type: "paragraph",
//       content: [
//         {
//           type: "text",
//           text: "Hello Sheet Clone",
//         },
//       ],
//     },
//   ],
// };

// export default function RichTextEditorTest() {
//   const editor = useRichTextEditor(INITIAL_CONTENT);
//   const { updateTextStyle } = useTextStyleCommands(editor);
//   const textStyle = useTextStyle(editor);

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         <h1 className={styles.title}>Rich Text Editor Test</h1>

//         <div className={styles.editorWrapper}>
//           <Toolbar
//             textStyle={textStyle}
//             cellStyle={DEFAULT_CELL_STYLE}
//             updateTextStyle={updateTextStyle}
//             updateCellStyle={() => {}}
//             zoom={100}
//             setZoom={() => {}}
//           />

//           <div className={styles.editor}>
//             <RichTextEditor editor={editor} className={styles.richText} />
//           </div>
//         </div>

//         <section className={styles.debug}>
//           <div className={styles.debugHeader}>State</div>

//           <pre className={styles.debugContent}>
//             {JSON.stringify(
//               {
//                 textStyle,
//               },
//               null,
//               2,
//             )}
//           </pre>
//         </section>
//       </div>
//     </div>
//   );
// }
