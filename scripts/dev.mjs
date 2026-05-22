import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import localtunnel from 'localtunnel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

const BACKEND_PORT = Number(process.env.BACKEND_PORT || 3000);
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT || 5173);
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(prefix, color, line) {
  process.stdout.write(`${color}[${prefix}]${c.reset} ${line}\n`);
}

function logErr(prefix, color, line) {
  process.stderr.write(`${color}[${prefix}]${c.reset} ${line}\n`);
}

const tunnels = [];
const children = [];

async function openTunnel(port, label, color) {
  log(label, color, `Открываю localtunnel для localhost:${port}…`);
  const tunnel = await localtunnel({ port });
  tunnels.push(tunnel);

  tunnel.on('close', () => log(label, color, 'tunnel closed'));
  tunnel.on('error', err => logErr(label, color, `tunnel error: ${err.message}`));

  log(label, color, `URL: ${tunnel.url}`);
  return tunnel.url;
}

function spawnVite(apiBase, frontendUrl) {
  const localVite = path.join(projectRoot, 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');

  const env = {
    ...process.env,
    VITE_API_BASE: apiBase,
    VITE_PUBLIC_URL: frontendUrl,
  };

  const child = spawn(localVite, [], {
    cwd: projectRoot,
    env,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWin,
    windowsHide: true,
  });
  children.push(child);

  child.stdout.on('data', chunk => {
    chunk
      .toString()
      .split(/\r?\n/)
      .forEach(line => {
        if (line.trim()) log('vite', c.green, line);
      });
  });
  child.stderr.on('data', chunk => {
    chunk
      .toString()
      .split(/\r?\n/)
      .forEach(line => {
        if (line.trim()) logErr('vite', c.green, line);
      });
  });

  return child;
}

function printBanner(frontendUrl, apiBase) {
  const line = '═'.repeat(70);
  const out = [
    '',
    `${c.magenta}${line}${c.reset}`,
    `${c.bold}${c.magenta}  VK Mini App готов к запуску${c.reset}`,
    `${c.magenta}${line}${c.reset}`,
    '',
    `  ${c.bold}URL для VK админки${c.reset} (раздел «Размещение»):`,
    `    ${c.cyan}${c.bold}${frontendUrl}${c.reset}`,
    '',
    `  ${c.dim}API base (инжектится в Vite автоматически):${c.reset}`,
    `    ${c.dim}${apiBase}${c.reset}`,
    '',
    `  ${c.yellow}Дальше:${c.reset}`,
    `    1. Открой админку VK Mini App → «Размещение»`,
    `    2. В полях URL (Web/iframe) → «Режим разработки» вставь URL фронта`,
    `    3. Сохрани, переключи «Состояние для пользователей» → Включено`,
    `    4. Открой https://vk.com/app<APP_ID> — мини-апп должен загрузиться`,
    '',
    `  ${c.yellow}Первый раз?${c.reset} localtunnel может показать заглушку`,
    `  с просьбой «нажать Continue» — это разовая защита от спама.`,
    `  Кликаешь, дальше будет работать как обычно.`,
    '',
    `${c.magenta}${line}${c.reset}`,
    '',
  ];
  process.stdout.write(out.join('\n'));
}

async function cleanup(code = 0) {
  log('dev', c.yellow, 'Гашу процессы…');
  for (const tunnel of tunnels) {
    try {
      tunnel.close();
    } catch {}
  }
  for (const child of children) {
    if (child.exitCode === null) {
      try {
        if (isWin) {
          spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { stdio: 'ignore' });
        } else {
          child.kill('SIGINT');
        }
      } catch {}
    }
  }
  setTimeout(() => process.exit(code), 800);
}

process.on('SIGINT', () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));

async function main() {
  const explicitApiBase = process.env.VITE_API_BASE?.trim();

  let apiBase;
  if (explicitApiBase) {
    apiBase = explicitApiBase;
    log(
      'dev',
      c.yellow,
      `VITE_API_BASE задан вручную: ${apiBase} → tunnel под backend не поднимаю.`,
    );
  } else {
    let apiUrl;
    try {
      apiUrl = await openTunnel(BACKEND_PORT, 'tunnel:api', c.blue);
    } catch (err) {
      logErr('dev', c.red, `Не получилось поднять tunnel для бэка: ${err.message}`);
      logErr('dev', c.red, `Проверь что Rails запущен на порту ${BACKEND_PORT} (bin/rails s).`);
      await cleanup(1);
      return;
    }
    apiBase = `${apiUrl}${API_PREFIX}`;
  }

  let frontendUrl;
  try {
    frontendUrl = await openTunnel(FRONTEND_PORT, 'tunnel:web', c.magenta);
  } catch (err) {
    logErr('dev', c.red, `Не получилось поднять tunnel для фронта: ${err.message}`);
    await cleanup(1);
    return;
  }

  log('dev', c.green, `Запускаю Vite с VITE_API_BASE=${apiBase}`);
  spawnVite(apiBase, frontendUrl);

  setTimeout(() => printBanner(frontendUrl, apiBase), 1500);
}

main().catch(err => {
  logErr('dev', c.red, err?.stack || String(err));
  cleanup(1);
});
