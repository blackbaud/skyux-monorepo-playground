import { runCommand } from './utils/spawn';

async function rebasePrBranch() {
  const baseRef = process.env.GITHUB_BASE_REF || 'main';
  await runCommand('git', ['branch', '--show-current']);
  await runCommand('git', [
    'rebase',
    `origin/${baseRef}`,
    '--allow-empty-message',
  ]);
}

rebasePrBranch();
