export const createLogger = context => {
  const next = level => (...args) =>
    console[level](...[...[context + "::"], ...args]);
  const getNextOrNoop = level => next(level);

  const loggerInstance = {
    debug: getNextOrNoop("log"),
    error: getNextOrNoop("error"),
    info: getNextOrNoop("info"),
    log: getNextOrNoop("log"),
    warn: getNextOrNoop("warn"),
    verbose: getNextOrNoop("info")
  };

  return loggerInstance;
};
