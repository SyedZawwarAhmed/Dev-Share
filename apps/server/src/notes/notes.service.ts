import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async getNotes(
    userId: string,
    body: { search?: string; orderBy?: 'asc' | 'desc' },
  ) {
    return (
      await this.prisma.note.findMany({
        where: {
          userId,
          isDeleted: false,
          OR: [
            {
              content: {
                contains: body?.search ?? '',
              },
            },
            {
              title: {
                contains: body?.search ?? '',
              },
            },
          ],
        },
        orderBy: {
          updatedAt: body.orderBy ?? 'desc',
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      })
    ).map((note) => ({ ...note, postCount: note._count.posts }));
  }

  addNote(userId: string, note) {
    const newNote = this.prisma.note.create({
      data: {
        ...note,
        userId: userId,
      },
    });
    return newNote;
  }

  getNoteById(userId: string, noteId: string) {
    return this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false,
      },
    });
  }

  updateNote(userId: string, noteId: string, note) {
    return this.prisma.note.update({
      where: {
        id: noteId,
        userId,
      },
      data: note,
    });
  }

  deleteNote(userId: string, noteId: string) {
    return this.prisma.note.update({
      where: {
        id: noteId,
        userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
