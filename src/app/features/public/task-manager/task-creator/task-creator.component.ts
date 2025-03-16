import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Check, LucideAngularModule, X } from 'lucide-angular';
import { AvatarModule } from 'primeng/avatar';
import { InlineTextEditorComponent } from '../../../../shared/components/inline-text-editor/inline-text-editor.component';
import { TaskItem } from '../../../../shared/types/task-item';

@Component({
  selector: 'app-task-creator',
  imports: [FormsModule, ReactiveFormsModule, LucideAngularModule, InlineTextEditorComponent, AvatarModule],
  templateUrl: './task-creator.component.html',
  styleUrl: './task-creator.component.scss'
})
export class TaskCreatorComponent {
   // Icons
   checkIcon = Check;
   xIcon = X;
   
   // Form
   taskForm = new FormGroup({
    title: new FormControl<string>('', { validators: [Validators.required, Validators.nullValidator] }),
    description:  new FormControl(''),
  });

   titleValid = signal(false);
   
   // Outputs
   @Output() taskCreated = new EventEmitter<TaskItem>();
   @Output() cancel = new EventEmitter<void>();
   
   
   titleValidityChanged(isValid: boolean) {
     this.titleValid.set(isValid);
   }
   
   onSubmit() {
     if (this.taskForm.valid) {
       const formValues = this.taskForm.value;
       
       const newTask: TaskItem = {
         title: formValues.title || '',
         description: formValues.description || '',
       };
       
       this.taskCreated.emit(newTask);
       
       this.taskForm.reset();
     } else {
       Object.keys(this.taskForm.controls).forEach(key => {
         const control = this.taskForm.get(key);
         control?.markAsTouched();
       });
     }
   }
   
   onCancel() {
     this.cancel.emit();
   }
}
