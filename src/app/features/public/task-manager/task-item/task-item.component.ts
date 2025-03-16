import { Component, input, output } from '@angular/core';
import { BookCheck, Calendar, CircleCheckBig, CircleDot, LucideAngularModule, Pin, PinOff, Share2, Tag, Trash2 } from 'lucide-angular';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TaskItem } from '../../../../shared/types/task-item';
import { TooltipModule } from 'primeng/tooltip';
import { TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-task-item',
  imports: [CardModule, ButtonModule, LucideAngularModule, TagModule, AvatarModule, TooltipModule, TitleCasePipe],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  readonly circleDotIcon = CircleDot;
  readonly calendarIcon = Calendar;
  readonly trash2Icon = Trash2;
  readonly sharedIcon = Share2;
  readonly tagIcon = Tag;
  readonly pinnedIcon = Pin;
  readonly pinnedOffIcon = PinOff
  readonly bookCheckIcon = BookCheck;
  readonly circleCheckIcon = CircleCheckBig;
  task = input<TaskItem>();
  onDeleteTask = output<string>();
  onPinnedTask = output<string>();
  onCompletedTask = output<string>();
  onEditTask = output<string>();

  onPin(event: MouseEvent, taskId: string | undefined) {
    event.stopPropagation();
    this.onPinnedTask.emit(taskId ?? '');
  }

  onDelete(event: MouseEvent, taskId: string | undefined) {
    event.stopPropagation();
    this.onDeleteTask.emit(taskId ?? '');
  }

  onComplete(event: MouseEvent, taskId: string | undefined) {
    event.stopPropagation();
    this.onCompletedTask.emit(taskId ?? '');
  }

  onEdit(taskId: string | undefined) {
    this.onEditTask.emit(taskId ?? '');
  }
}
