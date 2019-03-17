export const createLogger = (context: string): ILogger => {
  const next = (level: string) => (...args: any[]) =>
      console[level](...[...[context + '::'], ...args]);
  const getNextOrNoop = (level: string) => next(level);

  const loggerInstance = {
    debug: getNextOrNoop('log'),
    error: getNextOrNoop('error'),
    info: getNextOrNoop('info'),
    log: getNextOrNoop('log'),
    warn: getNextOrNoop('warn'),
    verbose: getNextOrNoop('info'),
  };

  return loggerInstance;
};