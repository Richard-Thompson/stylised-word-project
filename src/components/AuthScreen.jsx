import React from 'react';

const ACCESS_CODE = '11234';
const MAX_LEN = ACCESS_CODE.length;

const AuthScreen = ({ onAuth }) => {
  const [code, setCode] = React.useState('');
  const [status, setStatus] = React.useState('idle');

  const handleChange = (event) => {
    const digitsOnly = event.target.value.replace(/[^0-9]/g, '').slice(0, MAX_LEN);
    setCode(digitsOnly);
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (code === ACCESS_CODE) {
      setStatus('success');
      window.setTimeout(() => {
        onAuth?.();
      }, 450);
    } else {
      setStatus('error');
    }
  };

  const handleKeyPress = (digit) => {
    if (code.length >= MAX_LEN || status === 'success') return;
    setCode((prev) => `${prev}${digit}`.slice(0, MAX_LEN));
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleBackspace = () => {
    if (!code.length || status === 'success') return;
    setCode((prev) => prev.slice(0, -1));
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleClear = () => {
    if (status === 'success') return;
    setCode('');
    setStatus('idle');
  };

  return (
    <div className="auth-screen">
      <div className="auth-shell">
        <div className="auth-card">
          <section className="auth-hero">
            <div className="auth-badge">Avalanche Net</div>
            <h1>Terrain Access</h1>
            <p>
              Authenticate to unlock live ridge telemetry, lift controls, and route
              overlays. Secure gate requires the five-digit passcode.
            </p>
            <div className="auth-meta">
              <div>
                <span>Signal</span>
                <strong>Crystal Ridge</strong>
              </div>
              <div>
                <span>Mode</span>
                <strong>Operator</strong>
              </div>
              <div>
                <span>Hint</span>
                <strong>11234</strong>
              </div>
            </div>
          </section>

          <section className="auth-panel">
            <form className="auth-form" onSubmit={handleSubmit}>
              <label htmlFor="auth-code">Passcode</label>
              <div className={`auth-input-wrap ${status}`}>
                <input
                  id="auth-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="Enter 5 digits"
                  value={code}
                  onChange={handleChange}
                  maxLength={MAX_LEN}
                />
                <button type="button" className="auth-clear" onClick={handleClear}>
                  Clear
                </button>
              </div>
              <div className="auth-status" role="status" aria-live="polite">
                {status === 'error' && 'Invalid code. Try again.'}
                {status === 'success' && 'Access granted. Syncing...'}
              </div>
              <button className="auth-submit" type="submit" disabled={code.length < MAX_LEN}>
                Authorize
              </button>
            </form>

            <div className="auth-keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  className="auth-key"
                  onClick={() => handleKeyPress(digit)}
                >
                  {digit}
                </button>
              ))}
              <button type="button" className="auth-key ghost" onClick={handleBackspace}>
                Del
              </button>
              <button type="button" className="auth-key" onClick={() => handleKeyPress('0')}>
                0
              </button>
              <button type="button" className="auth-key ghost" onClick={handleClear}>
                Reset
              </button>
            </div>
          </section>
        </div>
        <div className="auth-footer">
          <span>Secure line established.</span>
          <span>All access is monitored.</span>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
