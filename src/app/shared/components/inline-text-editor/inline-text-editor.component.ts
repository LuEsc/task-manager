import { AfterViewInit, Component, effect, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * InlineTextEditorComponent is a reusable Angular component that allows users to edit text inline.
 * It supports validation, placeholder text, and emits events for changes, focus, blur, and keypress.
 * It also implements the ControlValueAccessor interface to work seamlessly with Angular forms.
 */
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
  // Reference to the editor element in the template
  @ViewChild('editor') editorElement!: ElementRef<HTMLElement>;

  // Inputs
  @Input() placeholder: string = 'type something...'; // Placeholder text for the editor
  @Input() set required(value: boolean) {
    this._required = value; // Set the required flag
    this.updateValidators(); // Update validators based on the required flag
  }
  @Input() set disabled(value: boolean) {
    this.editable.set(!value); // Enable or disable the editor
    this.setDisabledState(value); // Update the disabled state of the form control
  }

  // Outputs
  @Output() contentChange = new EventEmitter<string>(); // Emits when the content changes
  @Output() focus = new EventEmitter<FocusEvent>(); // Emits when the editor is focused
  @Output() blur = new EventEmitter<FocusEvent>(); // Emits when the editor loses focus
  @Output() enterPressed = new EventEmitter<KeyboardEvent>(); // Emits when the Enter key is pressed
  @Output() validationChange = new EventEmitter<boolean>(); // Emits when the validation status changes

  // Signals
  contentSignal = signal(''); // Signal to track the content of the editor
  focused = signal(false); // Signal to track if the editor is focused
  editable = signal(true); // Signal to track if the editor is editable
  touched = signal(false); // Signal to track if the editor has been touched
  isInvalid = signal(false); // Signal to track if the editor content is invalid

  // FormControl for validation
  private control = new FormControl('', { nonNullable: true }); // FormControl for managing validation
  private _required = false; // Internal flag for required validation
  private subscription: Subscription = new Subscription(); // Subscription to manage observables

  // Callbacks for ControlValueAccessor
  private onChange: (value: string) => void = () => {}; // Callback for value changes
  private onTouched: () => void = () => {}; // Callback for touch events

  constructor() {
    // Effect to synchronize the editor content with the contentSignal
    effect(() => {
      const content = this.contentSignal();
      if (this.editorElement?.nativeElement) {
        // Update the editor's innerHTML only if it's different to avoid unnecessary updates
        if (this.editorElement.nativeElement.innerHTML !== content && 
            !(this.editorElement.nativeElement.textContent === '' && content === '')) {
          this.editorElement.nativeElement.innerHTML = content;
        }
      }
    });
  }

  /**
   * Lifecycle hook that runs after the view has been initialized.
   * Ensures the initial value is displayed and sets up validators and subscriptions.
   */
  ngAfterViewInit() {
    // Ensure the initial value is displayed in the editor
    setTimeout(() => {
      if (this.contentSignal() && this.editorElement?.nativeElement) {
        this.editorElement.nativeElement.innerHTML = this.contentSignal();
      }
    });

    this.updateValidators(); // Update validators based on the initial state

    // Subscribe to control status changes to update validation state
    this.subscription = this.control.statusChanges.subscribe(() => {
      this.isInvalid.set(this.control.invalid && (this.control.touched || this.touched()));
      this.validationChange.emit(!this.control.invalid);
    });
  }

  /**
   * Lifecycle hook that runs when the component is destroyed.
   * Unsubscribes from observables to prevent memory leaks.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ControlValueAccessor implementation
  /**
   * Writes a new value to the editor.
   * @param value - The new value to be set.
   */
  writeValue(value: string): void {
    this.contentSignal.set(value || '');
    this.control.setValue(value || '', { emitEvent: false });

    // Update the DOM directly if the component is already initialized
    if (this.editorElement?.nativeElement) {
      this.editorElement.nativeElement.innerHTML = value || '';
    }
  }

  /**
   * Registers a callback function to be called when the value changes.
   * @param fn - The callback function.
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function to be called when the editor is touched.
   * @param fn - The callback function.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the editor.
   * @param isDisabled - Whether the editor should be disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.editable.set(!isDisabled);
    isDisabled ? this.control.disable() : this.control.enable();
  }

  // Event handling methods
  /**
   * Handles input events in the editor.
   * @param event - The input event.
   */
  onInput(event: Event) {
    const value = this.sanitizeContent((event.target as HTMLElement).innerHTML || '');
    this.contentSignal.set(value);
    this.control.setValue(value);
    this.onChange(value);
    this.contentChange.emit(value);
    this.validateContent();
  }

  /**
   * Handles focus events in the editor.
   * @param event - The focus event.
   */
  onFocus(event: FocusEvent) {
    this.focused.set(true);
    this.focus.emit(event);
  }

  /**
   * Handles blur events in the editor.
   * @param event - The blur event.
   */
  onBlur(event: FocusEvent) {
    this.focused.set(false);
    this.touched.set(true);
    this.onTouched();
    this.control.markAsTouched();
    this.validateContent();
    this.blur.emit(event);
  }

  /**
   * Handles keydown events in the editor, specifically for the Enter key.
   * @param event - The keyboard event.
   */
  onEnterKey(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enterPressed.emit(event);
    }
  }

  // Public methods
  /**
   * Sets focus on the editor element.
   */
  setFocus() {
    this.editorElement?.nativeElement?.focus();
  }

  /**
   * Returns the current content of the editor.
   * @returns The current content as a string.
   */
  getContent(): string {
    return this.contentSignal();
  }

  /**
   * Checks if the editor content is valid.
   * @returns True if the content is valid, false otherwise.
   */
  isValid(): boolean {
    return !this.control.invalid;
  }

  /**
   * Marks the editor as touched and updates validation.
   */
  markAsTouched() {
    this.touched.set(true);
    this.control.markAsTouched();
    this.validateContent();
  }

  // Private methods
  /**
   * Updates the validators for the form control based on the required flag.
   */
  private updateValidators() {
    this.control.setValidators(this._required ? [Validators.required] : null);
    this.control.updateValueAndValidity();
  }

  /**
   * Validates the current content of the editor and updates the validation state.
   */
  private validateContent() {
    this.control.setValue(this.contentSignal());
    this.isInvalid.set(this.control.invalid && (this.control.touched || this.touched()));
    this.validationChange.emit(!this.control.invalid);
  }

  /**
   * Sanitizes the content by removing HTML comments.
   * @param content - The content to sanitize.
   * @returns The sanitized content.
   */
  private sanitizeContent(content: string): string {
    return content.replace(/<!--[\s\S]*?-->/g, '');
  }
}