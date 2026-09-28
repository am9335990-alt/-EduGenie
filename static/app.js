const tasks = {
  qa: { title: 'Ask a Question', desc: 'Type any academic or general learning question.', label: 'Your question', placeholder: 'Example: Which is the largest ocean?', button: 'Ask EduGenie', endpoint: '/qa' },
  explain: { title: 'Explain a Topic', desc: 'Turn a difficult concept into a beginner-friendly explanation.', label: 'Topic', placeholder: 'Example: Pythagoras theorem', button: 'Explain Topic', endpoint: '/explain' },
  quiz: { title: 'Generate a Quiz', desc: 'Paste study material and create multiple-choice questions.', label: 'Study passage', placeholder: 'Paste a chapter, lesson, or notes here...', button: 'Generate Quiz', endpoint: '/quiz' },
  summarize: { title: 'Summarize', desc: 'Convert long educational content into quick revision notes.', label: 'Passage', placeholder: 'Paste the text you want to summarize...', button: 'Summarize', endpoint: '/summarize' },
  learn: { title: 'Learning Path', desc: 'Get a structured beginner-to-advanced plan for a topic.', label: 'Topic to learn', placeholder: 'Example: SQL', button: 'Build Learning Path', endpoint: '/learn/recommendations' }
};
let currentTask = 'qa';

const input = document.getElementById('userInput');
const form = document.getElementById('assistantForm');
const result = document.getElementById('result');
const extra = document.getElementById('extraControls');
const level = document.getElementById('level');
const submitBtn = document.getElementById('submitBtn');

function selectTask(name) {
  currentTask = name;
  const t = tasks[name];
  document.querySelectorAll('.task').forEach(b => b.classList.toggle('active', b.dataset.task === name));
  document.getElementById('taskHeading').innerHTML = `<h2>${t.title}</h2><p>${t.desc}</p>`;
  document.getElementById('inputLabel').textContent = t.label;
  input.placeholder = t.placeholder;
  submitBtn.innerHTML = `${t.button} <span>→</span>`;
  extra.classList.toggle('hidden', name !== 'learn');
  result.className = 'result empty';
  result.innerHTML = '<div class="result-icon">✨</div><h3>Your result will appear here</h3><p>Choose a task and send your input to get started.</p>';
}

document.querySelectorAll('.task').forEach(button => button.addEventListener('click', () => selectTask(button.dataset.task)));
document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; result.className = 'result empty'; result.innerHTML = '<div class="result-icon">✨</div><h3>Your result will appear here</h3><p>Choose a task and send your input to get started.</p>'; });

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' })[c]);
}

function renderQuiz(questions) {
  return questions.map((q, i) => `<div class="quiz-card"><h4>${i + 1}. ${escapeHtml(q.question)}</h4>${q.options.map((o, idx) => `<div class="option"><strong>${String.fromCharCode(65 + idx)}.</strong> ${escapeHtml(o)}</div>`).join('')}<p><strong>Answer:</strong> ${escapeHtml(q.options[q.answer])}<br><strong>Why:</strong> ${escapeHtml(q.explanation || '')}</p></div>`).join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const t = tasks[currentTask];
  let body;
  if (currentTask === 'qa' || currentTask === 'summarize') body = { text };
  else if (currentTask === 'explain') body = { topic: text };
  else if (currentTask === 'quiz') body = { text, count: 3 };
  else body = { topic: text, level: level.value };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Thinking…';
  result.className = 'result';
  result.textContent = 'EduGenie is generating your response…';
  try {
    const response = await fetch(t.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    // Handle non-JSON responses (e.g. HTML error pages) safely
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Read as text and include it in the error if the request failed
      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Request failed.');
      // If the response is OK but not JSON, treat the raw text as the answer
      data = { raw: text };
    }
    if (!response.ok) throw new Error((data && data.detail) || 'Request failed.');
    if (currentTask === 'qa' || currentTask === 'explain') result.textContent = data.answer ?? data.raw ?? '';
    else if (currentTask === 'summarize') result.textContent = data.summary ?? data.raw ?? '';
    else if (currentTask === 'quiz') result.innerHTML = data.quiz ? renderQuiz(data.quiz) : (data.raw ?? '');
    else result.textContent = data.recommendations ?? data.raw ?? '';
  } catch (error) {
    result.className = 'result error';
    result.textContent = `Error: ${error.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `${t.button} <span>→</span>`;
  }
});
