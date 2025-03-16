import { AfterViewInit, Component, effect, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inline-text-editor',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './inline-text-editor.component.html',
  styleUrl: './inline-text-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineTextEditorComponent),
      multi: true,
    },
  ],
})
export class InlineTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {  
  @ViewChild('editor') editorElement!: ElementRef;
  
  // Inputs
  @Input() placeholder: string = 'Escribe algo...';
  @Input() set required(value: boolean) {
    this._required = value;
    this.updateValidators();
  }
  @Input() set disabled(value: boolean) {
    this.editable.set(!value);
    this.setDisabledState(value);
  }
  
  // Outputs
  @Output() contentChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() enterPressed = new EventEmitter<KeyboardEvent>();
  @Output() validationChange = new EventEmitter<boolean>();
  
  // Signals y propiedades
  contentSignal = signal('');
  focused = signal(false);
  editable = signal(true);
  touched = signal(false);
  isInvalid = signal(false);
  
  // FormControl para la validación
  private control = new FormControl('');
  private _required = false;
  private subscription: Subscription = new Subscription();
  
  // Callbacks para ControlValueAccessor
  private onChange: any = () => {};
  private onTouched: any = () => {};
  
  constructor() {
    effect(() => {
      if (this.editorElement?.nativeElement) {
        const content = this.contentSignal();
        if (this.editorElement.nativeElement.textContent !== content) {
          this.editorElement.nativeElement.textContent = content;
        }
      }
    });
  }
  
  ngAfterViewInit() {
    this.updateValidators();
    

    this.subscription = this.control.statusChanges.subscribe(() => {
      this.isInvalid.set(this.control.invalid && (this.control.touched || this.touched()));
      this.validationChange.emit(!this.control.invalid);
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  // Implementación de ControlValueAccessor
  writeValue(value: string): void {
    this.contentSignal.set(value || '');
    this.control.setValue(value || '', { emitEvent: false });
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.editable.set(!isDisabled);
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
  
  // Métodos para manejo de eventos
  onInput(event: Event) {
    const value = (event.target as HTMLElement).textContent || '';
    this.contentSignal.set(value);
    this.control.setValue(value);
    this.onChange(value);
    this.contentChange.emit(value);
    this.validateContent();
  }
  
  onFocus() {
    this.focused.set(true);
    this.focus.emit();
  }
  
  onBlur() {
    this.focused.set(false);
    this.touched.set(true);
    this.onTouched();
    this.control.markAsTouched();
    this.validateContent();
    this.blur.emit();
  }
  
  onEnterKey(event: Event) {
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault();
        this.enterPressed.emit(event);
      }
    }
  }
  
  // Métodos públicos
  setFocus() {
    this.editorElement?.nativeElement?.focus();
  }
  
  getContent(): string {
    return this.contentSignal();
  }
  
  isValid(): boolean {
    return !this.control.invalid;
  }
  
  markAsTouched() {
    this.touched.set(true);
    this.control.markAsTouched();
    this.validateContent();
  }
  
  // Métodos privados
  private updateValidators() {
    if (this._required) {
      this.control.setValidators([Validators.required]);
    } else {
      this.control.clearValidators();
    }
    this.control.updateValueAndValidity();
  }
  
  private validateContent() {
    this.control.setValue(this.contentSignal());
    this.isInvalid.set(this.control.invalid && (this.control.touched || this.touched()));
    this.validationChange.emit(!this.control.invalid);
  }
}
