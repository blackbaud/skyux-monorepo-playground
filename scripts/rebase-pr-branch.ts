import { runCommand } from './utils/spawn';

async function rebasePrBranch() {
  const baseRef = process.env.GITHUB_BASE_REF || 'main';
  // git config --global user.email "you@example.com"
  // git config --global user.name "Your Name"
  await runCommand('git', [
    'config',
    '--global',
    'user.email',
    `"${process.env.GITHUB_ACTOR}"`,
  ]);
  await runCommand('git', [
    'config',
    '--global',
    'user.name',
    `"${process.env.GITHUB_ACTOR}"`,
  ]);
  await runCommand('git', ['rebase', `origin/${baseRef}`]);
}

rebasePrBranch();
