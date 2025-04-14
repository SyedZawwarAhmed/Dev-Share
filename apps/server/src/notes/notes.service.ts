import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async getNotes(userId: string) {
    return this.prisma.note.findMany({
      where: {
        userId,
      },
    });
  }

  addNote(note) {
    const newNote = this.prisma.note.create({
      data: note,
    });
    return newNote;
  }
}
