import { prisma } from "../../src/config/prisma";

const SUBJECTS = [
  {
    code: "TOAN",
    title: "Toán học",
    description: "Kiến thức và luyện tập môn Toán THPT.",
    icon: "solar:calculator-linear",
  },
  {
    code: "VAN",
    title: "Ngữ văn",
    description: "Đọc hiểu, nghị luận và kiến thức văn học.",
    icon: "solar:book-2-linear",
  },
  {
    code: "ANH",
    title: "Tiếng Anh",
    description: "Ngữ pháp, từ vựng và kỹ năng tiếng Anh.",
    icon: "solar:letter-linear",
  },
  {
    code: "LY",
    title: "Vật lý",
    description: "Kiến thức vật lý và bài tập vận dụng.",
    icon: "solar:atom-linear",
  },
  {
    code: "HOA",
    title: "Hóa học",
    description: "Hóa học vô cơ, hữu cơ và thực hành.",
    icon: "solar:test-tube-linear",
  },
  {
    code: "SINH",
    title: "Sinh học",
    description: "Di truyền, tế bào và sinh thái học.",
    icon: "solar:dna-linear",
  },
  {
    code: "SU",
    title: "Lịch sử",
    description: "Lịch sử Việt Nam và lịch sử thế giới.",
    icon: "solar:history-linear",
  },
  {
    code: "DIA",
    title: "Địa lý",
    description: "Địa lý tự nhiên, dân cư và kinh tế.",
    icon: "solar:earth-linear",
  },
  {
    code: "TIN",
    title: "Tin học",
    description: "Tin học ứng dụng và tư duy lập trình.",
    icon: "solar:code-square-linear",
  },
  {
    code: "KTPL",
    title: "Giáo dục kinh tế và pháp luật",
    description: "Kiến thức kinh tế, pháp luật và công dân.",
    icon: "solar:scale-linear",
  },
  {
    code: "CN",
    title: "Công nghệ",
    description: "Kiến thức công nghệ và ứng dụng thực tiễn.",
    icon: "solar:settings-linear",
  },
  {
    code: "GDTC",
    title: "Giáo dục thể chất",
    description: "Kiến thức thể thao và rèn luyện sức khỏe.",
    icon: "solar:running-linear",
  },
] as const;

const GRADES = [
  { value: "GRADE_10" as const, label: "10" },
  { value: "GRADE_11" as const, label: "11" },
  { value: "GRADE_12" as const, label: "12" },
];

const CHAPTER_TITLES = [
  {
    title: "Kiến thức nền tảng",
    description: "Hệ thống kiến thức trọng tâm và các khái niệm cơ bản.",
  },
  {
    title: "Luyện tập và vận dụng",
    description: "Bài tập thực hành và vận dụng kiến thức đã học.",
  },
];

const LESSON_TITLES = [
  "Hệ thống kiến thức trọng tâm",
  "Ví dụ minh họa và phương pháp giải",
  "Bài tập luyện tập và vận dụng",
];

const LESSON_TYPES = ["VIDEO", "TEXT", "PDF"] as const;

export async function seedCatalogLearning(adminId: string) {
  const now = new Date();

  const subjects = [];
  const subjectGrades = [];
  const courses = [];
  const chapters = [];
  const lessons = [];

  for (const subjectData of SUBJECTS) {
    const subject = await prisma.subject.create({
      data: subjectData,
    });

    subjects.push(subject);

    for (const grade of GRADES) {
      const subjectGrade = await prisma.subjectGrade.create({
        data: {
          subjectId: subject.id,
          grade: grade.value,
        },
        include: {
          subject: true,
        },
      });

      subjectGrades.push(subjectGrade);

      const course = await prisma.course.create({
        data: {
          subjectGradeId: subjectGrade.id,
          title: `${subject.title} ${grade.label} - Luyện thi THPT 2027`,
          code: `${subject.code}${grade.label}-2027`,
          description: `Khóa học ${subject.title} dành cho học sinh lớp ${grade.label}. Bao gồm bài giảng, tài liệu và bài tập luyện thi.`,
          targetYear: 2027,
          status: "PUBLISHED",
          createdById: adminId,
          publishedAt: now,
        },
      });

      courses.push(course);

      for (const [chapterIndex, chapterData] of CHAPTER_TITLES.entries()) {
        const chapter = await prisma.chapter.create({
          data: {
            courseId: course.id,
            title: chapterData.title,
            description: chapterData.description,
            position: chapterIndex + 1,
            status: "PUBLISHED",
          },
        });

        chapters.push(chapter);

        for (const [lessonIndex, lessonTitle] of LESSON_TITLES.entries()) {
          const type = LESSON_TYPES[lessonIndex];

          const lesson = await prisma.lesson.create({
            data: {
              chapterId: chapter.id,
              title: `Bài ${lessonIndex + 1}: ${lessonTitle}`,
              type,
              content:
                type === "TEXT"
                  ? `Nội dung bài học ${lessonTitle.toLowerCase()}. Học sinh cần nắm vững kiến thức, ghi nhớ các nội dung quan trọng và hoàn thành bài tập vận dụng.`
                  : null,
              duration: type === "VIDEO" ? 15 + lessonIndex * 5 : null,
              position: lessonIndex + 1,
              status: "PUBLISHED",
            },
          });

          lessons.push(lesson);

          if (lessonIndex !== 1) {
            await prisma.lessonAttachment.create({
              data: {
                lessonId: lesson.id,
                title:
                  lessonIndex === 0
                    ? "Video bài giảng tham khảo"
                    : "Tài liệu tham khảo",
                type: "LINK",
                externalUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${course.title} ${lessonTitle}`,
                )}`,
                position: 1,
              },
            });
          }
        }
      }
    }
  }

  console.log("✓ Catalog and learning:", {
    subjects: subjects.length,
    subjectGrades: subjectGrades.length,
    courses: courses.length,
    chapters: chapters.length,
    lessons: lessons.length,
  });

  return {
    subjects,
    subjectGrades,
    courses,
    chapters,
    lessons,
  };
}
