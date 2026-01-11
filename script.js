const form = document.getElementById('form');
const btn = document.getElementById('btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const result = document.getElementById('result');
const output = document.getElementById('output');

function formatPlan(plan) {
  const parts = plan.split(/DAY\s+\d+:/i);
  if (parts.length <= 1) {
    return `<p>${plan.replace(/\n/g, '<br>')}</p>`;
  }

  let html = '';
  const intro = parts[0].trim();
  if (intro) {
    html += `<p>${intro.replace(/\n/g, '<br>')}</p>`;
  }

  const dayHeaders = plan.match(/DAY\s+\d+:/ig) || [];

  for (let i = 1; i < parts.length; i++) {
    const dayHeader = dayHeaders[i - 1] || `Day ${i}`;
    html += `<h3>${dayHeader}</h3>`;
    const details = parts[i].trim().split('\n');
    html += '<ul>';
    for (const detail of details) {
      if (detail.trim()) {
        html += `<li>${detail.trim()}</li>`;
      }
    }
    html += '</ul>';
  }

  return html;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const destination = document.getElementById('destination').value;
  const interests = document.getElementById('interests').value;
  const budget = document.getElementById('budget').value;
  const days = document.getElementById('days').value;
  
  btn.disabled = true;
  loading.classList.add('show');
  error.classList.remove('show');
  result.classList.remove('show');
  
  try {
    const res = await fetch('/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, interests, budget, days })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate plan');
    }
    
    output.innerHTML = formatPlan(data.plan);
    result.classList.add('show');
  } catch (err) {
    error.textContent = '❌ Error: ' + err.message;
    error.classList.add('show');
  } finally {
    btn.disabled = false;
    loading.classList.remove('show');
  }
});
