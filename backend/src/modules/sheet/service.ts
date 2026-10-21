import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { CreateSheetDto } from "./dto/createSheet";
import type { UpdateSheetDto } from "./dto/updateSheet";

/*
 * -------------------- CREATE --------------------
 */

export const createSheet = async (userId: string, data: CreateSheetDto) => {
  /*
   * User phải có quyền EDITOR hoặc là owner
   */
  const workbook = await prisma.workbook.findFirst({
    where: {
      id: data.workbookId,

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

  /*
   * Lấy position cuối cùng
   */
  const lastSheet = await prisma.sheet.findFirst({
    where: {
      workbookId: data.workbookId,
    },

    orderBy: {
      position: "desc",
    },

    select: {
      position: true,
    },
  });

  const position = lastSheet ? lastSheet.position + 1 : 0;

  /*
   * Tạo sheet
   */
  const sheet = await prisma.sheet.create({
    data: {
      workbookId: data.workbookId,
      name: data.name,
      position,
    },
  });

  return sheet;
};

/*
 * -------------------- UPDATE --------------------
 */

export const updateSheet = async (
  userId: string,
  sheetId: string,
  data: UpdateSheetDto,
) => {
  /*
   * Tìm sheet mà user có quyền EDITOR
   */
  const sheet = await prisma.sheet.findFirst({
    where: {
      id: sheetId,

      workbook: {
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
    },
  });

  if (!sheet) {
    throw AppError.notFound("Sheet not found");
  }

  const updatedSheet = await prisma.sheet.update({
    where: {
      id: sheetId,
    },

    data: {
      name: data.name,
    },
  });

  return updatedSheet;
};

/*
 * -------------------- DELETE --------------------
 */

export const deleteSheet = async (userId: string, sheetId: string) => {
  /*
   * Tìm sheet + kiểm tra quyền EDITOR
   */
  const sheet = await prisma.sheet.findFirst({
    where: {
      id: sheetId,

      workbook: {
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
    },

    select: {
      id: true,
      workbookId: true,
      position: true,
    },
  });

  if (!sheet) {
    throw AppError.notFound("Sheet not found");
  }

  /*
   * Không cho xóa sheet cuối cùng.
   */
  const sheetCount = await prisma.sheet.count({
    where: {
      workbookId: sheet.workbookId,
    },
  });

  if (sheetCount <= 1) {
    throw AppError.badRequest("Workbook must have at least one sheet");
  }

  /*
   * Xóa sheet + cập nhật lại position
   */
  await prisma.$transaction(async (tx) => {
    await tx.sheet.delete({
      where: {
        id: sheet.id,
      },
    });

    await tx.sheet.updateMany({
      where: {
        workbookId: sheet.workbookId,
        position: {
          gt: sheet.position,
        },
      },

      data: {
        position: {
          decrement: 1,
        },
      },
    });
  });
};
