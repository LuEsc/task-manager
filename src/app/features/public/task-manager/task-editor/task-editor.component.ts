import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Pin, PinOff, Save, X } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { InplaceModule } from 'primeng/inplace';
import { SelectModule } from 'primeng/select';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { InlineTextEditorComponent } from '../../../../shared/components/inline-text-editor/inline-text-editor.component';
import { TaskItem } from '../../../../shared/types/task-item';
import { Task } from '../service/task';


interface StatusOption {
  label: string;
  value: string;
}

interface UserOption {
  name: string;
  id: string;
}

@Component({
  selector: 'app-task-editor',
  imports: [CommonModule, DrawerModule, ReactiveFormsModule, InlineTextEditorComponent, SelectModule, ButtonModule, LucideAngularModule, InplaceModule, DatePipe, DatePickerModule],
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.scss'
})
export class TaskEditorComponent implements OnChanges, OnDestroy{
  @ViewChild('drawerRef') drawerRef!: Drawer;
  
  private readonly destroy$ = new Subject<void>();
  
  // Icons
  readonly iconClose = X;
  readonly iconSave = Save;
  readonly iconPin = Pin;
  readonly iconPinFilled = PinOff;
  
  // Services
  private taskService = inject(Task);
  
  // Input properties
  @Input() open = false;
  @Input() taskId = '';
  @Output() closeDrawer = new EventEmitter<MouseEvent>();
  
  // Options for select dropdowns
  readonly statusOptions: StatusOption[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
  ];
  
  readonly userOptions: UserOption[] = [
    { name: 'John Doe', id: '1' },
    { name: 'Jane Smith', id: '2' },
    { name: 'Robert Johnson', id: '3' }
  ];

  // Form
  taskEditorForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl('pending'),
    assignedTo: new FormControl(''),
    createdAt: new FormControl<Date | string>(''),
    pinned: new FormControl<boolean>(false),
  });

  ngOnChanges( changes: SimpleChanges): void {
    if(changes['taskId'] && changes['taskId'].currentValue) {
      this.taskId = changes['taskId'].currentValue;
      console.log(this.taskId);
      this.initializeTask(this.taskId);
    }
  }

  /**
   * Initializes task data from service and populates form
   */
  public initializeTask(taskId: string): void {
    if (taskId) {
      const task = this.taskService.getTaskById(this.taskId);
      this.populateForm(task);
    }
  }

  /**
   * Populates form with task data
   */
  private populateForm(task: TaskItem | undefined): void {
    if (task) {
      this.taskEditorForm.patchValue({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo,
        createdAt: task.createdAt,
        pinned: task.pinned
      });

      this.taskEditorForm.valueChanges.pipe(
        debounceTime(900),
        tap(() => this.saveTask()),
        takeUntil(this.destroy$)
      ).subscribe()
    }
  }

  /**
   * Closes the drawer
   */
  closeCallback(e: Event): void {
    this.drawerRef.close(e);
    this.closeDrawer.emit();
  }

  /**
   * Toggles the pinned state of the task
   */
  togglePin(): void {
    const currentValue = this.taskEditorForm.controls.pinned.value;
    this.taskEditorForm.controls.pinned.setValue(!currentValue);
  }

  /**
   * Saves the task
   */
  saveTask(): void {
    if (this.taskEditorForm.valid) {
      const formData = this.taskEditorForm.value as Partial<TaskItem>;
      this.taskService.editTask(this.taskId, formData as TaskItem);
    }
  }

  onStatusChange(value: string) {
    this.taskEditorForm.controls.status.setValue(value);
  }


  /**
   * Gets the label for the status value
   */
  getStatusLabel(value: string | null): string {
    if (!value) return 'Pending';
    const option = this.statusOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  allTasks(): TaskItem[] {
    return this.taskService.allTasks();
  }

  /**
   * Gets the name of the assigned user
   */
  getAssignedUserName(userId: string | null): string | null {
    if (!userId) return null;
    const user = this.userOptions.find(u => u.id === userId);
    return user ? user.name : null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
