const execSync = require('child_process').execSync;

try {
  const target = process.argv[2];
  const jobIndex = Number(process.argv[3]);
  const jobCount = Number(process.argv[4]);
  // const isMain = process.argv[5] === 'refs/heads/main';
  // const baseSha = isMain ? 'origin/main~1' : 'origin/main';
  const npmVersion = execSync('npm -v').toString();
  console.log('NPM version:', npmVersion);

  const affected = execSync(`npx nx print-affected`).toString('utf-8');

  const array = JSON.parse(affected)
    .tasks.map((t) => t.target.project)
    .slice()
    .sort();

  console.log('Affected?', affected);

  const sliceSize = Math.max(Math.floor(array.length / jobCount), 1);

  const projects =
    jobIndex < jobCount
      ? array.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
      : array.slice(sliceSize * (jobIndex - 1));

  if (projects.length > 0) {
    execSync(
      `npx nx run-many --target=${target} --projects=${projects.join(
        ','
      )} --parallel ${restArgs()}`,
      {
        stdio: [0, 1, 2],
      }
    );
  }
} catch (err) {
  console.error('[run-many error]: ', err);
}

function restArgs() {
  return process.argv
    .slice(6)
    .map((a) => `"${a}"`)
    .join(' ');
}
