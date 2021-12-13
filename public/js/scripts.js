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
