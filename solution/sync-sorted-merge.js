'use strict';

const PriorityQueue = require('./priority-queue');

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const priorityQueue = new PriorityQueue();

  // Initialize the priority queue with the first LogEntry from each LogSource
  logSources.forEach((logSource, index) => {
    const logEntry = logSource.pop();
    if (logEntry !== false) {
      priorityQueue.enqueue({ logEntry, sourceIndex: index });
    }
  });

  // Continue processing until all LogEntries are merged
  while (!priorityQueue.isEmpty()) {
    const { logEntry, sourceIndex } = priorityQueue.dequeue();

    // Print the merged LogEntry
    printer.print(logEntry);

    // Get the next LogEntry from the same LogSource
    const nextLogEntry = logSources[sourceIndex].pop();

    // Enqueue the next LogEntry if it exists
    if (nextLogEntry !== false) {
      priorityQueue.enqueue({ logEntry: nextLogEntry, sourceIndex });
    }
  }

  printer.done();
  return console.log('Sync sort complete.');
};
