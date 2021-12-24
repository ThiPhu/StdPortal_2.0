$(document).ready(function () {
  // Khi scroll, sẽ kéo theo navbar - leftbar - rightbar
  $(window).scroll(function () {
    let stickyNavbar = $('.navbar-header');
    let stickyLeftbar = $('.sb-left');
    let stickyRightbar = $('.sb-right');
    let scrollNavbar = $(window).scrollTop();

    if (scrollNavbar >= 1) {
      stickyNavbar.addClass('navbar-sticky');
      stickyLeftbar.addClass('sb-left_sticky');
      stickyRightbar.addClass('sb-right_sticky');
    } else {
      stickyNavbar.removeClass('navbar-sticky');
      stickyLeftbar.removeClass('sb-left_sticky');
      stickyRightbar.removeClass('sb-right_sticky');
    }
  });
});

// ------------------- LOGIN --------------------------------------

//Change title based on daytime
var day = new Date();
var hour = day.getHours();
console.log(hour);
const login_title = document.getElementById('login-card__title');
function getHoursLogin() {
  if (hour >= 0 && hour < 12) {
    if (!login_title) {
      return false;
    }
    login_title.innerHTML = 'Chào buổi sáng!';
  } else if (hour >= 12 && hour < 13) {
    if (!login_title) {
      return false;
    }
    login_title.innerHTML = 'Chào buổi trưa!';
  } else if (hour >= 13 && hour < 18) {
    if (!login_title) {
      return false;
    }
    login_title.innerHTML = 'Chào buổi chiều!';
  } else {
    if (!login_title) {
      return false;
    }
    login_title.innerHTML = 'Chào buổi tối!';
  }
}

getHoursLogin();

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
    .then(({ ok, msg }) => {
      if (!ok) {
        return alert(msg);
      }
      // If auth success, redirect to home
      return (window.location.href = '/home');
    });
});

// Auto resize input in Comments section
$('.comment_input')
  .each(function () {
    this.setAttribute(
      'style',
      'height:' + this.scrollHeight + 'px;overflow-y:hidden;'
    );
  })
  .on('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

// Login with google
// $(".btn_google_signin").on("click", (e)=>{
//   e.preventDefault()

//   fetch("/api/auth/google")
//     .then(data => data.json())
//      .then(json => console.log("FROM CLIENT", json))
// })

// ------------------- END LOGIN --------------------------------------

// ------------------- LOGOUT --------------------------------------

// $(".sign-out").on("click", (e)=>{
//   e.preventDefault()

//   fetch("/logout")
// })

// ------------------- END LOGOUT --------------------------------------

// ------------------- ERROR COUNTDOWN --------------------------------------

function errorCountdown() {
  var seconds = 2; // seconds for HTML
  var foo; // variable for clearInterval() function

  function updateSecs() {
    document.getElementById('seconds').innerHTML = seconds;
    seconds--;
    if (seconds == -1) {
      clearInterval(foo);
      window.location.href = '/';
    }
  }

  function countdownTimer() {
    foo = setInterval(function () {
      updateSecs();
    }, 1000);
  }

  countdownTimer();
}

errorCountdown();

// ------------------- END ERROR COUNTDOWN --------------------------------------
