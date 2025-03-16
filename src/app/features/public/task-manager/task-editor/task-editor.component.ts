import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { Task } from '../service/task';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-task-editor',
  imports: [DrawerModule, ReactiveFormsModule, NgClass, SelectModule],
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.scss'
})
export class TaskEditorComponent {
  taskService = inject(Task);
  @Input() open = false;
  @Input() taskId = ' ';

  statusOptions = [
    { label: 'Not Started', value: 'not-started' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  taskEditorForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });


  togglePin() {
    this.taskService.toggleTaskPin(this.taskId);
  }
}
