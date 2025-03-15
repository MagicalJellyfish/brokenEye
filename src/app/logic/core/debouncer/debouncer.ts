import { Signal, WritableSignal, effect, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

export class Debouncer<T> {
  constructor(trigger: (value: T) => void, debounceMs: number = 2000) {
    this.inputSubject.subscribe(() => {
      this.debouncing = true;
    });

    this.inputSubject
      .pipe(debounceTime(debounceMs), distinctUntilChanged())
      .subscribe((x: T) => {
        trigger(x);
        this.debouncing = false;
      });
  }

  public debouncing: boolean = false;

  protected inputSubject = new Subject<T>();

  input(value: T) {
    this.inputSubject.next(value);
  }
}

export class ValueDebouncer<T> extends Debouncer<T> {
  constructor(
    initialValue: T,
    inputSignal: Signal<T>,
    trigger: (value: T) => void,
    debounceMs: number = 2000,
  ) {
    super(trigger, debounceMs);

    this.value = signal<T>(initialValue);

    effect(() => {
      if (!this.debouncing) {
        this.value.set(inputSignal());
      }
    });

    effect(() => {
      if (this.initialized) {
        this.inputSubject.next(this.value());
      }

      // Don't trigger on view initialization signal detection run
      this.value();
      this.initialized = true;
    });
  }

  private initialized = false;

  public value: WritableSignal<T>;
}
