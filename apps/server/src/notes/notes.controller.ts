import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
  addNote(@Body() note) {
    return this.notesService.addNote(note);
  }
}
