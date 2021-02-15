const [, , scriptArg, ...options] = process.argv;

const run = async () => {
  const [day, part] = scriptArg.split('-');
  const { main } = require(`./day${day}/day${day}-part-${part}`);

  console.log(`Running Day ${day} - Part ${part}\n`);
  console.time('Runtime');

  const result = await main(`day${day}/input`, options);

  console.log(`Result: ${result}`);
  console.timeEnd('Runtime');
};

run();
