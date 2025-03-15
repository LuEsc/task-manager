import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TaskItem } from '../../../../shared/types/task-item';
import { Calendar, CircleDot, LucideAngularModule, Share2, Tag, Trash2 } from 'lucide-angular';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-task-item',
  imports: [CardModule, ButtonModule, LucideAngularModule, TagModule, AvatarModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  readonly circleDotIcon = CircleDot;
  readonly calendarIcon = Calendar;
  readonly trash2Icon = Trash2;
  readonly sharedIcon = Share2;
  readonly tagIcon = Tag;
  task = input<TaskItem>();
}
