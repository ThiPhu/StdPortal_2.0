$(document).ready(function () {
  //Change title based on daytime
  var day = new Date();
  var hour = day.getHours();
  console.log(hour);
  const login_title = document.getElementById('login-card__title');
  if (hour >= 0 && hour < 12) {
    if (login_title) login_title.innerHTML = 'Chào buổi sáng!';
  } else if (hour >= 12 && hour < 13) {
    if (login_title) login_title.innerHTML = 'Chào buổi trưa!';
  } else if (hour >= 13 && hour < 18) {
    if (login_title) login_title.innerHTML = 'Chào buổi chiều!';
  } else {
    if (login_title) login_title.innerHTML = 'Chào buổi tối!';
  }
  // login form post
  $('#loginForm').on('submit', e => {
    e.preventDefault();
    let loginUsername = $('.loginUsername').val();
    let loginPassword = $('.loginPassword').val();
    fetch('/api/auth', {
      method: 'POST',
      contentType: 'application/json',
      body: new URLSearchParams({
        loginUsername: loginUsername,
        loginPassword: loginPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (!json.ok) {
          console.log(json)
          console.log(json.param)
          // Reset
          if ($('#loginForm input').hasClass('invalid')) {
            $('#loginForm input').removeClass('invalid');
            $('span.login-msg--error').remove();
          }
          // param from auth.validation.js
          $('.' + json.at).addClass('invalid');
          $('.' + json.at).after(`<span class="login-msg--error">${json.msg}</span>`);
          return;
        }
        
        // If auth success, redirect to home
        return (window.location.href = '/home');
      });
  });
});
