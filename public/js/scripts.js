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

//create_post_option
//function upload img
function img_upload() {
  document.getElementById("file").click();
};
input_img=document.getElementById('input_img')

console.log(input_img)
var loadFile = function(event) {
  var reader = new FileReader();
  reader.onload = function(){
    var output = document.getElementById('review_img');
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  re_img.style.display='block'
  input_img.style.display='none'
};
//remove img
var re_img=document.getElementById('review_img')
function remove(){
  re_img.removeAttribute('src');
  document.getElementById("file").value=null
  re_img.style.display='none'
  input_img.style.display='block'
}
//input_img.style.display='block'
//auto resize text area
const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}
function OnInput() {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
}

//login.html
//catch switch button state
const switchT = document.getElementById("switch");
const log_image = document.querySelectorAll(".img__holder>img");
// console.log(log_image[0].style.display = "none");
const signIn_mess = document.getElementById("signIn_message");
const bg_wrapper = document.getElementById("bg_wrapper");
const divider =document.getElementsByClassName("divider");


// switchT.addEventListener('change', (e) =>{
//     if (e.target.checked){
//         // log_image[1].style.transition = "visibility 5s ease-in";
//         // log_image[0].style.visibility = "hidden";
//         // log_image[1].style.transform = "translateX(-50%)";
//         log_image[0].style.opacity = 0;
//         log_image[1].style.opacity = 1;
//         // signIn_mess.innerHTML = "Sign in with your school mail";
//         toggle_Bg();
//     } else{
//         // log_image[0].style.transform = "translateX(-50%)";
//         log_image[1].style.opacity = 0;
//         log_image[0].style.opacity = 1;
//         // signIn_mess.innerHTML = "Sign in with student mail";
//         toggle_Bg();
//     }
// });

function toggle_Bg(){
    //main bg
    bg_wrapper.classList.toggle("bg-tea");
    //divider bg
    divider[0].classList.toggle("dvBackgr_tea");
}


// function change_bg(bg_class){
//     bg_wrapper.classList.add()
// }


//Change title based on daytime
var day = new Date();
var hour = day.getHours();
const login_title = document.getElementById("login-card__title");
if(hour >= 21){
    login_title.innerHTML = "Chào buổi tối!";
} else if(hour >= 18){
    login_title.innerHTML = "Chào buổi chiều!";
} else if(hour >= 12){
    login_title.innerHTML = "Chào buổi trưa!";
} else if(hour> 6 || hour < 6){
    login_title.innerHTML = "Chào buổi sáng!";
}
//







