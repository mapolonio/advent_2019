const countValidPassword = (min, max) => {
  let count = 0;

  for (let i = min; i <= max; i += 1) {
    if (isValidPassword(i)) {
      count += 1;
    }
  }

  return count;
};

const isValidPassword = (password) => {
  const passwordText = `${password}`;

  return hasRepeatedDigits(passwordText) && hasIncreasingDigits(passwordText);
};

const hasRepeatedDigits = (password) => {
  let correctRepetition = false;

  for (let i = 0; i <= 9; i += 1) {
    correctRepetition =
      correctRepetition || containsSingleRepetition(password, i);

    if (correctRepetition) {
      break;
    }
  }

  return correctRepetition;
};

const containsSingleRepetition = (password, digit) => {
  const singleRepetitionPattern = new RegExp(`${digit}{2}`);
  const multipleRepetitionPattern = new RegExp(`${digit}{3,}`);

  return (
    singleRepetitionPattern.test(password) &&
    !multipleRepetitionPattern.test(password)
  );
};

const hasIncreasingDigits = (password) => {
  let prev;

  for (const digit of password) {
    const value = parseInt(digit, 10);

    if (prev && value < prev) {
      return false;
    }

    prev = value;
  }

  return true;
};

const main = async (range = [193651, 649729]) => {
  const [min, max] = range;
  const validPasswordQty = countValidPassword(min, max);

  return validPasswordQty;
};

module.exports = { isValidPassword, main };
