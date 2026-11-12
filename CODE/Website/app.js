const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  mode: 'demo',
  armed: false,
  left: 0,
  right: 0,
  throttle: 0,
  steering: 0,
  speed: 100,
  battery: 78,
  start: Date.now(),
  matchSeconds: 300,
  matchRunning: false,
  matchTimer: null,
  espUrl: localStorage.getItem('espUrl') || 'http://192.168.4.1',
  apiMode: localStorage.getItem('apiMode') || 'mock',
  lastCommand: 'SAFE / IDLE',
};

const logEntries = [
  ['info', 'ESP32 control core initialized'],
  ['safe', 'Failsafe armed — output locked'],
  ['info', 'Demo telemetry stream connected'],
  ['cmd', 'RC fallback profile loaded: CH1 / CH2'],
];

function clock() { return new Date().toLocaleTimeString('en-GB', { hour12: false }); }
function addLog(message, type = 'info') {
  logEntries.push([type, message]);
  if (logEntries.length > 45) logEntries.shift();
  renderLog();
}
function renderLog() {
  $('#eventLog').innerHTML = logEntries.map(([type, message]) => {
    const tag = type === 'safe' ? 'SAFETY' : type === 'cmd' ? 'COMMAND' : type === 'warn' ? 'WARNING' : 'SYSTEM';
    return `<div class="log-line ${type}"><span class="time">[${clock()}]</span><span class="tag">${tag}</span>${message}</div>`;
  }).join('');
  $('#eventLog').scrollTop = $('#eventLog').scrollHeight;
}

function toast(message, type = '') {
  const item = document.createElement('div');
  item.className = `toast ${type}`;
  item.textContent = message;
  $('#toastStack').appendChild(item);
  setTimeout(() => item.remove(), 3000);
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function mix(throttle, steering) {
  const speedScale = state.speed / 100;
  return {
    left: clamp(Math.round((throttle + steering) * speedScale), -255, 255),
    right: clamp(Math.round((throttle - steering) * speedScale), -255, 255),
  };
}

async function sendDrive(left, right) {
  state.left = left;
  state.right = right;
  state.lastCommand = `${left}, ${right}`;
  $('#lastCommand').textContent = clock();
  if (state.mode === 'live' && state.apiMode === 'http') {
    try {
      await fetch(`${state.espUrl}/api/drive`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ left, right }) });
      $('#latency').textContent = `${Math.floor(18 + Math.random() * 18)} ms`;
    } catch (error) {
      addLog('Live link failed — output forced to zero', 'warn');
      toast('ESP32 link failed — motors stopped', 'danger');
      stopMotors(false);
    }
  }
  renderDrive();
}

function stopMotors(addEntry = true) {
  state.throttle = 0;
  state.steering = 0;
  state.left = 0;
  state.right = 0;
  state.lastCommand = 'STOP / ZERO OUTPUT';
  if (state.mode === 'live' && state.apiMode === 'http') {
    fetch(`${state.espUrl}/api/stop`, { method: 'POST' }).catch(() => {});
  }
  if (addEntry) { addLog('Motors stopped — zero output sent', 'safe'); toast('Motors stopped', ''); }
  renderDrive();
}

function renderDrive() {
  const left = state.left;
  const right = state.right;
  const leftAbs = Math.abs(left);
  const rightAbs = Math.abs(right);
  $('#leftPercent').textContent = `${Math.round(leftAbs / 255 * 100)}%`;
  $('#rightPercent').textContent = `${Math.round(rightAbs / 255 * 100)}%`;
  $('#leftPwm').textContent = String(leftAbs).padStart(3, '0');
  $('#rightPwm').textContent = String(rightAbs).padStart(3, '0');
  $('#leftDir').textContent = left > 0 ? 'FWD' : left < 0 ? 'REV' : 'IDLE';
  $('#rightDir').textContent = right > 0 ? 'FWD' : right < 0 ? 'REV' : 'IDLE';
  $('#leftBar').style.width = `${leftAbs / 255 * 100}%`;
  $('#rightBar').style.width = `${rightAbs / 255 * 100}%`;
  $('#driveState').textContent = state.armed ? 'ARMED / LIVE OUTPUT' : 'DISARMED / SAFE';
  $('#driveState').style.color = state.armed ? 'var(--cyan)' : 'var(--green)';
  $('#robotStatus').textContent = state.armed ? 'ARMED' : 'READY';
  $('#robotBody').style.transform = `translate(-50%,-50%) rotate(${(right - left) / 45}deg)`;
  $('#heading').textContent = `NORTH / ${String(Math.round((right-left) / 510 * 180 + 360) % 360).padStart(3, '0')}°`;
}

function applyInput(throttle, steering, label = 'Pilot command') {
  state.throttle = clamp(throttle, -255, 255);
  state.steering = clamp(steering, -255, 255);
  if (!state.armed) { stopMotors(false); return; }
  const output = mix(state.throttle, state.steering);
  sendDrive(output.left, output.right);
  if (Math.abs(output.left) + Math.abs(output.right) > 0) addLog(`${label} — L ${output.left} / R ${output.right}`, 'cmd');
}

function setMode(mode) {
  if (mode === 'live' && !state.armed) {
    const goLive = window.confirm('Live Mode sends commands to the ESP32. Continue?');
    if (!goLive) return;
  }
  if (state.mode !== mode) stopMotors(false);
  state.mode = mode;
  $$('.mode-button').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
  $('#connectionLabel').textContent = mode === 'demo' ? 'DEMO LINK' : 'LIVE LINK';
  $('#espStatus').textContent = mode === 'demo' ? 'STANDBY' : 'CONNECTING';
  $('#coreStatus').textContent = mode === 'demo' ? 'SIMULATED' : 'ONLINE';
  addLog(mode === 'demo' ? 'Demo mode selected — hardware isolated' : 'Live mode selected — awaiting arm gate', mode === 'demo' ? 'info' : 'warn');
  toast(mode === 'demo' ? 'Demo mode active' : 'Live mode ready — arm to drive', mode === 'demo' ? '' : 'warn');
}

function toggleArm() {
  state.armed = !state.armed;
  if (!state.armed) stopMotors(false);
  $('#armButton').classList.toggle('armed', state.armed);
  $('#armText').textContent = state.armed ? 'DISARM DRIVE' : 'ARM DRIVE';
  $('#espStatus').textContent = state.armed ? (state.mode === 'demo' ? 'DEMO ACTIVE' : 'LIVE ACTIVE') : 'STANDBY';
  addLog(state.armed ? 'Drive system armed by operator' : 'Drive system disarmed — zero output', state.armed ? 'cmd' : 'safe');
  toast(state.armed ? 'Drive armed' : 'Drive disarmed', state.armed ? '' : 'warn');
  renderDrive();
}

function quickCommand(command) {
  if (!state.armed) { toast('Press ARM DRIVE before sending commands', 'warn'); return; }
  if (command === 'stop') return stopMotors();
  const commands = { forward: [220, 220], reverse: [-220, -220], left: [-190, 190], right: [190, -190] };
  const [left, right] = commands[command];
  sendDrive(Math.round(left * state.speed / 100), Math.round(right * state.speed / 100));
  addLog(`${command.toUpperCase()} command sent`, 'cmd');
}

function updateTelemetry() {
  const movement = (Math.abs(state.left) + Math.abs(state.right)) / 510;
  const drain = movement * 0.025;
  state.battery = Math.max(0, state.battery - drain);
  $('#batteryValue').textContent = `${Math.round(state.battery)}%`;
  $('#voltage').innerHTML = `${(10.8 + state.battery / 100 * 1.8).toFixed(2)} <small>V</small>`;
  $('#current').innerHTML = `${(0.18 + movement * 3.8).toFixed(2)} <small>A</small>`;
  $('#signal').innerHTML = `${Math.round(96 + Math.random() * 3)} <small>%</small>`;
  const elapsed = Math.floor((Date.now() - state.start) / 1000);
  $('#uptime').textContent = new Date(elapsed * 1000).toISOString().substring(11, 19);
  if (state.armed && movement > 0) {
    $('.robot-body')?.classList.add('moving');
  } else {
    $('.robot-body')?.classList.remove('moving');
  }
}

function setJoystick(event) {
  const rect = $('#joystick').getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = clamp((point.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
  const y = clamp((point.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
  $('#joystickKnob').style.left = `${50 + x * 38}%`;
  $('#joystickKnob').style.top = `${50 + y * 38}%`;
  const throttle = Math.round(-y * 255);
  const steering = Math.round(x * 255);
  $('#throttleReadout').textContent = String(Math.abs(throttle)).padStart(3, '0');
  $('#steeringReadout').textContent = String(Math.abs(steering)).padStart(3, '0');
  applyInput(throttle, steering, 'Joystick input');
}
function resetJoystick() { $('#joystickKnob').style.left = '50%'; $('#joystickKnob').style.top = '50%'; $('#throttleReadout').textContent = '000'; $('#steeringReadout').textContent = '000'; stopMotors(); }

$$('.mode-button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
$('#armButton').addEventListener('click', toggleArm);
$('#topStop').addEventListener('click', () => { state.armed = false; $('#armButton').classList.remove('armed'); $('#armText').textContent = 'ARM DRIVE'; stopMotors(); addLog('EMERGENCY STOP pressed — drive disarmed', 'safe'); toast('EMERGENCY STOP ACTIVE', 'danger'); });
$$('[data-command]').forEach((button) => { button.addEventListener('mousedown', () => quickCommand(button.dataset.command)); button.addEventListener('touchstart', (e) => { e.preventDefault(); quickCommand(button.dataset.command); }, { passive: false }); });
$('#speedSlider').addEventListener('input', (event) => { state.speed = Number(event.target.value); $('#speedValue').textContent = `${state.speed}%`; });
$('#clearLog').addEventListener('click', () => { logEntries.length = 0; renderLog(); });
$('#settingsButton').addEventListener('click', () => { $('#settingsModal').classList.remove('hidden'); $('#espUrl').value = state.espUrl; $('#apiMode').value = state.apiMode; });
$('#closeModal').addEventListener('click', () => $('#settingsModal').classList.add('hidden'));
$('#settingsModal').addEventListener('click', (event) => { if (event.target === $('#settingsModal')) $('#settingsModal').classList.add('hidden'); });
$('#saveSettings').addEventListener('click', () => { state.espUrl = $('#espUrl').value.replace(/\/$/, ''); state.apiMode = $('#apiMode').value; localStorage.setItem('espUrl', state.espUrl); localStorage.setItem('apiMode', state.apiMode); $('#settingsModal').classList.add('hidden'); addLog('Connection profile saved', 'info'); toast('Settings saved'); });
$('#testConnection').addEventListener('click', async () => { if (state.apiMode === 'mock') { toast('Demo link is healthy'); addLog('Mock link test passed', 'safe'); return; } try { await fetch(`${$('#espUrl').value.replace(/\/$/, '')}/api/status`); toast('ESP32 link responded'); addLog('ESP32 status endpoint responded', 'safe'); } catch { toast('ESP32 link unavailable', 'danger'); addLog('ESP32 status endpoint unavailable', 'warn'); } });
$('#joystick').addEventListener('pointerdown', (event) => { $('#joystick').setPointerCapture(event.pointerId); setJoystick(event); });
$('#joystick').addEventListener('pointermove', (event) => { if (event.buttons) setJoystick(event); });
$('#joystick').addEventListener('pointerup', resetJoystick);
$('#joystick').addEventListener('pointercancel', resetJoystick);
document.addEventListener('keydown', (event) => { if (event.repeat) return; const key = event.key.toLowerCase(); if (key === ' ') { event.preventDefault(); stopMotors(); return; } if (!state.armed) return; const commands = { w: [255, 255], arrowup: [255, 255], s: [-255, -255], arrowdown: [-255, -255], a: [-210, 210], arrowleft: [-210, 210], d: [210, -210], arrowright: [210, -210] }; if (commands[key]) { event.preventDefault(); const [left, right] = commands[key]; sendDrive(Math.round(left * state.speed / 100), Math.round(right * state.speed / 100)); } });
document.addEventListener('keyup', (event) => { if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(event.key.toLowerCase())) stopMotors(false); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopMotors(false); });

function formatMatchTime() { const minutes = Math.floor(state.matchSeconds / 60); const seconds = state.matchSeconds % 60; $('#matchTimer').textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`; }
$('#matchToggle').addEventListener('click', () => { state.matchRunning = !state.matchRunning; $('#matchToggle').textContent = state.matchRunning ? 'PAUSE MATCH' : 'RESUME MATCH'; $('#matchState').textContent = state.matchRunning ? 'LIVE' : 'PAUSED'; if (state.matchRunning) { state.matchTimer = setInterval(() => { state.matchSeconds = Math.max(0, state.matchSeconds - 1); formatMatchTime(); if (!state.matchSeconds) { clearInterval(state.matchTimer); state.matchRunning = false; $('#matchState').textContent = 'FINISHED'; $('#matchToggle').textContent = 'START MATCH'; toast('Match complete', 'warn'); } }, 1000); addLog('Match timer started', 'cmd'); } else { clearInterval(state.matchTimer); addLog('Match timer paused', 'info'); } });
$('#matchReset').addEventListener('click', () => { clearInterval(state.matchTimer); state.matchSeconds = 300; state.matchRunning = false; $('#ourScore').textContent = '00'; $('#opponentScore').textContent = '00'; $('#matchState').textContent = 'PRE-MATCH'; $('#matchToggle').textContent = 'START MATCH'; formatMatchTime(); addLog('Match state reset', 'safe'); });

formatMatchTime(); renderLog(); renderDrive(); setInterval(updateTelemetry, 1000);
