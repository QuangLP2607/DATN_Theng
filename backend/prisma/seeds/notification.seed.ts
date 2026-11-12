import { faker } from "@faker-js/faker/locale/vi";

import { prisma } from "../../src/config/prisma";

const NOTIFICATION_FIXTURES = [
  {
    title: "Bài học mới đã được cập nhật",
    body: "Một số nội dung học tập mới đã được thêm vào khóa học của bạn.",
    type: "LESSON" as const,
  },
  {
    title: "Nhắc nhở hoàn thành bài tập",
    body: "Bạn hãy kiểm tra danh sách bài tập và hoàn thành trước hạn nộp.",
    type: "DEADLINE" as const,
  },
  {
    title: "Thông báo kiểm tra",
    body: "Lớp học của bạn có bài kiểm tra mới. Hãy chuẩn bị trước khi làm bài.",
    type: "EXAM" as const,
  },
];

export async function seedNotifications() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  const notifications = users.flatMap((user) =>
    NOTIFICATION_FIXTURES.map((fixture, index) => ({
      userId: user.id,
      title: fixture.title,
      body: fixture.body,
      type: fixture.type,
      readAt: index === 0 ? faker.date.recent({ days: 5 }) : null,
      createdAt: faker.date.recent({ days: 14 }),
    })),
  );

  await prisma.notification.createMany({
    data: notifications,
  });

  console.log("✓ Notifications:", notifications.length);
}
