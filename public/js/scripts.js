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
console.log(hour)
const login_title = document.getElementById("login-card__title");
if(hour >= 0 && hour < 12){
    login_title.innerHTML = "Chào buổi sáng!";
} else if(hour >= 12 && hour < 13){
    login_title.innerHTML = "Chào buổi trưa!";
} else if(hour >= 13 && hour < 18){
    login_title.innerHTML = "Chào buổi chiều!";
} else{
    login_title.innerHTML = "";
}

// login form post
$("#loginForm").on("submit", (e)=>{
  e.preventDefault();

  fetch("/api/auth",{
    method:"POST",
    body: new URLSearchParams({
      loginUsername : $("#loginUsername").val(),
      loginPassword : $("#loginPassword").val()
    })
  }).then(res => res.json())
    .then(({ok,msg}) => {
      if(!ok) {return alert(msg)}
      // If auth success, redirect to home
      return window.location.href = "/home"
    })
  
})

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
