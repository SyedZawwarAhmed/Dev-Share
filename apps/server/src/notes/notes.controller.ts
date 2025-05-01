import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtOAuthGuard } from 'src/auth/jwt/jwt.oauth.guard';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @UseGuards(JwtOAuthGuard)
  getNotes(@Req() req) {
    return this.notesService.getNotes(req.user.id);
  }

  @UseGuards(JwtOAuthGuard)
  @Post('add-note')
  addNote(@Req() req) {
    return this.notesService.addNote(req.user.id, req?.body);
  }

  @UseGuards(JwtOAuthGuard)
  @Get(':id')
  getNoteById(@Req() req) {
    return this.notesService.getNoteById(req.user.id, req?.params?.id);
  }

  @UseGuards(JwtOAuthGuard)
  @Post('update-note/:id')
  updateNote(@Req() req) {
    return this.notesService.updateNote(req.user.id, req?.body.id, req?.body);
  }

  @UseGuards(JwtOAuthGuard)
  @Delete(':id')
  deleteNote(@Req() req) {
    return this.notesService.deleteNote(req.user.id, req?.params.id);
  }
}
