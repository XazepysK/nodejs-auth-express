const form = document.querySelector('.login form');

if (form) {
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  form.insertAdjacentElement('afterend', status);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Submitting…';

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.elements.username.value.trim(),
          password: form.elements.password.value
        })
      });

      const responseBody = await response.text();
      let result = {};
      try {
        result = responseBody ? JSON.parse(responseBody) : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.message || `Request failed (HTTP ${response.status}).`);
      }

      window.location.assign(result.redirect || '/');
      window.cookieStore.set('username', form.elements.username.value.trim());
    } catch (error) {
      status.textContent = error.message || 'Could not reach the server. Check your connection and try again.';
    }
  });
}