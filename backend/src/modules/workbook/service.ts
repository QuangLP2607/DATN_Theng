import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { CreateWorkbookDto } from "./dto/createWorkbook";
import type { UpdateWorkbookDto } from "./dto/updateWorkbook";

/*
 * -------------------- CREATE --------------------
 */

export const createWorkbook = async (
  userId: string,
  data: CreateWorkbookDto,
) => {
  const workbook = await prisma.workbook.create({
    data: {
      name: data.name,
      ownerId: userId,

      sheets: {
        create: {
          name: "Sheet1",
          position: 0,
        },
      },
    },

    include: {
      sheets: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return workbook;
};

/*
 * -------------------- GET ALL --------------------
 */

export const getWorkbooks = async (userId: string) => {
  const workbooks = await prisma.workbook.findMany({
    where: {
      OR: [
        {
          ownerId: userId,
        },
        {
          permissions: {
            some: {
              userId,
            },
          },
        },
      ],
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  return workbooks;
};

/*
 * -------------------- GET ONE --------------------
 */

export const getWorkbookById = async (userId: string, workbookId: string) => {
  const workbook = await prisma.workbook.findFirst({
    where: {
      id: workbookId,

      OR: [
        {
          ownerId: userId,
        },
        {
          permissions: {
            some: {
              userId,
            },
          },
        },
      ],
    },

    include: {
      sheets: {
        orderBy: {
          position: "asc",
        },

        select: {
          id: true,
          name: true,
          position: true,
        },
      },
    },
  });

  if (!workbook) {
    throw AppError.notFound("Workbook not found");
  }

  return workbook;
};

/*
 * -------------------- UPDATE --------------------
 */

export const updateWorkbook = async (
  userId: string,
  workbookId: string,
  data: UpdateWorkbookDto,
) => {
  const workbook = await prisma.workbook.findFirst({
    where: {
      id: workbookId,

      OR: [
        {
          ownerId: userId,
        },
        {
          permissions: {
            some: {
              userId,
              permission: "EDITOR",
            },
          },
        },
      ],
    },
  });

  if (!workbook) {
    throw AppError.notFound("Workbook not found");
  }

  const updatedWorkbook = await prisma.workbook.update({
    where: {
      id: workbookId,
    },

    data: {
      name: data.name,
    },
  });

  return updatedWorkbook;
};

/*
 * -------------------- DELETE --------------------
 */

export const deleteWorkbook = async (userId: string, workbookId: string) => {
  const workbook = await prisma.workbook.findFirst({
    where: {
      id: workbookId,
      ownerId: userId,
    },
  });

  if (!workbook) {
    throw AppError.notFound("Workbook not found");
  }

  await prisma.workbook.delete({
    where: {
      id: workbookId,
    },
  });
};
