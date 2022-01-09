$(document).ready(function () {
  // Phần login Jquery =================================
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
          console.log(json);
          console.log(json.param);
          // Reset
          if ($('#loginForm input').hasClass('invalid')) {
            $('#loginForm input').removeClass('invalid');
            $('span.login-msg--error').remove();
          }
          // param from auth.validation.js
          $('.' + json.at).addClass('invalid');
          $('.' + json.at).after(
            `<span class="login-msg--error">${json.msg}</span>`
          );
          return;
        }

        // If auth success, redirect to home
        return (window.location.href = '/home');
      });
  });
  // Kết thúc login của Jquery =================================

  function onChangeTextArea() {
    //auto resize text area
    const tx = $('.comment_box');
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        'style',
        'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;'
      );
      tx[i].addEventListener('input', OnInput, false);
    }
    function OnInput() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }
  }
  // Khi scroll, sẽ kéo theo navbar - leftbar - rightbar
  $(window).scroll(function () {
    let stickyNavbar = $('.navbar-header');
    let stickyLeftbar = $('.sb-left');
    let stickyRightbar = $('.sb-right');
    let scrollNavbar = $(window).scrollTop();

    if (scrollNavbar >= 1) {
      stickyNavbar.addClass('navbar-sticky');
      // stickyLeftbar.addClass('sb-left_sticky');
      stickyRightbar.addClass('sb-right_sticky');
    } else {
      stickyNavbar.removeClass('navbar-sticky');
      // stickyLeftbar.removeClass('sb-left_sticky');
      stickyRightbar.removeClass('sb-right_sticky');
    }
  });

  // ================ Jquery liên quan đến bài viết ===========================================

  // Bấm vào caption để mở rộng bài viết
  let expandPostCaption = false;
  $(document).on('click', '.post_body-caption', e => {
    e.preventDefault();
    let postId = $(e.target).closest('.post_id').data('postid');
    if (expandPostCaption) {
      expandPostCaption = false;
      $('#post_caption_' + postId).addClass('post_caption-lineclamp');
    } else {
      expandPostCaption = true;
      $('#post_caption_' + postId).removeClass('post_caption-lineclamp');
    }
  });

  // Lấy danh sách bài viết
  if (
    window.location.href.indexOf('home') > -1 ||
    (window.location.href.indexOf('profile') > -1 &&
      window.location.href.indexOf('update-info') < 0) ||
    window.location.href.indexOf('announcements') > -1
  )
    $(window).ready(e => {
      getPost();
      getPostsNotification();
      getAnnounces();
      onChangeTextArea();
    });

  // Lấy danh sách notifications
  function getPostsNotification() {
    const userId =
      window.location.href.indexOf('profile') > -1 ||
      window.location.href.indexOf('update-info') < -1
        ? window.location.href.split('/').at(-1)
        : undefined;

    // Trả về route có query nếu có tham số id người dùng
    const route = userId ? `/api/post?user=${userId}` : '/api/post/';
    return fetch(route)
      .then(res => res.json())
      .then(json => {
        //reset
        $('.dropdown_notifications-post-container').html('');
        json.posts.map(post => {
          $('.dropdown_notifications-post-container').append(`
          <li>
              <a href="#" class="dropdown-item p-3" aria-current="true">
                  <div
                      class="d-flex w-100 align-items-center justify-content-between dropdown-alert-content">
                      <strong class="mb-1">
                          <span class="me-2 material-icons-outlined">
                              people
                          </span>
                          <span class="post_middle-fullname-display">${
                            post.user.fullname
                          }</span>
                      </strong>
                  </div>
                  <div class="col-12 mb-1 dropdown-alert-content">
                      ${post.caption}
                  </div>
                  <div class="col-12 mb-1 dropdown-alert-content">
                      <strong>${
                        post.image !== null ? `Bài viết có ảnh đính kèm` : ``
                      }</strong>
                  </div>
                  <div class="col-12 mb-1 dropdown-alert-content">
                      <strong>${
                        post.video !== null ? `Bài viết có video` : ``
                      }</strong>
                  </div>
                  <div class="col-12 mb-1 small d-flex align-items-center dropdown-alert-content">
                      <span class="material-icons-outlined m-1">
                          schedule
                      </span>
                      ${post.create_date} lúc  ${post.create_time}
                  </div>
              </a>
          </li>
        `);
        });
      });
  }

  // Lấy danh sách bài viết
  function getPost() {
    // Set cứng, nếu đường dẫn là profile thì tạo biết userid gán id user, ngược lại trả về undefined
    const userId =
      window.location.href.indexOf('profile') > -1 ||
      window.location.href.indexOf('update-info') < -1
        ? window.location.href.split('/').at(-1)
        : undefined;

    // Trả về route có query nếu có tham số id người dùng
    const route = userId ? `/api/post?user=${userId}` : '/api/post/';
    return fetch(route)
      .then(res => res.json())
      .then(json => {
        //reset
        $('.post-container').html('');
        $('.post_middle-spinner-loading').removeClass('d-none');
        $('.post_middle-spinner-loading').addClass('d-flex');
        json.posts.map(post => {
          $('.post-container').append(`
          <div class="post_id bg-white container d-lg-flex flex-column p-0 mb-4" data-postid="${
            post._id
          }">
              <div class="post_header col-12 mt-3">
                  <div class="d-flex align-items-center justify-content-start row">
                      <a class="col-lg-2 col-2 d-flex align-items-center justify-content-end"
                          href="/profile/${post.user._id}">
                          <img src='${post.user.avatar}' alt="avatar"
                              class="img-fluid post-comments_avatar">
                      </a>
                      <a class="row post_header-userInfo col-9 col-lg-8 d-flex align-items-center justify-content-center p-0"
                          href="/profile/${post.user._id}">
                          <div class="p-2 bd-highlight">
                              <div>
                                  <strong class="post_middle-fullname-display">
                                      ${post.user.fullname}
                                  </strong>
                                  ${
                                    post.isUpdated
                                      ? `<span class="small">(Bài viết đã cập nhật)</span>`
                                      : ''
                                  }
                              </div>
                              <div class="small">
                                  ${post.create_date} at ${post.create_time}
                              </div>
                          </div>
                      </a>
                      ${
                        json.currentUser.role === 'admin'
                          ? `
                      <div class="col-lg-2 col-1 d-flex align-items-center justify-content-end">
                      <div class="dropdown">
                          <span class="material-icons-two-tone post-dropdown-action" id="dropdownMenuButton1"
                              data-bs-toggle="dropdown" aria-expanded="false">
                              more_horiz
                          </span>
                          <ul class="dropdown-menu dropdown-menu-lg-end post_dropdown-menu"
                              aria-labelledby="dropdownMenuButton1">
                              <li class="me-1 ms-1">
                                  <a class="dropdown-item d-flex justify-content-start align-items-center create_post-updateModal" href="#"
                                      data-bs-toggle="modal" data-bs-target="#updatePostModal">
                                      <span class="material-icons-outlined me-2">
                                          settings
                                      </span>
                                      <span>Chỉnh sửa</span>
                                  </a>
                              </li>
                              <li class="me-1 ms-1">
                                  <a class="dropdown-item d-flex justify-content-start align-items-center post_delete_Btn"
                                      href="#">
                                      <span class="material-icons-outlined me-2">
                                          delete
                                      </span>
                                      <span>Xoá</span>
                                  </a>
                              </li>
                          </ul>
                      </div>
                  </div>
                      `
                          : ``
                      }
                      ${
                        post.user._id.toString() ===
                        json.currentUser._id.toString()
                          ? `
                          <div class="col-lg-2 col-1 ${
                            json.currentUser.role === 'admin' ? `d-none` : ``
                          } d-flex align-items-center justify-content-end">
                          <div class="dropdown">
                              <span class="material-icons-two-tone post-dropdown-action" id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown" aria-expanded="false">
                                  more_horiz
                              </span>
                              <ul class="dropdown-menu dropdown-menu-lg-end post_dropdown-menu"
                                  aria-labelledby="dropdownMenuButton1">
                                  <li class="me-1 ms-1">
                                      <a class="dropdown-item d-flex justify-content-start align-items-center create_post-updateModal" href="#"
                                          data-bs-toggle="modal" data-bs-target="#updatePostModal">
                                          <span class="material-icons-outlined me-2">
                                              settings
                                          </span>
                                          <span>Chỉnh sửa</span>
                                      </a>
                                  </li>
                                  <li class="me-1 ms-1">
                                      <a class="dropdown-item d-flex justify-content-start align-items-center post_delete_Btn"
                                          href="#">
                                          <span class="material-icons-outlined me-2">
                                              delete
                                          </span>
                                          <span>Xoá</span>
                                      </a>
                                  </li>
                              </ul>
                          </div>
                      </div>
                          `
                          : ``
                      }
                  </div>
              </div>
              <div class="post_body col-12">
                  <div class="d-flex flex-column col-12 mt-3 mb-3 ms-1">
                      <div id="post_caption_${
                        post._id
                      }" class="col-12 post_body-caption post_caption-lineclamp">${
            post.caption
          }</div>
                  </div>
                  ${
                    post.video
                      ? `<div class="col-12 mt-3">
                      <iframe class="post_video-iframe" id="video1" width="450" height="280"
                          src="http://www.youtube.com/embed/${post.video}?enablejsapi" frameborder="0" allowtransparency="true"
                          allowfullscreen></iframe>
                      </div> `
                      : ''
                  }
                  <div class="col-12 mt-1">
                      ${
                        post.image
                          ? `<img src='${post.image}' alt='image' class='img-post img-fluid post_img-viewImg' data-bs-toggle='modal'
                        data-bs-target='#post_img-viewImg_${post._id}'/>`
                          : ''
                      }
                  </div>
                  <div class="modal fade" id="post_img-viewImg_${
                    post._id
                  }" tabindex="-1" aria-labelledby="exampleModalLabel"
                      aria-hidden="true">
                      <div class="modal-dialog modal-lg modal-dialog-centered">
                          <div class=" modal-content">
                              <div class="modal-body d-flex flex-column justify-content-center">
                                  <div class="col-12 d-flex justify-content-end">
                                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div class="col-12">
                                      <img src="${
                                        post.image
                                      }" alt="image" class="img-post img-fluid post_img-viewImg">
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="post_footer col-12">
                  <div class="button_post container pb-2">
                      <hr>
                      <div class="row">
                          <div type="button" class="btn d-flex justify-content-center comments_expand col-6">
                              <div class="d-flex justify-content-center align-items-center">
                                  <div class="material-icons-outlined icon me-2">
                                      chat_bubble_outline
                                  </div>
                                  <div>Bình luận</div>
                              </div>
                          </div>
                          <div class="d-flex justify-content-center align-items-center col-6">
                              <div>${
                                post.comments ? post.comments.length : ''
                              } Bình luận</div>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="col-12 post_comments comment_container_${
                post._id
              } d-none" id="comment_${post._id}">
                  <div class="d-none" id="comment_loading_${post._id}">
                    <div class="d-flex justify-content-center">
                      <div class="spinner-border"  role="status">
                          <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                  <div class="comment_holder w-100 my-3"></div>
                  <div class="d-flex container-fluid pb-2">
                      <div class="d-flex justify-content-center align-items-center col-2">
                          <a class="post-comments_avatar" href="/profile/${
                            post.user._id
                          }">
                              <img src='${
                                json.currentUser.avatar
                              }' alt="avatar" 
                                  class="img-comment rounded-circle">
                          </a>
                      </div>
                      <div class="d-flex justify-content-center col-10">
                          <textarea type="text" rows="1" placeholder="Write a comment..."
                              class="form-control comment_box post_create-cmtInpt text_area_border"
                              oninput="onChangeTextArea()"></textarea>
                      </div>
                  </div>
              </div>
          </div>
        `);
        });
        $('.post_middle-spinner-loading').addClass('d-none');
        $('.post_middle-spinner-loading').removeClass('d-flex');
      });
  }

  // Lấy danh sách comment
  function getCommentByPost(postId) {
    fetch(`/api/comment/${postId}`)
      .then(res => res.json())
      .then(json => {
        if (json.ok) {
          const comment_holder = $(`.comment_container_${postId}`).find(
            '.comment_holder'
          );
          if (json.comment.length > 0) {
            // reset
            $(comment_holder).html('');
            json.comment.map(cmt => {
              $(comment_holder).append(`
                  <div class="post_comment col-12 d-flex justify-content-center mb-3" data-commentid="${cmt._id}">
                      <div class="d-flex flex-column container-fluid">
                          <div class="col-12 d-flex flex-row">
                              <div class="d-flex justify-content-center col-1">
                                  <a class="post-comments_avatar" href="/profile/${cmt.user._id}">
                                      <img src='${cmt.user.avatar}'
                                          alt="avatar" width="50" height="50" class="img-fluid rounded-circle">
                                  </a>
                              </div>
                              <div class="post_comment-container bd-highlight col-10">
                                  <div class="underline">
                                      <strong>
                                          ${cmt.user.fullname}
                                      </strong>
                                  </div>
                                  <div class="post_body-comments post_comments-lineclapm">
                                          ${cmt.content}
                                  </div>
                              </div>
                              <div class="col-lg-1 col-1 d-flex align-items-center">
                                      <div class="dropdown">
                                          <span class="material-icons-two-tone post-dropdown-action" id="dropdownMenuComment"
                                              data-bs-toggle="dropdown" aria-expanded="false">
                                              more_horiz
                                          </span>
                                          <ul class="dropdown-menu post_dropdown-menu"
                                              aria-labelledby="dropdownMenuComment">
                                              <li class="me-1 ms-1">
                                                  <a class="dropdown-item d-flex justify-content-start align-items-center post_comment-delBtn"
                                                      href="#">
                                                      <span class="material-icons-outlined me-2">
                                                          delete
                                                      </span>
                                                      <span>Xoá</span>
                                                  </a>
                                              </li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          <div class="col-12">
                              <div class="d-flex justify-content-end align-items-center me-5">
                                  <small class="underline">${cmt.create_time}</small>
                              </div>
                          </div>
                      </div>
                  </div>
              `);
            });
          } else {
            // comments length == 0
            $(comment_holder).html('');
          }
        } else {
          console.log(json.msg);
        }
      });
  }

  // Get comment by post id
  $(document).on('click', '.comments_expand', async e => {
    e.preventDefault();
    // Tiền xử lí
    const post_id = $(e.target).closest('.post_id').attr('data-postid');
    console.log(post_id);

    // Show comment-container
    $(`.comment_container_${post_id}`).removeClass('d-none');
    // prevent multiple click
    $(e.currentTarget).prop('disabled', true);

    getCommentByPost(post_id);
  });

  $('.post_create-cmtInpt').on('input', e => {
    //auto resize text area
    const tx = $('.comment_box');

    for (let i = 0; i < tx.length; i++) {
      console.log(tx[i].scrollHeight);
      tx[i].setAttribute(
        'style',
        'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;'
      );
      tx[i].addEventListener('input', OnInput, false);
    }
    function OnInput() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }
  });

  // ============= COMMENT =====================
  // Prevent space at first
  $('.create_post-input').on('keypress', function (e) {
    if (e.which === 32 && !this.value.length) e.preventDefault();
  });
  // Tạo bài viết
  $('.create_post-submitBtn').on('click', e => {
    e.preventDefault();
    $('.create_post-submitBtn').addClass('disabled');
    let video = $('.create_post-video-input').val();
    let image = $('.create_post-image')[0].files[0];
    let caption = $('.create_post-input').val();

    // Lấy youtube id
    function youtube_parser(url) {
      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    }
    if (youtube_parser(video) !== false) {
      video = youtube_parser(video);
    } else {
      video = '';
    }
    let formData = new FormData();

    // check size or type here with upload.getSize() and upload.getType()
    if (image !== undefined) {
      let fileType = image['type'];
      let validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (image.size / (1024 * 1024).toFixed(2) >= 10) {
        Swal.fire({
          title: 'Dung lượng ảnh lớn hơn 10MB',
          icon: 'error',
        });
        $('.create_post-submitBtn').removeClass('disabled');
        return false;
      }
      if (!validImageTypes.includes(fileType)) {
        Swal.fire({
          title: 'Ảnh đính kèm không hợp lệ',
          icon: 'error',
        });
        $('.create_post-submitBtn').removeClass('disabled');
        return false;
      }
      formData.append('image', image, image.name);
    }

    formData.append('caption', caption);
    formData.append('video', video);
    if (!image && !video && !caption) {
      Swal.fire({
        title: 'Hãy viết nội dung bài viết hoặc chèn thêm đính kèm',
        icon: 'error',
      });
      $('.create_post-submitBtn').removeClass('disabled');
      return false;
    }

    fetch('/api/post', {
      method: 'POST',
      async: true,
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // If auth success, redirect to home
        if (data.ok != false) {
          getPost();
          getPostsNotification();
        }
        // return (window.location.href = '/');
      })
      .finally(() => {
        //close modal
        const createModalEl = $('#createPostModal');
        const createModal = bootstrap.Modal.getOrCreateInstance(createModalEl);
        createModal.hide();
        //
        $('.create_post-submitBtn').removeClass('disabled');
      })
      .catch(err => {
        console.log(err);
      });
  });

  // Cập nhật bài viết (Render phần modal của cập nhật)
  $(document).on('click', '.create_post-updateModal', async e => {
    let postId = $(e.target).closest('.post_id').data('postid');
    fetch(`/api/post/${postId}`)
      .then(res => res.json())
      .then(json => {
        if (!json.ok) console.log(json.msg);
        [json.post].map(async pst => {
          $('#updatePostModal').attr('data-id', pst._id);

          // Lấy caption trong bài viết
          $('#updatePostModal').find('.create_post-input').val(pst.caption);

          // Lấy link youtube và kiểm tra link youtube trong bài viết
          $('#updatePostModal').find('.create_post-video-input').val(pst.video);
        });
      });
  });

  // Cập nhật bài viết
  $(document).on('click', '#updatePostModal .create_post-updateBtn', e => {
    e.preventDefault();

    // disable button
    $('#updatePostModal .create_post-updateBtn').prop('disabled', false);

    const updatePostModal = $(e.target).closest('#updatePostModal');
    const postId = $(updatePostModal).attr('data-id');
    let caption = $(updatePostModal).find('.create_post-input').val();
    let image = $('.create_post-image')[0].files[0];
    let video = $(updatePostModal).find('.create_post-video-input').val();

    // Lấy youtube id
    function youtube_parser(url) {
      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    }
    const formData = new FormData();
    formData.append('caption', caption);
    if (youtube_parser(video) !== false) {
      video = youtube_parser(video);
    }

    // check size or type here with upload.getSize() and upload.getType()
    if (image !== undefined) {
      if (image.size / (1024 * 1024).toFixed(2) >= 10) {
        Swal.fire({
          title: 'Dung lượng ảnh lớn hơn 10MB',
          icon: 'error',
        });
        $('.create_post-updateBtn').removeClass('disabled');
        return false;
      }
      formData.append('image', image, image.name);
    }
    formData.append('video', video);

    if (!image && !video && !caption) {
      Swal.fire({
        title: 'Hãy viết nội dung bài viết hoặc chèn thêm đính kèm',
        icon: 'error',
      });
      $('.create_post-updateBtn').removeClass('disabled');
      return false;
    }

    fetch(`/api/post/${postId}`, {
      method: 'PUT',
      async: true,
      body: formData,
    })
      .then(({ ok, msg }) => {
        console.log(msg);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'success',
          title: 'Cập nhật bài viết thành công !',
        });
        if (ok) {
          getPost();
          getPostsNotification();
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title:
              'Người dùng không hợp lệ hoặc người dùng không có quyền cập nhật bài viết này',
          });
        }
      })
      .finally(() => {
        $('#updatePostModal').modal('hide');

        // Un-disable button
        $('#updatePostModal .create_post-updateBtn').prop('disabled', false);
      });
  });

  // Xoá bài viết
  $(document).on('click', '.post_delete_Btn', async e => {
    e.preventDefault();
    let postId = $(e.target).closest('.post_id').data('postid');
    Swal.fire({
      title: 'Xoá bài viết này ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0e6286',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ',
      keydownListenerCapture: true,
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        fetch('/api/post/' + postId, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(({ ok, msg }) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: result ? 'success' : 'error',
              title: msg,
            });
            if (ok) {
              getPost();
              getPostsNotification();
            } else {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: msg,
              });
            }
          });
      } else {
        return;
      }
    });
  });

  // Bấm để mở rộng phần thêm ảnh vào post
  $('.create_post-addImgBtn').on('click', e => {
    e.preventDefault();
    $('.create_post-input-img').removeClass('d-none');
    $('.create_post-addImgBtn').addClass('d-none');
  });

  // Bấm để mở rộng phần thêm video vào post
  $('.create_post-addVideoBtn').on('click', e => {
    e.preventDefault();
    $('.create_post-input-video').removeClass('d-none');
    $('.create_post-addVideoBtn').addClass('d-none');
  });

  $('.btn-close').click(e => {
    e.preventDefault();
    $('.create_post-input-img').addClass('d-none');
    $('.create_post-addImgBtn').removeClass('d-none');
  });

  // Xem ảnh khi tạo bài viết hoặc chỉnh sửa
  $('.add_img_btn').on('click', e => {
    document.getElementById('file').click();
    let postId = $(e.target).closest('.post_id').data('postid');
    $('.create_post-image').on('change', e => {
      let reader = new FileReader();
      reader.onload = function () {
        $('.post_image-Review').attr('src', reader.result);
        //output.src = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
      $('.post_image-Review').addClass('d-flex');
      $('.post_image-Review').removeClass('d-none');
      $('.post_image-Container').removeClass('d-none');
      $('.create_post-input-img').addClass('d-none');
    });

    $('.btn_remove_img').on('click', e => {
      e.preventDefault();
      $('.post_image-Review').removeAttr('src');
      document.getElementById('file').value = null;
      $('.post_image-Review').addClass('d-none');
      $('.post_image-Container').addClass('d-none');
      $('.create_post-input-img').removeClass('d-none');
    });
  });

  // Các modal của Bài viết
  $('#createPostModal').modal({
    backdrop: 'static',
    keyboard: false,
  });

  $('.updatePostModal').modal({
    backdrop: 'static',
    keyboard: false,
  });

  // Tạo bình luận
  $(document).on('keypress', '.post_create-cmtInpt', e => {
    let postId = $(e.target).closest('.post_id').data('postid');
    if (e.which == 13 && !e.shiftKey) {
      e.preventDefault();
      const comment = $(e.target).val();
      fetch('/api/comment/', {
        method: 'POST',
        body: new URLSearchParams({
          content: comment,
          postId: postId,
        }),
      })
        .then(res => res.json())
        .then(json => {
          if (!json.ok) {
            console.log('error comment', json.msg);
            return;
          }
          getCommentByPost(postId);
        })
        .finally(() => {
          console.log($(e.target));
          // clear comment
          $(e.target).val('');
        });
    }
  });

  // Xóa bình luận
  $(document).on('click', '.post_comment-delBtn', e => {
    e.preventDefault();
    let postId = $(e.target).closest('.post_id').data('postid');
    let commentId = $(e.target).closest('.post_comment').data('commentid');
    console.log(commentId);
    Swal.fire({
      title: 'Xoá bình luận này ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0e6286',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ',
      keydownListenerCapture: true,
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        fetch('/api/comment/' + commentId, {
          method: 'DELETE',
          body: new URLSearchParams({ postId }),
        })
          .then(res => res.json())
          .then(json => {
            console.log(json);
            if (json.ok) {
              getCommentByPost(postId);

              Swal.fire({
                title: 'Xóa bình luận thành công',
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Bạn không có quyền xoá bình luận này',
                icon: 'error',
              });
            }
          });
      }
    });
  });

  // ================ Kết thúc Section Jquery liên quan đến bài viết
  // ================ Jquery liên quan đến phần Thông báo

  // Lấy danh sách thông báo
  function getAnnounces() {
    return fetch('/api/announcement')
      .then(res => res.json())
      .then(json => {
        $('.announce_middle-container').html('');
        $('.announce_middle-spinner-loading').addClass('d-flex');
        $('.announce_middle-spinner-loading').removeClass('d-none');
        json.announces.map(announce => {
          $('.announce_middle-container').append(`
          <div class="announce_id announces_container container d-lg-flex flex-column col-12 p-0 mb-4" data-userid="${
            announce.user._id
          }" data-announceid="${announce._id}">
          <div class="post_header col-12 mt-3">
            <div class="d-flex row bd-highlight">
              <a class="col-lg-1 col-2 d-flex align-items-center justify-content-end"
                  href="/profile/${announce.user._id}">
                  <img src='${
                    announce.user.avatar
                  }' alt="avatar" width="50" height="50"
                      class="img-fluid post-comments_avatar">
              </a>
              <a class="row post_header-userInfo col-9 col-lg-10 d-flex align-items-center justify-content-center p-0"
                  href="/profile/${announce.user._id}">
                  <div class="p-2 bd-highlight">
                      <div>
                          <strong>
                              ${announce.user.fullname}
                          </strong>
                          ${
                            announce.isUpdated
                              ? `<span class="small">(Thông báo đã cập nhật)</span>`
                              : ''
                          }
                      </div>
                      <div class="small">
                          ${announce.create_date} at ${announce.create_time}
                      </div>
                  </div>
              </a>
              ${
                json.currentUser.role === 'admin'
                  ? `
              <div class="col-lg-1 col-1 d-flex align-items-center justify-content-end">
              <div class="dropdown">
                  <span class="material-icons-two-tone post-dropdown-action" id="dropdownMenuButton1"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      more_horiz
                  </span>
                  <ul class="dropdown-menu dropdown-menu-lg-end post_dropdown-menu"
                      aria-labelledby="dropdownMenuButton1">
                      <li class="me-1 ms-1">
                          <a class="dropdown-item d-flex justify-content-start align-items-center announce_update-Btn" href="#"
                              data-bs-toggle="modal" data-bs-target="#updateAnnounceModal">
                              <span class="material-icons-outlined me-2">
                                  settings
                              </span>
                              <span>Chỉnh sửa</span>
                          </a>
                      </li>
                      <li class="me-1 ms-1">
                          <a class="dropdown-item d-flex justify-content-start align-items-center announce_delete_Btn"
                              href="#">
                              <span class="material-icons-outlined me-2">
                                  delete
                              </span>
                              <span>Xoá</span>
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
              `
                  : ''
              }
              ${
                announce.user._id.toString() === json.currentUser._id.toString()
                  ? `
              <div class="col-lg-1 ${
                json.currentUser.role === 'admin' ? `d-none` : ``
              }  col-1 d-flex align-items-center justify-content-end">
              <div class="dropdown">
                  <span class="material-icons-two-tone post-dropdown-action" id="dropdownMenuButton1"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      more_horiz
                  </span>
                  <ul class="dropdown-menu dropdown-menu-lg-end post_dropdown-menu"
                      aria-labelledby="dropdownMenuButton1">
                      <li class="me-1 ms-1">
                          <a class="dropdown-item d-flex justify-content-start align-items-center announce_update-Btn" href="#"
                              data-bs-toggle="modal" data-bs-target="#updateAnnounceModal">
                              <span class="material-icons-outlined me-2">
                                  settings
                              </span>
                              <span>Chỉnh sửa</span>
                          </a>
                      </li>
                      <li class="me-1 ms-1">
                          <a class="dropdown-item d-flex justify-content-start align-items-center announce_delete_Btn"
                              href="#">
                              <span class="material-icons-outlined me-2">
                                  delete
                              </span>
                              <span>Xoá</span>
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
              `
                  : ``
              }
            </div>
          </div>
            <div class="post_body col-12 mb-3">
              <div class="d-flex flex-column col-12 mt-3">
                <div class="d-flex col-12 justify-content-start align-items-center announce_header-title">
                    <h3>${announce.title}</h3>
                </div>
              </div>
              <div class="d-flex flex-column col-12 mt-3">
                <div id="announce_content_${
                  announce._id
                }" class="col-12 announce_body-content announce_content-lineclamp">
                ${announce.content}
                </div>
              </div>
              <div class="d-flex flex-column col-12 mt-3">
                <div class="col-12 announce_body-content announce_content-lineclamp">
                ${
                  announce.sections !== null
                    ? `<strong>Phòng ban: </strong>` + announce.sections.name
                    : ``
                }
                </div>
              </div>
            </div>
          </div>
        `);
        });
        $('.announce_middle-spinner-loading').addClass('d-none');
        $('.announce_middle-spinner-loading').removeClass('d-flex');
      });
  }

  // Xem thông báo theo ID
  $(document).on('click', '.announce_header-title', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('announceid');
    window.location.href = '/announcement/' + announceId;
  });

  let expandAnnounceCaption = false;
  $(document).on('click', '.announce_body-content', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('announceid');
    if (expandAnnounceCaption) {
      expandAnnounceCaption = false;
      $('#announce_content_' + announceId).addClass(
        'announce_content-lineclamp'
      );
    } else {
      expandAnnounceCaption = true;
      $('#announce_content_' + announceId).removeClass(
        'announce_content-lineclamp'
      );
    }
  });

  // Tạo thông báo
  $('.create_announce-submitBtn').on('click', e => {
    e.preventDefault();
    let announceSectionId = $('input[name="radioSectionId"]:checked').val();
    let announceTitle = $('.create_announce-title').val();
    let announceContent =
      CKEDITOR.instances['create_announce-content'].getData();
    if (!announceTitle || announceContent.length <= 61 || !announceSectionId) {
      Swal.fire({
        title: 'Hãy viết tiêu đề nội dung thông báo và chọn Phòng ban',
        icon: 'error',
      });
      $('.create_post-submitBtn').removeClass('disabled');
      return false;
    }

    fetch('/api/announcement', {
      method: 'POST',
      async: true,
      body: new URLSearchParams({
        title: announceTitle,
        content: announceContent,
        sectionsId: announceSectionId,
      }),
    })
      .then(res => res.json())
      .then(({ ok, msg }) => {
        if (ok) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: msg,
            icon: 'success',
          });
          getAnnounces();
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: msg,
            icon: 'error',
          });
        }
      })
      .finally(() => {
        $('#createAnnounceModal').modal('hide');
      });
  });

  // Cập nhật thông báo (Render modal)
  $(document).on('click', '.announce_update-Btn', async e => {
    let announceId = $(e.target).closest('.announce_id').data('announceid');
    let userId = $(e.target).closest('.announce_id').data('userid');
    fetch('/api/announcement/' + announceId)
      .then(res => res.json())
      .then(json => {
        if (!json.ok) console.log(json.msg);
        [json.announce].map(async ann => {
          $('#updateAnnounceModal').attr('data-id', ann._id);

          $('#updateAnnounceModal')
            .find('.update_announce-title')
            .val(ann.title);

          $('#updateAnnounceModal').find('.announce_update-radio').html('');

          fetch('/api/user/' + userId)
            .then(res => res.json())
            .then(json => {
              json.user[0].topics.map(topics => {
                $('#updateAnnounceModal').find('.announce_update-radio')
                  .append(`
                        <div class="form-check">
                            <input ${
                              topics._id.toString() === ann.sections
                                ? `checked`
                                : ``
                            } name="radioSectionId" class="form-check-input" type="radio" value="${
                  topics._id
                }">
                            <label class="form-check-label">
                            ${topics.name}
                            </label>
                        </div>
          `);
              });
            });
        });
      });

    // fetch(`/api/announcement/${announceId}`)
    //   .then(res => res.json())
    //   .then(json => {
    //     if (!json.ok) console.log(json.msg);
    //     [json.announce].map(async ann => {
    //       $('#updateAnnounceModal').attr('data-id', ann._id);

    //       $('#updateAnnounceModal')
    //         .find('.update_announce-content')
    //         .attr('name', `update_announce-content_${ann._id}`);

    //       $('#updateAnnounceModal')
    //         .find('.update_announce-title')
    //         .val(ann.title);

    //       let announceContent =
    //         CKEDITOR.instances[`update_announce-content_${ann._id}`].getData();
    //       // $('#updateAnnounceModal')
    //       //   .find('.update_announce-content')
    //       //   .attr('name', `update_announce-content_${ann._id}`)
    //       //   .CKEDITOR.instances[`update_announce-content_${ann._id}`].getData();
    //       // $('#updateAnnounceModal')
    //       //   .find('.update_announce-content')
    //       //   .val(announceContent);
    //       console.log(announceContent);
    //     });
    //     // [json.post].map(async pst => {
    //     //   $('#updatePostModal').attr('data-id', pst._id);

    //     //   // Lấy caption trong bài viết
    //     //   $('#updatePostModal').find('.create_post-input').val(pst.caption);

    //     //   // Lấy link youtube và kiểm tra link youtube trong bài viết
    //     //   $('#updatePostModal').find('.create_post-video-input').val(pst.video);
    //     // });
    //   });
  });

  // Cập nhật thông báo
  $(document).on('click', '.update_announce-submitBtn', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('id');
    let announceTitle = $('#update_announce-title').val();
    let announceContent =
      CKEDITOR.instances['update_announce-content'].getData();
    let announceSectionId = $('input[name="radioSectionId"]:checked').val();

    if (!announceTitle || announceContent.length <= 61 || !announceSectionId) {
      Swal.fire({
        title: 'Hãy viết tiêu đề nội dung thông báo và chọn Phòng ban',
        icon: 'error',
      });
      $('.create_post-submitBtn').removeClass('disabled');
      return false;
    }

    fetch('/api/announcement/' + announceId, {
      method: 'PUT',
      async: true,
      body: new URLSearchParams({
        title: announceTitle,
        content: announceContent,
        sectionsId: announceSectionId,
      }),
    })
      .then(res => res.json())
      .then(({ ok, msg }) => {
        if (ok) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: msg,
            icon: 'success',
          });
          getAnnounces();
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: msg,
            icon: 'error',
          });
        }
      })
      .finally(() => {
        $('#updateAnnounceModal').modal('hide');
      });
  });

  // Xoá thông báo
  $(document).on('click', '.announce_delete_Btn', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('announceid');
    console.log(announceId);
    Swal.fire({
      title: 'Xoá thông báo này ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0e6286',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ',
      keydownListenerCapture: true,
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        fetch('/api/announcement/' + announceId, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(({ ok, msg }) => {
            if (ok) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                title: msg,
                icon: 'success',
              });
              getAnnounces();
            } else {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                title: msg,
                icon: 'error',
              });
            }
          });
      } else {
        return;
      }
    });
  });
});

// ------------------- MANAGEMENT --------------------------------------

if (window.location.href.indexOf('manage') > -1) {
  // Window ready get sutdent list
  $(window).ready(() => {
    $('.btn-sw--student').addClass('btn--active');
    getUserList('student');
  });
  // Get faculty list on button click
  // one: only execute function once
  $('.btn-sw--faculty').one('click', event => {
    // $(".btn-sw--faculty").toggleClass("btn--active").prop("disabled",true)
    // $(".btn-userType-switch")
    getUserList('faculty');
  });

  $('.btn-sw--student').on('click', event => {
    if ($('.btn-sw--faculty').hasClass('btn--active'))
      $('.btn-sw--faculty').removeClass('btn--active');
    $(event.target).addClass('btn--active');
  });

  $('.btn-sw--faculty').on('click', event => {
    if ($('.btn-sw--student').hasClass('btn--active'))
      $('.btn-sw--student').removeClass('btn--active');
    $(event.target).addClass('btn--active');
  });

  $('.btn-create-faculty-account').on('click', event => {});

  // $(".btn-sw--faculty").on("click", (event) =>{
  //     $(".btn-sw--faculty").toggleClass("btn--active")
  // })
  // Get user list
  function getUserList(role) {
    fetch(`/api/user?role=${role}`)
      .then(res => res.json())
      .then(json => {
        if (!json.ok) {
          console.log(json.msg);
          return;
        }
        console.log(json.user);
        if (role === 'student') {
          // Reset
          $('.table-student').find('tbody').html('');
          json.user.map(user => {
            // Get student list
            $('.table-student').find('tbody').append(`
                          <tr class="admin_tr_mgmt" style="font-size: 18px;">
                              <td>
                                  <div>
                                      <img src="${
                                        user.avatar
                                      }" alt="Avatar" class="admin_avatar_mgmt">
                                  </div>
                              </td>
                              <td>
                                  <div>${user.fullname}</div>
                              </td>
                              <td class="admin_td_studentId">
                                  <div>
                                      ${user.email.split('@')[0]}
                                  </div>
                              </td>
                              <td class="admin_td_class">
                                  <div>
                                      ${user.class ? user.class : '-'}
                                  </div>
                              </td>
                              <td class="admin_td_faculty">
                                  <div>
                                      ${user.unit ? user.unit.name : '-'}
                                  </div>
                              </td>
                              <td>
                                  <div class="row container">
                                      <div class="col-12 mngt-act-btn mngt-profile-user"
                                          data-bs-toggle="tooltip" title="Xem trang người dùng">
                                          <a class="m-3 d-flex justify-content-center"
                                              href="/profile/${user._id}">
                                              <span class="material-icons-outlined">
                                                  account_circle
                                              </span>
                                              <p class="m-0 ms-2">Profile</p>
                                          </a>
                                      </div>
                                  </div>
                              </td>
                          </tr>
                      `);
          });
        } else if (role === 'faculty') {
          // Reset
          $('.table-faculty').find('tbody').html('');
          json.user.map(user => {
            // Get faculty list
            $('.table-faculty').find('tbody').append(`
                          <tr class="admin_tr_mgmt" style="font-size: 18px;" data-id="${
                            user._id
                          }">
                              <td>
                                  <div>
                                      <img src="${
                                        user.avatar
                                          ? user.avatar
                                          : '../../image/tdt.jpg'
                                      }" alt="Avatar" class="admin_avatar_mgmt">
                                  </div>  
                              </td>
                              <td>
                                  <div>${user.username}</div>
                              </td>
                              <td>
                                  <div>${
                                    user.unit.unit == 'central'
                                      ? 'Phòng'
                                      : 'Khoa'
                                  }</div>
                              </td>
                              <td class="admin_td_faculty">
                                  <div>${user.unit.name}</div>
                              </td>
                              <td class="tools">
                                  <a class="me-3 btn-profile" href="/profile/${
                                    user._id
                                  }"
                                      style="cursor:pointer; color: green;">
                                      <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                          title="Profile">
                                          account_circle
                                      </span>
                                  </a>
                                  <a class="me-3 btn-delete" style="cursor:pointer; color: red">
                                      <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                          title="Xoá người dùng" style="pointer-events: none">
                                          delete
                                      </span>
                                  </a>
                                  <a class="me-3 btn-update" style="cursor:pointer; color: coral"
                                      data-bs-toggle="modal" data-bs-target="#updateFacultyAccountModal">
                                      <span class="material-icons-outlined" data-bs-toggle="tooltip"
                                          title="Cập nhật thông tin người dùng" style="pointer-events: none">
                                          topic
                                      </span>
                                  </a>
                              </td>
                          </tr>
                      `);
          });
        }
      });
  }

  // createFacultyAccountModal map section-select based on unit-select value
  setModal('#createFacultyAccountModal');
  setModal('#updateFacultyAccountModal');

  function setModal(element) {
    $(element)
      .find('select.unit-select')
      .on('change', event => {
        const unitSelect = $(element).find('select.unit-select');
        const sectionSelect = $(element).find('select.section-select');
        const topicSelect = $(element).find('.topic-select');
        let unitSelectVal = $(unitSelect).val();
        console.log(unitSelectVal);
        // reset
        $(sectionSelect).html('');
        $(topicSelect)
          .html('')
          .append(
            "<span class='topic-select__title'>Chọn chủ đề quản lí</span>"
          );

        mapSection(unitSelectVal, sectionSelect, topicSelect);
      });
  }

  // Create user
  $('#createFacultyAccount').on('submit', event => {
    event.preventDefault();

    const inputEmail = $('.inputEmail').val();
    const inputPassword = $('.inputPassword').val();
    const sectionSelect = $('.section-select').val();
    const topicSelect = $('#createFacultyAccountModal').find('.topic-select');

    console.log(sectionSelect);

    // get checked checkbox
    let selectedTopic = [];
    $(topicSelect)
      .find('input[type=checkbox]:checked')
      .each((index, item) => {
        selectedTopic.push($(item).val());
      });
    console.log(selectedTopic);

    fetch('/api/user', {
      method: 'POST',
      body: new URLSearchParams({
        email: inputEmail,
        password: inputPassword,
        role: 'faculty',
        unit: sectionSelect,
        topics: selectedTopic,
      }),
    })
      .then(res => res.json())
      .then(({ ok, msg, data }) => {
        createToast(ok, msg);
        if (ok) {
          getUserList('faculty');
        }
      })
      .finally(() => {
        $('#createFacultyAccountModal').modal('hide');
        // Reset form
        document.getElementById('createFacultyAccount').reset();
        // Reset section select and topic select
        $(sectionSelect).html('');
        $(topicSelect)
          .html('')
          .append(
            "<span class='topic-select__title'>Chọn chủ đề quản lí</span>"
          );
      });
  });

  // Render update user modal
  $(document).on('click', '.btn-update', event => {
    const userId = $(event.target).closest('.admin_tr_mgmt').attr('data-id');

    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (!json.ok) alert(json.msg);
        json.user.map(async usr => {
          $('#updateFacultyAccountModal').attr('data-id', usr._id);
          $('#updateFacultyAccountModal').find('.inputEmail').val(usr.email);
          console.log(usr.unit.unit);
          $('#updateFacultyAccountModal')
            .find('.unit-select')
            .val(usr.unit.unit);

          const sectionSelect = $('#updateFacultyAccountModal').find(
            'select.section-select'
          );
          const topicSelect = $('#updateFacultyAccountModal').find(
            '.topic-select'
          );

          // reset
          $(topicSelect)
            .html('')
            .append(
              "<span class='topic-select__title'>Chọn chủ đề quản lí</span>"
            );

          await mapSection(usr.unit.unit, sectionSelect, topicSelect);

          $(sectionSelect).val(usr.unit._id);
          console.log('sectionSelect COMPELTE!');

          console.log('TOPIC', usr.topics);

          if (usr.topics) {
            $(topicSelect)
              .find('.form-check .form-check-input')
              .each((index, item) => {
                usr.topics.forEach(topic => {
                  if ($(item).val() === topic._id) {
                    $(item).prop('checked', true);
                  }
                });
              });
          }
        });
      });
  });

  //  Update user
  $(document).on('click', '#updateFacultyAccountModal .btn-submit', event => {
    event.preventDefault();
    const updateModal = $(event.target).closest('#updateFacultyAccountModal');
    const userId = $(updateModal).attr('data-id');

    const inputEmail = $(updateModal).find('.inputEmail').val();
    const inputPassword = $(updateModal).find('.inputPassword').val();
    const sectionSelect = $(updateModal).find('.section-select').val();
    const topicSelect = $(updateModal).find('.topic-select');

    let selectedTopic = [];
    $(topicSelect)
      .find('input[type=checkbox]:checked')
      .each((index, item) => {
        selectedTopic.push($(item).val());
      });

    console.log('ITEMS', inputEmail);
    console.log(inputPassword.length);
    console.log(sectionSelect);
    console.log(topicSelect);
    console.log(selectedTopic);

    fetch(`/api/user/${userId}`, {
      method: 'PUT',
      body: new URLSearchParams({
        email: inputEmail,
        password: inputPassword.length == 0 ? null : inputPassword,
        unit: sectionSelect,
        topics: selectedTopic,
      }),
    })
      .then(res => res.json())
      .then(({ ok, msg }) => {
        createToast(ok, msg);
        if (ok) {
          getUserList('faculty');
        }
      })
      .finally(() => {
        $('#updateFacultyAccountModal').modal('hide');
      });
  });

  // Delete user
  $(document).on('click', '.btn-delete', async event => {
    event.preventDefault();

    // prompt user confirm
    const isConfirmed = await createConfirmModal();
    console.log('outter', isConfirmed);
    if (isConfirmed) {
      const userId = $(event.target).closest('.admin_tr_mgmt').attr('data-id');
      console.log(userId);
      fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(({ ok, msg }) => {
          createToast(ok, msg);
          if (ok) {
            getUserList('faculty');
          }
        });
    } else {
      return;
    }
  });

  // Map section function
  async function mapSection(unit, sectionSelect, topicSelect) {
    //  return a promise
    return fetch(`/api/section?unit=${unit}`)
      .then(res => res.json())
      .then(({ ok, sections }) => {
        console.log(sections);
        // sections
        sections.map(item => {
          $(sectionSelect).append(`
              <option value=${item._id}>${item.name}</option>
          `);
        });
        // topics
        sections.map((item, index) => {
          $(topicSelect).append(`
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="${item._id}" id="cb${index}">
                      <label class="form-check-label" for="cb${index}">
                      ${item.name}
                      </label>
                  </div>
              `);
        });
      })
      .then(() => {
        console.log('mapSection COMPLETE');
      });
  }

  // Button click sẽ chèn class active
  let mngt_btn_student = $('.mngt_btn_student');
  let mngt_btn_faculty = $('.mngt_btn_faculty');
  $('.mngt_btn_student').on('click', e => {
    mngt_btn_faculty.removeClass('active');
    mngt_btn_student.addClass('active');
  });

  $('.mngt_btn_faculty').on('click', e => {
    mngt_btn_student.removeClass('active');
    mngt_btn_faculty.addClass('active');
  });

  // Toast message
  function createToast(result, msg) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: result ? 'success' : 'error',
      title: msg,
    });
  }

  // modalConfirm
  async function createConfirmModal() {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xóa người dùng',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    });

    return result.isConfirmed;
  }
}

//===========================END MANAGEMENT==============================================

// ========================= User update ================================================

if (window.location.href.indexOf('update-info') > -1) {
  // Render section-select
  $(window).ready(() => {
    if ($('.section-select')) {
      mapSection($('.section-select'));
    }
  });

  // Map section function
  async function mapSection(sectionSelect) {
    //  return a promise
    return fetch(`/api/section?unit=faculty`)
      .then(res => res.json())
      .then(({ ok, sections }) => {
        console.log(sections);
        // Get selected option
        const selected_option = $(sectionSelect).attr('data-selected');
        // sections
        sections.map(item => {
          $(sectionSelect).append(`
              <option value=${item._id} ${
            selected_option == item._id && 'selected'
          }>${item.name}</option>
          `);
        });
      })
      .then(() => {
        console.log('mapSection COMPLETE');
      });
  }

  // Get user avatar
  $('.avatar-upload-button').on('click', e => {
    $('.avatar_upload').click();
  });

  // Student form submit handler

  $('#updateUserInfo').on('submit', e => {
    e.preventDefault();

    $("#updateUserInfo button[type*='submit']").addClass('disabled');

    const userId = $('#updateUserInfo').attr('data-id');
    const role = $('#updateUserInfo').attr('data-role');

    const msgDisplay = $('.msg-display');
    $(msgDisplay).removeClass().addClass('msg-display').html('');

    // Faculty form submit handler
    if (role == 'faculty') {
      const password = $('.user-password').val();
      const passwordConfirm = $('.user-password-confirm').val();

      console.log(password);
      console.log(passwordConfirm);

      let errorFlag = true;
      // reset

      // if(password != passwordConfirm){
      //     errorFlag = false
      //     msgMap("Mật khẩu không trùng khớp")
      //     $(msgDisplay).addClass("msg-display--error").show()
      // }

      console.log(errorFlag);
      if (errorFlag) {
        fetch(`/profile/faculty/${userId}`, {
          method: 'POST',
          body: new URLSearchParams({
            password,
            passwordConfirm,
          }),
        })
          .then(res => res.json())
          .then(json => {
            console.log(json);
            if (!json.ok) {
              msgMap(json.msg);
              $(msgDisplay).addClass('msg-display--error').show();
              return;
            }
            msgMap(json.msg);
            $(msgDisplay).addClass('msg-display--success').show();
          })
          .finally(() => {
            $("#updateUserInfo button[type*='submit']").removeClass('disabled');
          });
      }
    } else if (role == 'student') {
      const userFullName = $('.user-fullName').val();
      const userClass = $('.user-class').val();
      const section = $('.section-select').val();

      const image = $('.avatar_upload')[0].files[0];

      console.log(userFullName, userClass, section, image);

      const formData = new FormData();
      formData.append('fullname', userFullName);
      formData.append('class', userClass);
      formData.append('unit', section);
      formData.append('image', image);

      console.log('formData', formData);
      fetch(`/profile/student/${userId}`, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(json => {
          msgMap(json.msg);
          if (!json.ok) {
            $(msgDisplay).addClass('msg-display--error').show();
            return;
          } else {
            $(msgDisplay).addClass('msg-display--success').show();
          }
        })
        .finally(() => {
          $("#updateUserInfo button[type*='submit']").removeClass('disabled');
        });
    }
  });

  function msgMap(msg) {
    $('.msg-display').append(`
              <li>${msg}</li>   
      `);
  }

  // Review image after upload
  const image = $('.img_holder > img');
  const image_input = $('.avatar_upload');

  $(image_input).on('change', function (e) {
    var reader = new FileReader();
    reader.onload = function () {
      $(image).attr('src', reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  });
}

// ============================================= END user update ==================================
