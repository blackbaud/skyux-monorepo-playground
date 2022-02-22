import { runCommand } from './utils/spawn';

async function rebasePrBranch() {
  const baseRef = process.env.GITHUB_BASE_REF || 'main';
  console.log('BASE REF:', baseRef);
  await runCommand('git', ['branch']);
  await runCommand('git', ['remote']);
  // await runCommand('git', ['rebase', `origin/${baseRef}`]);
}

rebasePrBranch();
