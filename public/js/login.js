//Change title based on daytime
var day = new Date();
var hour = day.getHours();
console.log(hour);
const login_title = document.getElementById('login-card__title');
if (hour >= 0 && hour < 12) {
  login_title.innerHTML = 'Chào buổi sáng!';
} else if (hour >= 12 && hour < 13) {
  login_title.innerHTML = 'Chào buổi trưa!';
} else if (hour >= 13 && hour < 18) {
  login_title.innerHTML = 'Chào buổi chiều!';
} else {
  login_title.innerHTML = 'Chào buổi tối!';
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
      .then(({ ok, msg, at }) => {
        if (!ok) {
          // Reset
          if($('#loginForm input').hasClass('invalid')){ 
            $('#loginForm input').removeClass('invalid')
            $('span.login-msg--error').remove()
          }
          $('.' + at).addClass('invalid')
          $('.' + at).after(`<span class="login-msg--error">${msg}</span>`)
          return;
        }
        // If auth success, redirect to home
        return (window.location.href = '/home');
      });
  });