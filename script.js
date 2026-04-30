const form = document.getElementById('complaintForm');
const output = document.getElementById('output');
const alertsBox = document.getElementById('alerts');
const statusList = document.getElementById('statusList');

const fields = {
  authorNick: document.getElementById('authorNick'), violatorNick: document.getElementById('violatorNick'), complaintType: document.getElementById('complaintType'),
  incidentDate: document.getElementById('incidentDate'), situation: document.getElementById('situation'), evidence: document.getElementById('evidence'),
  timecode: document.getElementById('timecode'), hasC060: document.getElementById('hasC060'), videoLength: document.getElementById('videoLength')
};

function buildStatus() {
  const checks = [
    [fields.authorNick.value.trim() ? 'Ваш ник указан' : 'Не указан ваш ник', !!fields.authorNick.value.trim()],
    [fields.violatorNick.value.trim() ? 'Ник нарушителя указан' : 'Не указан ник нарушителя', !!fields.violatorNick.value.trim()],
    [fields.situation.value.trim() ? 'Описание заполнено' : 'Не заполнено описание', !!fields.situation.value.trim()],
    [fields.evidence.value.trim() ? 'Доказательства добавлены' : 'Не добавлены доказательства', !!fields.evidence.value.trim()],
    [fields.hasC060.value === 'yes' ? '/c 060 отмечен' : '/c 060 не отмечен', fields.hasC060.value === 'yes']
  ];
  const videoLength = Number(fields.videoLength.value || 0);
  checks.push([fields.timecode.value.trim() ? 'Тайм-код указан' : 'Тайм-код не указан', !!fields.timecode.value.trim()]);
  return checks;
}

function collectWarnings() {
  const warnings = [];
  buildStatus().forEach(([text, ok]) => { if (!ok) warnings.push(text + '.'); });
  return warnings;
}

function renderStatus() {
  statusList.innerHTML = '';
  buildStatus().forEach(([text, ok]) => {
    const li = document.createElement('li');
    li.className = `status-item ${ok ? 'ok' : 'warn'}`;
    li.textContent = `${ok ? '✅' : '⚠️'} ${text}`;
    statusList.append(li);
  });
}

function renderAlerts(warnings) {
  alertsBox.innerHTML = '';
  if (!warnings.length) {
    alertsBox.innerHTML = '<div class="alert ok">Проверка пройдена: все обязательные условия соблюдены.</div>';
    return;
  }
  warnings.forEach((w) => {
    const el = document.createElement('div'); el.className = 'alert warn'; el.textContent = w; alertsBox.append(el);
  });
}

const formatDate = (date) => (date ? new Date(date).toLocaleDateString('ru-RU') : 'Не указана');
function generateBBCode() {
  output.value = `[CENTER][SIZE=5][B]${fields.complaintType.value}[/B][/SIZE][/CENTER]\n\n`
  + `[B]Ваш ник:[/B] ${fields.authorNick.value.trim() || 'Не указан'}\n`
  + `[B]Ник нарушителя:[/B] ${fields.violatorNick.value.trim() || 'Не указан'}\n`
  + `[B]Дата нарушения:[/B] ${formatDate(fields.incidentDate.value)}\n`
  + `[B]Описание ситуации:[/B]\n${fields.situation.value.trim() || 'Не указано'}\n\n`
  + `[B]Доказательства:[/B]\n${fields.evidence.value.trim() || 'Не указаны'}\n`
  + `[B]Тайм-код:[/B] ${fields.timecode.value.trim() || 'Не указан'}\n`
  + `[B]Наличие /c 060:[/B] ${fields.hasC060.value === 'yes' ? 'Да' : 'Нет'}\n\n`
  + `[I]Сгенерировано через Complaint Builder[/I]`;
}

function runCheck() { renderStatus(); renderAlerts(collectWarnings()); }

document.getElementById('checkBtn').addEventListener('click', runCheck);
document.getElementById('generateBtn').addEventListener('click', () => { runCheck(); generateBBCode(); });
document.getElementById('copyBtn').addEventListener('click', async () => {
  if (!output.value.trim()) return renderAlerts(['Сначала сгенерируйте BBCode.']);
  try { await navigator.clipboard.writeText(output.value); alertsBox.innerHTML = '<div class="alert ok">BBCode скопирован в буфер обмена.</div>'; }
  catch { alertsBox.innerHTML = '<div class="alert warn">Не удалось скопировать автоматически. Скопируйте вручную.</div>'; }
});
form.addEventListener('reset', () => setTimeout(() => { output.value = ''; alertsBox.innerHTML = ''; renderStatus(); }, 0));
Object.values(fields).forEach((f) => f.addEventListener('input', renderStatus));

const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)), {threshold: .15});
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
renderStatus();

const previewCopyBtn = document.getElementById('previewCopyBtn');
if (previewCopyBtn) previewCopyBtn.addEventListener('click', () => document.getElementById('copyBtn').click());
