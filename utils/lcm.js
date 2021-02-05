const getPrimeFactors = (number) => {
  if (number < 2) {
    return {};
  }

  const primes = getPrimesLessThan(number);
  const result = {};
  let divisionResult = number;

  for (const prime of primes) {
    if (divisionResult === 1) {
      break;
    }

    while (divisionResult % prime === 0) {
      divisionResult /= prime;

      result[prime] = result[prime] || 0;
      result[prime] += 1;
    }
  }

  return result;
};

const getPrimesLessThan = (number) => {
  if (number < 2) {
    return [];
  }

  const primeCandidates = [];

  for (let i = 2; i <= number; i += 1) {
    if (i === 2 || i % 2 !== 0) {
      primeCandidates.push(i);
    }
  }

  return removeNonPrimes(primeCandidates);
};

// Sleeve of Erathostenes
const removeNonPrimes = (numbers, result = []) => {
  if (numbers.length === 0) {
    return result;
  }

  const [prime] = numbers;
  const remaining = numbers.slice(1).filter((number) => number % prime !== 0);

  return removeNonPrimes(remaining, [...result, prime]);
};

const getLCM = (numbers) => {
  const resultFactors = {};
  let result = 1;

  for (const number of numbers) {
    const primeFactors = getPrimeFactors(number);

    for (const prime in primeFactors) {
      const count = primeFactors[prime];
      const resultCount = resultFactors[prime];

      if (resultCount === undefined || count > resultCount) {
        resultFactors[prime] = count;
      }
    }
  }

  for (const prime in resultFactors) {
    const power = resultFactors[prime];

    result *= Math.pow(parseInt(prime, 10), power);
  }

  return result;
};

module.exports = {
  getLCM,
  getPrimeFactors,
  getPrimesLessThan,
  removeNonPrimes
};
