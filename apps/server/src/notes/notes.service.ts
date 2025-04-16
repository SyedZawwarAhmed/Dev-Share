import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async getNotes(userId: string) {
    return this.prisma.note.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    });
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
