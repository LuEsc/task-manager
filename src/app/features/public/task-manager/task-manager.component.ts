import { Component, effect, signal } from '@angular/core';
import { BookCheck, LucideAngularModule } from 'lucide-angular';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TaskItem } from '../../../shared/types/task-item';
import { TaskItemComponent } from './task-item/task-item.component';
import { ButtonModule } from 'primeng/button';
import { TaskCreatorComponent } from './task-creator/task-creator.component';
import { Task } from './service/task';
import { DividerModule } from 'primeng/divider';
import { TaskEditorComponent } from "./task-editor/task-editor.component";


@Component({
  selector: 'app-task-manager',
  imports: [SelectButtonModule, LucideAngularModule, TaskItemComponent, ButtonModule, TaskCreatorComponent, DividerModule, TaskEditorComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {
  readonly bookCheck = BookCheck;
  creatingTask = signal<boolean>(false);
  tasks = signal<TaskItem[]>([]);
  completedTasks = signal<TaskItem[]>([]);
  pinnedTasks = signal<TaskItem[]>([]);
  selectedTaskId = '';
  editorOpen = false;


  constructor(private taskService: Task) {
    effect(() => {
      this.tasks.set(this.taskService.allTasks());
      this.completedTasks.set(this.taskService.completedTasks());
      this.pinnedTasks.set(this.taskService.pinnedTasks());
    });
  }

  showTaskCreator() {
    this.creatingTask.set(true);
  }

  onCancelCreation() {
    this.creatingTask.set(false);
  }

  onTaskCreate(newTask: TaskItem) {
    this.taskService.addTask(newTask);
    this.creatingTask.set(false);
  }

  onTaskDelete(id: string) {
    this.taskService.deleteTask(id);
  }

  onTaskPinned(id: string) {
    this.taskService.toggleTaskPin(id);
  }
  
  onTaskComplete(id: string) {
    this.taskService.toggleTaskCompletion(id);
  }

  toggleEditor(id: string) {
    this.editorOpen = !this.editorOpen;
    this.selectedTaskId = id;
  }

}
