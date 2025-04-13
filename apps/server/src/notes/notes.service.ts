import { Injectable, UseGuards } from '@nestjs/common';
import { JwtOAuthGuard } from 'src/auth/jwt/jwt.oauth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtOAuthGuard)
  getNotes() {
    return this.prisma.note.findMany();
  }

  @UseGuards(JwtOAuthGuard)
  addNote(note) {
    const newNote = this.prisma.note.create({
      data: note,
    });
    return newNote;
  }
}
