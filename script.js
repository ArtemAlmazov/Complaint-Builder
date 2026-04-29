const form = document.getElementById('complaintForm');
const output = document.getElementById('output');
const alertsBox = document.getElementById('alerts');

const fields = {
  authorNick: document.getElementById('authorNick'),
  violatorNick: document.getElementById('violatorNick'),
  complaintType: document.getElementById('complaintType'),
  incidentDate: document.getElementById('incidentDate'),
  situation: document.getElementById('situation'),
  evidence: document.getElementById('evidence'),
  timecode: document.getElementById('timecode'),
  hasC060: document.getElementById('hasC060'),
  videoLength: document.getElementById('videoLength')
};

function collectWarnings() {
  const warnings = [];

  if (!fields.authorNick.value.trim()) warnings.push('Не указан ваш ник.');
  if (!fields.violatorNick.value.trim()) warnings.push('Не указан ник нарушителя.');
  if (!fields.situation.value.trim()) warnings.push('Не указано описание ситуации.');
  if (!fields.evidence.value.trim()) warnings.push('Не указаны доказательства.');
  if (fields.hasC060.value === 'no') warnings.push('Отсутствует /c 060 — это обязательное условие.');

  const videoLength = Number(fields.videoLength.value);
  if (videoLength > 60 && !fields.timecode.value.trim()) {
    warnings.push('Видео длиннее 60 секунд — добавьте тайм-код.');
  }

  return warnings;
}

function renderAlerts(warnings) {
  alertsBox.innerHTML = '';

  if (warnings.length === 0) {
    alertsBox.innerHTML = '<div class="alert ok">Проверка пройдена: обязательные поля заполнены.</div>';
    return;
  }

  warnings.forEach((text) => {
    const alert = document.createElement('div');
    alert.className = 'alert warn';
    alert.textContent = text;
    alertsBox.append(alert);
  });
}

function formatDate(date) {
  if (!date) return 'Не указана';
  return new Date(date).toLocaleDateString('ru-RU');
}

function generateBBCode() {
  const bbcode = `[CENTER][SIZE=5][B]${fields.complaintType.value}[/B][/SIZE][/CENTER]\n\n`
    + `[B]Ваш ник:[/B] ${fields.authorNick.value.trim() || 'Не указан'}\n`
    + `[B]Ник нарушителя:[/B] ${fields.violatorNick.value.trim() || 'Не указан'}\n`
    + `[B]Дата нарушения:[/B] ${formatDate(fields.incidentDate.value)}\n`
    + `[B]Описание ситуации:[/B]\n${fields.situation.value.trim() || 'Не указано'}\n\n`
    + `[B]Доказательства:[/B]\n${fields.evidence.value.trim() || 'Не указаны'}\n`
    + `[B]Тайм-код:[/B] ${fields.timecode.value.trim() || 'Не указан'}\n`
    + `[B]Наличие /c 060:[/B] ${fields.hasC060.value === 'yes' ? 'Да' : 'Нет'}\n\n`
    + `[I]Сгенерировано через Complaint Builder[/I]`;

  output.value = bbcode;
}

document.getElementById('checkBtn').addEventListener('click', () => {
  renderAlerts(collectWarnings());
});

document.getElementById('generateBtn').addEventListener('click', () => {
  const warnings = collectWarnings();
  renderAlerts(warnings);
  generateBBCode();
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  if (!output.value.trim()) {
    renderAlerts(['Сначала сгенерируйте BBCode.']);
    return;
  }

  try {
    await navigator.clipboard.writeText(output.value);
    alertsBox.innerHTML = '<div class="alert ok">BBCode скопирован в буфер обмена.</div>';
  } catch {
    alertsBox.innerHTML = '<div class="alert warn">Не удалось скопировать автоматически. Скопируйте вручную.</div>';
  }
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    output.value = '';
    alertsBox.innerHTML = '';
  }, 0);
});
