'use strict';

module.exports = class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const min = this.heap[0];
    const last = this.heap.pop();

    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.heapifyDown();
    }

    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  heapifyUp() {
    let currentIndex = this.heap.length - 1;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);

      if (
        this.heap[currentIndex].logEntry.date <
        this.heap[parentIndex].logEntry.date
      ) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  heapifyDown() {
    let currentIndex = 0;

    while (true) {
      const leftChildIndex = 2 * currentIndex + 1;
      const rightChildIndex = 2 * currentIndex + 2;
      let nextIndex = currentIndex;

      if (
        leftChildIndex < this.heap.length &&
        this.heap[leftChildIndex].logEntry.date <
          this.heap[nextIndex].logEntry.date
      ) {
        nextIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].logEntry.date <
          this.heap[nextIndex].logEntry.date
      ) {
        nextIndex = rightChildIndex;
      }

      if (currentIndex !== nextIndex) {
        this.swap(currentIndex, nextIndex);
        currentIndex = nextIndex;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
};

// NOTE: Array-based PriorityQueue

// module.exports = class PriorityQueue {
//   constructor() {
//     this.items = [];
//   }

//   enqueue(item) {
//     this.items.push(item);
//     this.placeItemChronologically();
//   }

//   dequeue() {
//     if (this.isEmpty()) {
//       return null;
//     }

//     return this.items.shift();
//   }

//   isEmpty() {
//     return this.items.length === 0;
//   }

//   placeItemChronologically() {
//     let currentIndex = this.items.length - 1;
//     while (currentIndex > 0) {
//       const parentIndex = currentIndex - 1;
//       if (
//         this.items[currentIndex].logEntry.date <
//         this.items[parentIndex].logEntry.date
//       ) {
//         this.swap(currentIndex, parentIndex);
//         currentIndex = parentIndex;
//       } else {
//         break;
//       }
//     }
//   }

//   swap(i, j) {
//     const temp = this.items[i];
//     this.items[i] = this.items[j];
//     this.items[j] = temp;
//   }
// };
