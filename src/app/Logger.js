export const LoggerSetting  ={ logLevel: 'log'};
const LoggerLevels = {
  log: 4,
  info: 3,
  debug: 2,
  warn: 1,
  error: 0
};

export const shouldLogAtLevel = (level) => {
  return LoggerLevels[LoggerSetting.logLevel] >= LoggerLevels[level];
};

const noop = () => undefined;
export const createLogger = context => {
  const next = level => (...args) =>
      console[level](...[...[context + "::"], ...args]);
  const getNextOrNoop = level => shouldLogAtLevel(level)? next(level) : noop;

  const loggerInstance = {
    debug: getNextOrNoop("log"),
    error: getNextOrNoop("error"),
    info: getNextOrNoop("info"),
    log: getNextOrNoop("log"),
    verbose: getNextOrNoop("log"),
    warn: getNextOrNoop("warn"),
  };
  return loggerInstance;
};
