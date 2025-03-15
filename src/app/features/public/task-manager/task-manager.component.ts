import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TaskItem } from '../../../shared/types/task-item';
import { TaskItemComponent } from './task-item/task-item.component';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-task-manager',
  imports: [SelectButtonModule, LucideAngularModule, TaskItemComponent, ButtonModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {
  tasks: TaskItem[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      isCompleted: false
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      isCompleted: true
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      isCompleted: false
    },
    {
      id: 4,
      title: 'Task 4',
      description: 'Description 4',
      isCompleted: true
    },
    {
      id: 5,
      title: 'Task 5',
      description: 'Description 5',
      isCompleted: false
    }
  ]

  createTask() {
    console.log('Create task');
  }
}
