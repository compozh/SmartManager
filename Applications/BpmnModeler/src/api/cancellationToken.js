export class CancellationToken {
  constructor(debounced) {
    this.cancelled = false;
    this.debounced = debounced;
  }

  get isCancelled() {
    return this.cancelled;
  }

  cancel() {
    this.cancelled = true;
    if (this.debounced && this.debounced.cancel) {
      this.debounced.cancel();
    }
  }
} 