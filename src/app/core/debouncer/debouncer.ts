import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

export class Debouncer<T> {
  constructor() {
    this.InputSubject.subscribe(() => {
      this.Debouncing = true;
    });

    this.InputSubject.pipe(
      debounceTime(2000),
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
