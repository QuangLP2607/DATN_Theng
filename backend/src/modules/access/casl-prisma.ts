import type { Ability, ForcedSubject, TaggedSubject } from "@casl/ability";

import {
  accessibleBy,
  createPrismaAbility,
  ParsingQueryError,
  prismaQuery,
  type PrismaQueryOf,
  type WhereInputOf,
} from "@casl/prisma/runtime";

import type {
  Prisma,
  User,
  Subject,
  Class,
  ClassTeacher,
  Enrollment,
  Chapter,
  Lesson,
  LessonAttachment,
  LessonProgress,
  Assignment,
  AssignmentSubmission,
  Exam,
  ExamAttempt,
  Question,
  QuestionOption,
  ExamQuestion,
  ExamAnswer,
  ExamAnswerOption,
} from "../../generated/prisma/client";

export { accessibleBy, createPrismaAbility, ParsingQueryError, prismaQuery };

/**
 * Prisma query type used by CASL.
 *
 * ForcedSubject<any> allows CASL to infer individual model names
 * when using accessibleBy().ofType().
 */
export type PrismaQuery<T extends ForcedSubject<any> = ForcedSubject<any>> =
  PrismaQueryOf<Prisma.TypeMap, T>;

/**
 * Prisma WhereInput for a specific model.
 */
export type WhereInput<TModelName extends Prisma.ModelName> = WhereInputOf<
  Prisma.TypeMap,
  TModelName
>;

/**
 * All Prisma models supported by the authorization system.
 */
export type AppSubjects =
  | (User & ForcedSubject<"User">)
  | (Subject & ForcedSubject<"Subject">)
  | (Class & ForcedSubject<"Class">)
  | (ClassTeacher & ForcedSubject<"ClassTeacher">)
  | (Enrollment & ForcedSubject<"Enrollment">)
  | (Chapter & ForcedSubject<"Chapter">)
  | (Lesson & ForcedSubject<"Lesson">)
  | (LessonAttachment & ForcedSubject<"LessonAttachment">)
  | (LessonProgress & ForcedSubject<"LessonProgress">)
  | (Assignment & ForcedSubject<"Assignment">)
  | (AssignmentSubmission & ForcedSubject<"AssignmentSubmission">)
  | (Exam & ForcedSubject<"Exam">)
  | (ExamAttempt & ForcedSubject<"ExamAttempt">)
  | (Question & ForcedSubject<"Question">)
  | (QuestionOption & ForcedSubject<"QuestionOption">)
  | (ExamQuestion & ForcedSubject<"ExamQuestion">)
  | (ExamAnswer & ForcedSubject<"ExamAnswer">)
  | (ExamAnswerOption & ForcedSubject<"ExamAnswerOption">);

/**
 * Application authorization ability.
 */
export type AppAbility = Ability<
  ["create" | "read" | "update" | "delete", "all" | AppSubjects],
  PrismaQuery,
  TaggedSubject
>;
