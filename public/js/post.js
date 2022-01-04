$(document).ready(function () {
  // ================ Jquery liên quan đến bài viết
  // Bấm vào comment btn sẽ hiện các comment dưới bài viết ( Phần jquery này sẽ render script cho template )
  // Các script liên quan CRUD đến bình luận sẽ ở đây
  $('.comments_expand').one('click', e => {
    e.preventDefault();

    // Tạo bình luận
    let createCommentScripts = `<script type="text/javascript">
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
    </script>`;

    // Cập nhật bình luận
    let updateCommentScripts = `<script type="text/javascript">
    $('.update_comment-Btn').on('click', e => {
      e.preventDefault();
      let postId = $(e.target).closest('.post_id').data('postid');
      let commentId = $(e.target).closest('.post_comment').data('commentid');
      let content = document.querySelector('#update_comment-input_' + commentId).value;
      fetch('/api/comment/' + commentId, {
        method: 'PUT',
        async: true,
        body: new URLSearchParams({
          content,
          postId
        }),
      }).then(data => {
        if (data.status !== 500) {
          Swal.fire({
            title: 'Cập nhật bình luận thành công',
            icon: 'success',
          });
          return setTimeout(function () {
            window.location.reload();
          }, 800);
        } else {
          Swal.fire({
            title: 'Bạn không có quyền cập nhật bình luận này',
            icon: 'error',
          });
        }
      });
    });
    </script>`;

    // Xoá bình luận
    let deleteCommentScripts = `<script type="text/javascript">
    $('.post_comment-delBtn').on('click', e => {
      e.preventDefault();
      let postId = $(e.target).closest('.post_id').data('postid');
      let commentId = $(e.target).closest('.post_comment').data('commentid');
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
            body: new URLSearchParams({postId}),
          }).then(data => {
            if (data.status !== 500) {
              Swal.fire({
                title: 'Xoá bình luận thành công',
                icon: 'success',
              });
              return setTimeout(function () {
                window.location.reload();
              }, 800);
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
    </script>`;
    let postId = $(e.target).closest('.post_id').data('postid');
    $.ajax({
      url: '/api/post/' + postId,
      method: 'GET',
      async: true,
      beforeSend: function () {
        $('#comment_loading_' + postId).removeClass('d-none');
      },
      success: function (data) {
        const comments = data.post.comments.length;
        for (let i = 0; i < comments; i++) {
          let commentsTemplate = Handlebars.compile(
            $('.comment_data_template_' + postId).html()
          );

          let dataStamp = {
            comments: data.post.comments[i],
          };
          let template = commentsTemplate(dataStamp);
          $('.comment_container_' + postId).html(
            template +
              createCommentScripts +
              deleteCommentScripts +
              updateCommentScripts
          );
          console.log(dataStamp);
        }
        $('#comment_' + postId).removeClass('d-none');
        $('#comment_loading_' + postId).addClass('d-none');
      },
      error: function () {},
    });
  });

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

  // Tạo bài viết
  $('.create_post-submitBtn').on('click', e => {
    e.preventDefault();
    // const valueText = tx.val();
    // function youtube_parser(url) {
    //   var regExp =
    //     /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    //   var match = url.match(regExp);
    //   return match && match[7].length == 11 ? match[7] : false;
    // }
    // console.log(youtube_parser(valueText));
    $('.create_post-submitBtn').addClass('disabled');
    const image = $('.create_post-image')[0].files[0];
    const caption = $('.create_post-input').val();
    const formData = new FormData();

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
    fetch('/api/post', {
      method: 'POST',
      async: true,
      body: formData,
    })
      .then(res => res.json())
      .then(({ ok, msg, at }) => {
        // If auth success, redirect to home
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
    const image = $('.create_post-image')[0].files[0];
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
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
    let announceTitle = $('.create_announce-title').val();
    let announceContent =
      CKEDITOR.instances['create_announce-content'].getData();
    fetch('/api/announcement', {
      method: 'POST',
      async: true,
      body: new URLSearchParams({
        title: announceTitle,
        content: announceContent,
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
