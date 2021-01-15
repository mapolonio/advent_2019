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
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const pattern = new RegExp(digits.map((d) => `${d}{2}`).join('|'));

  return pattern.test(password);
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
