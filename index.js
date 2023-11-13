'use strict';

const LogSource = require('./lib/log-source');
const Printer = require('./lib/printer');

function runSolutions(sourceCount) {
  return new Promise((resolve, reject) => {
    /**
     * Challenge Number 1!
     *
     * Assume that a LogSource only has one method: pop() which will return a LogEntry.
     *
     * A LogEntry is simply an object of the form:
     * {
     * 		date: Date,
     * 		msg: String,
     * }
     *
     * All LogEntries from a given LogSource are guaranteed to be popped in chronological order.
     * Eventually a LogSource will end and return boolean false.
     *
     * Your job is simple: print the sorted merge of all LogEntries across `n` LogSources.
     *
     * Call `printer.print(logEntry)` to print each entry of the merged output as they are ready.
     * This function will ensure that what you print is in fact in chronological order.
     * Call 'printer.done()' at the end to get a few stats on your solution!
     */
    const syncLogSources = [];
    for (let i = 0; i < sourceCount; i++) {
      syncLogSources.push(new LogSource());
    }
    try {
      require('./solution/sync-sorted-merge')(syncLogSources, new Printer());
      resolve();
    } catch (e) {
      reject(e);
    }
  }).then(() => {
    return new Promise((resolve, reject) => {
      /**
       * Challenge Number 2!
       *
       * Similar to Challenge Number 1, except now you should assume that a LogSource
       * has only one method: popAsync() which returns a promise that resolves with a LogEntry,
       * or boolean false once the LogSource has ended.
       *
       * Your job is simple: print the sorted merge of all LogEntries across `n` LogSources.
       *
       * Call `printer.print(logEntry)` to print each entry of the merged output as they are ready.
       * This function will ensure that what you print is in fact in chronological order.
       * Call 'printer.done()' at the end to get a few stats on your solution!
       */
      const asyncLogSources = [];
      for (let i = 0; i < sourceCount; i++) {
        asyncLogSources.push(new LogSource());
      }
      require('./solution/async-sorted-merge')(asyncLogSources, new Printer())
        .then(resolve)
        .catch(reject);
    });
  });
}

// Adjust this input to see how your solutions perform under various loads.
runSolutions(10);

/* NOTE:

** Based on the fact that a single log source could contain millions of entries and that, accordingly, reading the entirety of a log source into memory is not feasible, I quickly discarded the Brute Force algorithm of storing all logs in a single array and sorting them.

** I then realized that due to the fact that the logs in each LogSource are already sorted chronologically, only 1 log (the latest LogEntry) at a time from each LogSource would need to be stored and sorted. To implement this solution I created an array-based priority queue.

** I then did some googling after I began to suspect that my sorting wasn't as efficient as it could be. After reading about how using a heap to implement a priority queue offers fasted insertion and retrieval times, I modified my priority queue to be heap-based. However, if you are curious, I kept the code for the array-based version commented out at the bottom of the priority-queue.js file.

** The improvement in sync-sorted-merge's performance shown by utilizing "printer.done()" was insignficant at lower values of 'n' logSources, but they became significant (~2x faster) with 'n' values of 200+. Specifically, logs/s went up from ~27k to ~50k with an 'n' of 200.

** On the other hand, async-sorted-merge's performance was not impacted by changing from an array-based priority queue to a heap-based one. In both cases, logs/s remained around 212/s. I believe this can be expected due to the bottleneck being the randomized delay of up to 8ms on each popAsync() execution rather than the sorting.

*/
