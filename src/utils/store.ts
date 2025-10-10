export class Store<T> {
  private data: T;
  private subscribers: ((items: T) => void)[] = [];

  constructor(data: T) {
    this.data = data;
  }

  subscribe(callback: (items: T) => void): () => void {
    this.subscribers.push(callback);
    callback(this.data);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach((callback) => callback(this.data));
  }

  getData(): T {
    return this.data;
  }

  setData(items: T): void {
    this.data = items;
    this.notify();
  }
}
