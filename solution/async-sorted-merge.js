'use strict';

const PriorityQueue = require('./priority-queue');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    const priorityQueue = new PriorityQueue();

    // Helper function to process the next LogEntry from a LogSource
    const processNextEntry = async (logSource, sourceIndex) => {
      const logEntry = await logSource.popAsync();
      if (logEntry !== false) {
        priorityQueue.enqueue({ logEntry, sourceIndex });
      }
    };

    // Initialize the priority queue with the first LogEntry from each LogSource
    await Promise.all(
      logSources.map(async (logSource, index) => {
        await processNextEntry(logSource, index);
      })
    );

    // Continue processing until all LogEntries are merged
    while (!priorityQueue.isEmpty()) {
      const { logEntry, sourceIndex } = priorityQueue.dequeue();

      // Print the merged LogEntry
      printer.print(logEntry);

      // Process the next LogEntry from the same LogSource
      await processNextEntry(logSources[sourceIndex], sourceIndex);
    }

    printer.done();
    resolve(console.log('Async sort complete.'));
  });
};
