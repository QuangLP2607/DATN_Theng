import { faker } from "@faker-js/faker/locale/vi";

import { prisma } from "../../src/config/prisma";

import type { seedUsers } from "./users.seed";
import type { seedCatalogLearning } from "./catalog-learning.seed";
import type { seedClassrooms } from "./classroom.seed";

type Users = Awaited<ReturnType<typeof seedUsers>>;
type Catalog = Awaited<ReturnType<typeof seedCatalogLearning>>;
type Classrooms = Awaited<ReturnType<typeof seedClassrooms>>;

type QuestionFixture = {
  content: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

const QUESTION_FIXTURES: Record<string, QuestionFixture[]> = {
  TOAN: [
    {
      content: "Đạo hàm của hàm số f(x) = x² là gì?",
      options: ["2x", "x", "x²", "2"],
      correctIndex: 0,
      explanation: "Áp dụng công thức đạo hàm của lũy thừa: (xⁿ)' = nxⁿ⁻¹.",
    },
    {
      content: "Giá trị của log₂(8) bằng bao nhiêu?",
      options: ["2", "3", "4", "8"],
      correctIndex: 1,
      explanation: "Vì 2³ = 8 nên log₂(8) = 3.",
    },
    {
      content: "Tổng ba góc trong một tam giác bằng bao nhiêu?",
      options: ["90°", "180°", "270°", "360°"],
      correctIndex: 1,
      explanation: "Tổng ba góc trong một tam giác bằng 180°.",
    },
  ],
  VAN: [
    {
      content: "Tác giả của tác phẩm Truyện Kiều là ai?",
      options: ["Nguyễn Du", "Nguyễn Trãi", "Hồ Xuân Hương", "Nam Cao"],
      correctIndex: 0,
      explanation: "Truyện Kiều là kiệt tác của đại thi hào Nguyễn Du.",
    },
    {
      content: "Tác phẩm Lão Hạc là sáng tác của nhà văn nào?",
      options: ["Ngô Tất Tố", "Nam Cao", "Kim Lân", "Thạch Lam"],
      correctIndex: 1,
      explanation: "Lão Hạc là truyện ngắn nổi tiếng của Nam Cao.",
    },
    {
      content: "Thể loại chính của tác phẩm Vợ nhặt là gì?",
      options: ["Truyện ngắn", "Thơ", "Kịch", "Tùy bút"],
      correctIndex: 0,
      explanation: "Vợ nhặt là truyện ngắn của nhà văn Kim Lân.",
    },
  ],
  ANH: [
    {
      content: "Choose the correct answer: She ___ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correctIndex: 1,
      explanation:
        "Chủ ngữ ngôi thứ ba số ít dùng động từ thêm -s/-es ở hiện tại đơn.",
    },
    {
      content: "What is the opposite of 'expensive'?",
      options: ["Cheap", "Large", "Beautiful", "Difficult"],
      correctIndex: 0,
      explanation: "'Cheap' có nghĩa là rẻ, trái nghĩa với 'expensive'.",
    },
    {
      content:
        "Choose the correct passive form: They built this house in 2020.",
      options: [
        "This house built in 2020.",
        "This house was built in 2020.",
        "This house is build in 2020.",
        "This house has build in 2020.",
      ],
      correctIndex: 1,
      explanation:
        "Câu bị động ở quá khứ đơn có cấu trúc was/were + past participle.",
    },
  ],
  LY: [
    {
      content: "Đơn vị đo cường độ dòng điện trong hệ SI là gì?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correctIndex: 1,
      explanation: "Cường độ dòng điện được đo bằng ampe (A).",
    },
    {
      content: "Công thức tính vận tốc chuyển động đều là gì?",
      options: ["v = s/t", "v = s × t", "v = t/s", "v = s + t"],
      correctIndex: 0,
      explanation: "Vận tốc bằng quãng đường chia cho thời gian.",
    },
    {
      content: "Định luật II Newton mô tả mối quan hệ nào?",
      options: [
        "Lực, khối lượng và gia tốc",
        "Nhiệt độ và áp suất",
        "Điện áp và điện trở",
        "Công và công suất",
      ],
      correctIndex: 0,
      explanation: "Định luật II Newton có dạng F = ma.",
    },
  ],
  HOA: [
    {
      content: "Ký hiệu hóa học của nguyên tố Oxygen là gì?",
      options: ["O", "Ox", "Og", "On"],
      correctIndex: 0,
      explanation: "Ký hiệu hóa học của Oxygen là O.",
    },
    {
      content: "Dung dịch có pH nhỏ hơn 7 thường có tính chất gì?",
      options: ["Bazơ", "Axit", "Trung tính", "Không xác định"],
      correctIndex: 1,
      explanation: "Dung dịch có pH nhỏ hơn 7 có môi trường axit.",
    },
    {
      content: "Công thức hóa học của nước là gì?",
      options: ["CO₂", "H₂O", "O₂", "H₂O₂"],
      correctIndex: 1,
      explanation:
        "Một phân tử nước gồm hai nguyên tử hydrogen và một nguyên tử oxygen.",
    },
  ],
  SINH: [
    {
      content: "Bào quan nào là nơi diễn ra quá trình quang hợp?",
      options: ["Ti thể", "Lục lạp", "Ribosome", "Nhân tế bào"],
      correctIndex: 1,
      explanation: "Quang hợp diễn ra trong lục lạp của tế bào thực vật.",
    },
    {
      content: "Vật chất di truyền chủ yếu ở sinh vật nhân thực là gì?",
      options: ["Protein", "DNA", "Lipid", "Glucose"],
      correctIndex: 1,
      explanation: "DNA là vật chất di truyền chủ yếu ở sinh vật.",
    },
    {
      content: "Đơn vị cấu trúc và chức năng cơ bản của cơ thể sống là gì?",
      options: ["Mô", "Cơ quan", "Tế bào", "Hệ cơ quan"],
      correctIndex: 2,
      explanation: "Tế bào là đơn vị cấu trúc và chức năng cơ bản của sự sống.",
    },
  ],
  SU: [
    {
      content: "Cách mạng tháng Tám ở Việt Nam diễn ra vào năm nào?",
      options: ["1930", "1945", "1954", "1975"],
      correctIndex: 1,
      explanation: "Cách mạng tháng Tám thành công vào năm 1945.",
    },
    {
      content: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?",
      options: ["1945", "1950", "1954", "1975"],
      correctIndex: 2,
      explanation: "Chiến thắng Điện Biên Phủ diễn ra ngày 7/5/1954.",
    },
    {
      content: "Ngày Quốc khánh Việt Nam là ngày nào?",
      options: ["30/4", "1/5", "2/9", "19/5"],
      correctIndex: 2,
      explanation:
        "Ngày 2/9/1945 là ngày Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập.",
    },
  ],
  DIA: [
    {
      content: "Việt Nam nằm trong khu vực địa lý nào?",
      options: ["Đông Nam Á", "Tây Á", "Nam Á", "Đông Bắc Á"],
      correctIndex: 0,
      explanation: "Việt Nam thuộc khu vực Đông Nam Á.",
    },
    {
      content: "Đồng bằng lớn nhất Việt Nam là đồng bằng nào?",
      options: [
        "Đồng bằng sông Hồng",
        "Đồng bằng sông Cửu Long",
        "Đồng bằng Thanh Hóa",
        "Đồng bằng Nghệ An",
      ],
      correctIndex: 1,
      explanation: "Đồng bằng sông Cửu Long là đồng bằng lớn nhất nước ta.",
    },
    {
      content: "Khí hậu chủ yếu của Việt Nam là kiểu khí hậu nào?",
      options: ["Ôn đới", "Nhiệt đới gió mùa", "Hàn đới", "Hoang mạc"],
      correctIndex: 1,
      explanation: "Việt Nam có khí hậu nhiệt đới ẩm gió mùa.",
    },
  ],
  TIN: [
    {
      content: "Trong lập trình, biến dùng để làm gì?",
      options: [
        "Lưu trữ dữ liệu",
        "Tạo giao diện",
        "Kết nối Internet",
        "Khởi động máy tính",
      ],
      correctIndex: 0,
      explanation: "Biến là vùng nhớ có tên dùng để lưu trữ dữ liệu.",
    },
    {
      content: "HTML chủ yếu được sử dụng để làm gì?",
      options: [
        "Quản lý cơ sở dữ liệu",
        "Xây dựng cấu trúc trang web",
        "Biên dịch chương trình",
        "Quản lý hệ điều hành",
      ],
      correctIndex: 1,
      explanation: "HTML mô tả cấu trúc và nội dung của trang web.",
    },
    {
      content: "Cấu trúc điều kiện phổ biến trong lập trình là gì?",
      options: ["if...else", "for...of", "while...do", "import...export"],
      correctIndex: 0,
      explanation: "if...else cho phép chương trình rẽ nhánh theo điều kiện.",
    },
  ],
  KTPL: [
    {
      content: "Hiến pháp là văn bản có hiệu lực pháp lý như thế nào?",
      options: [
        "Thấp nhất",
        "Cao nhất",
        "Ngang với nội quy",
        "Chỉ áp dụng cho doanh nghiệp",
      ],
      correctIndex: 1,
      explanation: "Hiến pháp là luật cơ bản, có hiệu lực pháp lý cao nhất.",
    },
    {
      content: "Hành vi nào thể hiện trách nhiệm công dân?",
      options: [
        "Tuân thủ pháp luật",
        "Trốn tránh nghĩa vụ",
        "Xâm phạm tài sản",
        "Gây mất trật tự",
      ],
      correctIndex: 0,
      explanation: "Tuân thủ pháp luật là trách nhiệm cơ bản của công dân.",
    },
    {
      content: "Cung trong kinh tế học thường thể hiện điều gì?",
      options: [
        "Lượng hàng hóa người bán sẵn sàng bán",
        "Lượng hàng hóa người mua muốn mua",
        "Tổng số dân",
        "Tổng số doanh nghiệp",
      ],
      correctIndex: 0,
      explanation:
        "Cung là lượng hàng hóa, dịch vụ người bán sẵn sàng cung ứng.",
    },
  ],
  CN: [
    {
      content: "Vật liệu nào thường được sử dụng làm dây dẫn điện?",
      options: ["Đồng", "Gỗ", "Cao su", "Thủy tinh"],
      correctIndex: 0,
      explanation:
        "Đồng có độ dẫn điện tốt và được sử dụng phổ biến làm dây dẫn.",
    },
    {
      content: "Bản vẽ kỹ thuật có vai trò chính là gì?",
      options: [
        "Truyền đạt thông tin kỹ thuật",
        "Trang trí sản phẩm",
        "Quảng cáo sản phẩm",
        "Lưu trữ âm thanh",
      ],
      correctIndex: 0,
      explanation:
        "Bản vẽ kỹ thuật truyền đạt hình dạng, kích thước và thông tin kỹ thuật.",
    },
    {
      content: "Thiết bị nào có chức năng biến đổi điện năng thành cơ năng?",
      options: ["Động cơ điện", "Cầu chì", "Công tắc", "Điện trở"],
      correctIndex: 0,
      explanation: "Động cơ điện biến đổi điện năng thành cơ năng.",
    },
  ],
  GDTC: [
    {
      content: "Khởi động trước khi tập luyện có tác dụng chính là gì?",
      options: [
        "Giảm nguy cơ chấn thương",
        "Làm cơ thể mệt hơn",
        "Thay thế toàn bộ buổi tập",
        "Không có tác dụng",
      ],
      correctIndex: 0,
      explanation:
        "Khởi động giúp cơ thể thích nghi dần với cường độ vận động.",
    },
    {
      content: "Hoạt động nào giúp phát triển sức bền?",
      options: ["Chạy bền", "Ngồi nghỉ", "Đứng yên", "Ngủ"],
      correctIndex: 0,
      explanation: "Chạy bền là một hình thức rèn luyện sức bền.",
    },
    {
      content: "Uống đủ nước khi vận động giúp ích điều gì?",
      options: [
        "Duy trì cân bằng nước",
        "Làm mất nước nhanh hơn",
        "Không ảnh hưởng cơ thể",
        "Thay thế dinh dưỡng",
      ],
      correctIndex: 0,
      explanation:
        "Bổ sung nước giúp duy trì cân bằng dịch và hỗ trợ điều hòa thân nhiệt.",
    },
  ],
};

export async function seedAssessment(
  users: Users,
  catalog: Catalog,
  classrooms: Classrooms,
) {
  const { admin } = users;
  const { subjectGrades, courses, chapters } = catalog;
  const { classes } = classrooms;

  const courseBySubjectGrade = new Map(
    courses.map((course) => [course.subjectGradeId, course]),
  );

  const questionsBySubjectGrade = new Map<
    string,
    Array<{
      id: string;
      options: Array<{
        id: string;
        isCorrect: boolean;
      }>;
    }>
  >();

  // Tạo ngân hàng câu hỏi: 3 câu hỏi cho mỗi môn và mỗi khối.
  for (const subjectGrade of subjectGrades) {
    const fixtures = QUESTION_FIXTURES[subjectGrade.subject.code] ?? [];

    const course = courseBySubjectGrade.get(subjectGrade.id);

    if (!course) {
      continue;
    }

    const courseChapters = chapters.filter(
      (chapter) => chapter.courseId === course.id,
    );

    const chapterId = courseChapters[0]?.id ?? null;

    const questions = [];

    for (const [index, fixture] of fixtures.entries()) {
      const question = await prisma.question.create({
        data: {
          subjectGradeId: subjectGrade.id,
          chapterId,
          content: fixture.content,
          type: "SINGLE_CHOICE",
          difficulty: (["EASY", "MEDIUM", "HARD"] as const)[index],
          explanation: fixture.explanation,
          createdBy: admin.id,
          options: {
            create: fixture.options.map((content, optionIndex) => ({
              content,
              position: optionIndex + 1,
              isCorrect: optionIndex === fixture.correctIndex,
            })),
          },
        },
        include: {
          options: true,
        },
      });

      questions.push({
        id: question.id,
        options: question.options.map((option) => ({
          id: option.id,
          isCorrect: option.isCorrect,
        })),
      });
    }

    questionsBySubjectGrade.set(subjectGrade.id, questions);
  }

  let totalAssignments = 0;
  let totalSubmissions = 0;
  let totalExams = 0;
  let totalAttempts = 0;
  let totalAnswers = 0;

  for (const classRecord of classes) {
    const course = courses.find((item) => item.id === classRecord.courseId);

    if (!course) {
      continue;
    }

    const questions = questionsBySubjectGrade.get(course.subjectGradeId) ?? [];

    // Hai bài tập cho mỗi lớp.
    const assignments = [];

    for (let index = 0; index < 2; index++) {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 7 + index * 7);

      const assignment = await prisma.assignment.create({
        data: {
          classId: classRecord.id,
          title: index === 0 ? "Bài tập củng cố kiến thức" : "Bài tập vận dụng",
          description:
            index === 0
              ? "Hoàn thành các câu hỏi nhằm củng cố kiến thức đã học."
              : "Vận dụng kiến thức đã học để giải quyết các bài tập thực tế.",
          dueAt,
          maxScore: 10,
          status: "PUBLISHED",
          createdBy: classRecord.teacherId,
        },
      });

      assignments.push(assignment);
      totalAssignments++;
    }

    // Tạo bài nộp cho 8 học sinh đầu tiên trong lớp.
    for (const assignment of assignments) {
      for (const [studentIndex, student] of classRecord.students
        .slice(0, 8)
        .entries()) {
        const graded = studentIndex % 2 === 0;
        const submittedAt = faker.date.recent({ days: 5 });

        await prisma.assignmentSubmission.create({
          data: {
            assignmentId: assignment.id,
            studentId: student.id,
            content: faker.lorem.paragraphs({ min: 1, max: 2 }),
            submittedAt,
            status: graded ? "GRADED" : "SUBMITTED",
            score: graded
              ? faker.number.float({
                  min: 6,
                  max: 10,
                  fractionDigits: 1,
                })
              : null,
            feedback: graded ? "Bài làm tốt, cần tiếp tục phát huy." : null,
            gradedBy: graded ? classRecord.teacherId : null,
            gradedAt: graded ? new Date() : null,
          },
        });

        totalSubmissions++;
      }
    }

    // Tạo đề kiểm tra.
    const exam = await prisma.exam.create({
      data: {
        classId: classRecord.id,
        title: "Kiểm tra kiến thức tổng hợp",
        description: "Bài kiểm tra trắc nghiệm kiến thức đã học.",
        durationMinutes: 45,
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        maxAttempts: 2,
        status: "PUBLISHED",
        createdBy: classRecord.teacherId,
      },
    });

    totalExams++;

    await prisma.examQuestion.createMany({
      data: questions.map((question, index) => ({
        examId: exam.id,
        questionId: question.id,
        points: 1,
        position: index + 1,
      })),
    });

    // Tạo lượt làm bài và câu trả lời cho từng học sinh.
    for (const student of classRecord.students) {
      const answerSelections = questions.map((question) => {
        const correctOption = question.options.find(
          (option) => option.isCorrect,
        );

        const incorrectOptions = question.options.filter(
          (option) => !option.isCorrect,
        );

        const shouldCorrect = faker.number.int({ min: 1, max: 100 }) <= 70;

        const selectedOption =
          shouldCorrect && correctOption
            ? correctOption
            : faker.helpers.arrayElement(incorrectOptions);

        return {
          questionId: question.id,
          optionId: selectedOption.id,
          isCorrect: selectedOption.isCorrect,
        };
      });

      const correctCount = answerSelections.filter(
        (answer) => answer.isCorrect,
      ).length;

      const submittedAt = new Date();
      submittedAt.setMinutes(submittedAt.getMinutes() - 45);

      const attempt = await prisma.examAttempt.create({
        data: {
          examId: exam.id,
          studentId: student.id,
          attemptNumber: 1,
          startedAt: submittedAt,
          submittedAt: new Date(),
          score: correctCount,
          status: "GRADED",
        },
      });

      totalAttempts++;

      for (const answer of answerSelections) {
        await prisma.examAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: answer.questionId,
            isCorrect: answer.isCorrect,
            score: answer.isCorrect ? 1 : 0,
            selectedOptions: {
              create: {
                optionId: answer.optionId,
              },
            },
          },
        });

        totalAnswers++;
      }
    }
  }

  console.log("✓ Assessment:", {
    questions: Array.from(questionsBySubjectGrade.values()).reduce(
      (total, items) => total + items.length,
      0,
    ),
    assignments: totalAssignments,
    submissions: totalSubmissions,
    exams: totalExams,
    attempts: totalAttempts,
    answers: totalAnswers,
  });
}
