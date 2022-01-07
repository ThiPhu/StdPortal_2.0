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

  // ================ Jquery liên quan đến bài viết
  // Bấm vào comment btn sẽ hiện các comment dưới bài viết ( Phần jquery này sẽ render script cho template )
  // Các script liên quan CRUD đến bình luận sẽ ở đây

  // $('.comments_expand').one('click', e => {
  //   e.preventDefault();

  //   // Tạo bình luận
  //   let createCommentScripts = `<script type="text/javascript">
  //     $('.post_create-cmtInpt').keypress(e => {
  //       let postId = $(e.target).closest('.post_id').data('postid');
  //       if (e.which == 13 && !e.shiftKey) {
  //         e.preventDefault();
  //         const comment = $(e.target).val();
  //         fetch('/api/comment/', {
  //           method: 'POST',
  //           body: new URLSearchParams({
  //             content: comment,
  //             postId: postId,
  //           }),
  //         })
  //           .then(res => res.json())
  //           .then(({ ok, msg, at }) => {
  //             // If auth success, redirect to home
  //             return window.location.reload();
  //           });
  //       }
  //     });
  //   </script>`;

  //   // Cập nhật bình luận
  //   let updateCommentScripts = `<script type="text/javascript">
  //   $('.update_comment-Btn').on('click', e => {
  //     e.preventDefault();
  //     let postId = $(e.target).closest('.post_id').data('postid');
  //     let commentId = $(e.target).closest('.post_comment').data('commentid');
  //     let content = document.querySelector('#update_comment-input_' + commentId).value;
  //     fetch('/api/comment/' + commentId, {
  //       method: 'PUT',
  //       async: true,
  //       body: new URLSearchParams({
  //         content,
  //         postId
  //       }),
  //     }).then(data => {
  //       if (data.status !== 500) {
  //         Swal.fire({
  //           title: 'Cập nhật bình luận thành công',
  //           icon: 'success',
  //         });
  //         return setTimeout(function () {
  //           window.location.reload();
  //         }, 800);
  //       } else {
  //         Swal.fire({
  //           title: 'Bạn không có quyền cập nhật bình luận này',
  //           icon: 'error',
  //         });
  //       }
  //     });
  //   });
  //   </script>`;

  //   // Xoá bình luận
  //   let deleteCommentScripts = `<script type="text/javascript">
  //   $('.post_comment-delBtn').on('click', e => {
  //     e.preventDefault();
  //     let postId = $(e.target).closest('.post_id').data('postid');
  //     let commentId = $(e.target).closest('.post_comment').data('commentid');
  //     Swal.fire({
  //       title: 'Xoá bình luận này ?',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#0e6286',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Xác nhận',
  //       cancelButtonText: 'Huỷ',
  //       keydownListenerCapture: true,
  //       allowOutsideClick: false,
  //     }).then(result => {
  //       if (result.isConfirmed) {
  //         fetch('/api/comment/' + commentId, {
  //           method: 'DELETE',
  //           body: new URLSearchParams({postId}),
  //         }).then(data => {
  //           if (data.status !== 500) {
  //             Swal.fire({
  //               title: 'Xoá bình luận thành công',
  //               icon: 'success',
  //             });
  //             return setTimeout(function () {
  //               window.location.reload();
  //             }, 800);
  //           } else {
  //             Swal.fire({
  //               title: 'Bạn không có quyền xoá bình luận này',
  //               icon: 'error',
  //             });
  //           }
  //         });
  //       }
  //     });
  //   });
  //   </script>`;
  //   let postId = $(e.target).closest('.post_id').data('postid');
  //   $.ajax({
  //     url: '/api/post/' + postId,
  //     method: 'GET',
  //     async: true,
  //     beforeSend: function () {
  //       $('#comment_loading_' + postId).removeClass('d-none');
  //     },
  //     success: function (data) {
  //       const comments = data.post.comments.length;
  //       for (let i = 0; i < comments; i++) {
  //         let commentsTemplate = Handlebars.compile(
  //           $('.comment_data_template_' + postId).html()
  //         );

  //         let dataStamp = {
  //           comments: data.post.comments[i],
  //         };
  //         let template = commentsTemplate(dataStamp);
  //         $('.comment_container_' + postId).html(
  //           template +
  //             createCommentScripts +
  //             deleteCommentScripts +
  //             updateCommentScripts
  //         );
  //         console.log(dataStamp);
  //       }
  //       $('#comment_' + postId).removeClass('d-none');
  //       $('#comment_loading_' + postId).addClass('d-none');
  //     },
  //     error: function () {},
  //   });
  // });

  // Bấm vào caption để mở rộng bài viết
  let expandPostCaption = false;
  $('.post_body-caption').on('click', e => {
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

  $(window).ready(e => {
    getPost();
  });

  // Lấy dánh sách bài viết
  function getPost() {
    fetch('/api/post')
      .then(res => res.json())
      .then(json => {
        console.log(json);
        json.posts.map(post => {
          $('.post-container').append(`
          <div class="post_id bg-white container d-lg-flex flex-column p-0 mb-4" data-postid="${
            post._id
          }">
              <div class="post_header col-12 mt-3">
                  <div class="d-flex row bd-highlight">
                      <a class="col-lg-2 col-2 d-flex align-items-center justify-content-end"
                          href="/profile/${post.user._id}">
                          <img src='${
                            post.user.avatar
                          }' alt="avatar" width="50" height="50"
                              class="img-fluid post-comments_avatar">
                      </a>
                      <a class="row post_header-userInfo col-9 col-lg-8 d-flex align-items-center justify-content-center p-0"
                          href="/profile/${post.user._id}">
                          <div class="p-2 bd-highlight">
                              <div>
                                  <strong>
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
                      <div class="col-lg-2 col-1 d-flex align-items-center justify-content-end">
                          <div class="dropdown">
                              <span class="material-icons-two-tone post-dropdown-action" id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown" aria-expanded="false">
                                  more_horiz
                              </span>
                              <ul class="dropdown-menu dropdown-menu-lg-end post_dropdown-menu"
                                  aria-labelledby="dropdownMenuButton1">
                                  <li class="me-1 ms-1">
                                      <a class="dropdown-item d-flex justify-content-start align-items-center" href="#"
                                          data-bs-toggle="modal" data-bs-target="#updatePostModal_${
                                            post._id
                                          }">
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
                  </div>
              </div>
              <div class="post_body col-12">
                  <div class="d-flex flex-column col-12 mt-3">
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
                  <div class="d-flex justify-content-center">
                      <div class="spinner-border d-none" id="comment_loading_${
                        post._id
                      }" role="status">
                          <span class="visually-hidden">Loading...</span>
                      </div>
                  </div>
              </div>

              <div class="col-12 post_comments comment_container_${
                post._id
              } d-none" id="comment_${post._id}">
                  <div class="d-flex container-fluid mb-2">
                      <div class="d-flex justify-content-center align-items-center col-1">
                          <a class="post-comments_avatar" href="/profile/${
                            post.user._id
                          }">
                              <img src='${
                                post.user.avatar
                              }' alt="avatar" width="50" height="50"
                                  class="img-fluid rounded-circle">
                          </a>
                      </div>
                      <div class="d-flex justify-content-center col-11">
                          <textarea type="text" rows="1" placeholder="Write a comment..."
                              class="form-control comment_box post_create-cmtInpt text_area_border"
                              oninput="onChangeTextArea()"></textarea>
                      </div>
                  </div>
              </div>
          </div>
        `);
        });
      });
  }
  $(document).on('click', '.comments_expand', e => {
    e.preventDefault();

    const post_id = $(e.target).closest('.post_id').attr('data-postid');
    console.log(post_id);
    $(`.comment_container_${post_id}`).removeClass('d-none');
    // prevent multiple click
    $(e.currentTarget).prop('disabled', true);
    $('#comment_loading').removeClass('d-none');
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
    }
    let formData = new FormData();
    console.log(video, image, caption);

    // check size or type here with upload.getSize() and upload.getType()
    if (image !== undefined) {
      if (image.size / (1024 * 1024).toFixed(2) >= 10) {
        Swal.fire({
          title: 'Dung lượng ảnh lớn hơn 10MB',
          icon: 'error',
        });
        return setTimeout(function () {
          window.location.reload();
        }, 800);
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
        // If auth success, redirect to home
        if (data.status !== 500) {
        }
        return (window.location.href = '/');
      })
      .finally(() => {
        $('.create_post-submitBtn').removeClass('disabled');
      })
      .catch(err => {
        console.log(err);
      });
  });

  // Cập nhật bài viết
  $('.create_post-updateBtn').on('click', e => {
    e.preventDefault();
    let postId = $(e.target).closest('.post_id').data('postid');
    let caption = document.querySelector('#update_post-input_' + postId).value;
    let video = document.querySelector(
      '#update_post-video-input_' + postId
    ).value;
    const image = $('.create_post-image')[0].files[0];
    const formData = new FormData();
    formData.append('caption', caption);

    // Lấy youtube id
    function youtube_parser(url) {
      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    }
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
        return setTimeout(function () {
          window.location.reload();
        }, 800);
      }
      formData.append('image', image, image.name);
    }
    formData.append('video', video);

    if (!image && !video && !caption) {
      Swal.fire({
        title: 'Hãy viết nội dung bài viết hoặc chèn thêm đính kèm',
        icon: 'error',
      });
      $('.create_post-submitBtn').removeClass('disabled');
      return false;
    }

    fetch('/api/post/' + postId, {
      method: 'PUT',
      async: true,
      body: formData,
    }).then(data => {
      if (data.status !== 500) {
        Swal.fire({
          title: 'Cập nhật bài viết thành công',
          icon: 'success',
        });
        return setTimeout(function () {
          window.location.reload();
        }, 800);
      } else {
        Swal.fire({
          title: 'Bạn không có quyền cập nhật viết này',
          icon: 'error',
        });
      }
    });
  });

  // Xoá bài viết
  $('.post_delete_Btn').on('click', e => {
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
        }).then(data => {
          if (data.status !== 500) {
            Swal.fire({
              title: 'Xoá bài viết thành công',
              icon: 'success',
            });
            return setTimeout(function () {
              window.location.reload();
            }, 800);
          } else {
            Swal.fire({
              title: 'Bạn không có quyền xoá bài viết này',
              icon: 'error',
            });
          }
        });
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
  $('.post_create-cmtInpt').keypress(e => {
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
        .then(({ ok, msg, at }) => {
          // If auth success, redirect to home
          return window.location.reload();
        });
    }
  });

  // ================ Kết thúc Section Jquery liên quan đến bài viết
  // ================ Jquery liên quan đến phần Thông báo
  // Xem thông báo theo ID
  $('.announce_header-title').on('click', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('announceid');
    window.location.href = '/announcement/' + announceId;
  });

  let expandAnnounceCaption = false;
  $('.announce_body-content').on('click', e => {
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
    let announceSectionsId = [];
    let announceTitle = $('.create_announce-title').val();
    let announceContent =
      CKEDITOR.instances['create_announce-content'].getData();
    $('.create_announce-section:checkbox:checked').each(function () {
      announceSectionsId.push($(this).val());
    });

    if (
      !announceTitle &&
      announceContent.length <= 61 &&
      announceSectionsId.length === 0
    ) {
      Swal.fire({
        title: 'Hãy viết nội dung thông báo',
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
        sectionsId: announceSectionsId,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // If auth success, redirect to home
        Swal.fire({
          title: 'Tạo thông báo thành công',
          icon: 'success',
          confirmButtonColor: '#0e6286',
          confirmButtonText: 'Xác nhận',
          keydownListenerCapture: true,
          allowOutsideClick: false,
        });
        return (window.location.href = '/announcements');
      });
  });

  // Cập nhật thông báo
  $('.update_announce-submitBtn').on('click', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('announceid');
    let announceTitle = $('#update_announce-title_' + announceId).val();
    let announceUpdateContent =
      CKEDITOR.instances['update_announce-content_' + announceId].getData();
    fetch('/api/announcement/' + announceId, {
      method: 'PUT',
      async: true,
      body: new URLSearchParams({
        title: announceTitle,
        content: announceUpdateContent,
      }),
    }).then(data => {
      if (data.status !== 500) {
        Swal.fire({
          title: 'Cập nhật thông báo thành công',
          icon: 'success',
        });
        return setTimeout(function () {
          window.location.reload();
        }, 800);
      } else {
        Swal.fire({
          title: 'Bạn không có quyền cập nhật thông báo này',
          icon: 'error',
        });
      }
    });
  });

  // Xoá thông báo
  $('.announce_delete_Btn').on('click', e => {
    e.preventDefault();
    let announceId = $(e.target).closest('.announce_id').data('announceid');
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
        }).then(data => {
          if (data.status !== 500) {
            Swal.fire({
              title: 'Xoá thông báo thành công',
              icon: 'success',
            });
            return setTimeout(function () {
              window.location.reload();
            }, 800);
          } else {
            Swal.fire({
              title: 'Bạn không có quyền xoá thông báo này',
              icon: 'error',
            });
          }
        });
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
