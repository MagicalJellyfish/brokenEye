import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

export class Debouncer<T> {
  constructor(debounceMs: number = 2000) {
    this.InputSubject.subscribe(() => {
      this.Debouncing = true;
    });

    this.InputSubject.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged()
    ).subscribe((x) => {
      this.SaveSubject.next(x);
    });

    this.SaveSubject.subscribe((_) => (this.Debouncing = false));
  }

  public Debouncing: boolean = false;
  public InputSubject = new Subject<T>();
  public SaveSubject = new Subject<T>();
}
