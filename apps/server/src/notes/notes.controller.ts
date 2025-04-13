import { Body, Controller, Post } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  getNotes() {
    return this.notesService.getNotes();
  }

  @Post('add-note')
  addNote(@Body() note) {
    return this.notesService.addNote(note);
  }
}
