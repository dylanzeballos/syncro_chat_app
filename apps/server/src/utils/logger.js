const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

const getTimestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => {
    console.log(
      `${colors.blue}[INFO]${colors.reset} [${getTimestamp()}]`,
      ...args
    );
  },
  error: (...args) => {
    console.error(
      `${colors.red}[ERROR]${colors.reset} [${getTimestamp()}]`,
      ...args
    );
  },
  warn: (...args) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} [${getTimestamp()}]`,
      ...args
    );
  },
  success: (...args) => {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} [${getTimestamp()}]`,
      ...args
    );
  },
};

export default logger;
