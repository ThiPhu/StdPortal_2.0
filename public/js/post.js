$(document).ready(function () {
  // Bấm vào comment btn sẽ hiện các comment dưới bài viết
  $('.comments_expand').one('click', e => {
    e.preventDefault();
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
        for (var i = 0; i < comments; i++) {
          let commentsTemplate = Handlebars.compile(
            $('.comment_data_template_' + postId).html()
          );

          let dataStamp = {
            comments: data.post.comments[i],
          };
          var template = commentsTemplate(dataStamp);
          $('.comment_container_' + postId).html(
            $('.post_comments').html() + template
          );
        }
        $('#comment_' + postId).removeClass('d-none');
        $('#comment_loading_' + postId).addClass('d-none');
      },
      error: function () {
        alert('error');
      },
    });
  });

  // Tạo bài viết
  $('.create_post-submitBtn').on('click', e => {
    e.preventDefault();
    const caption = $('.create_post-input').val();
    const image = $('.create_post-image')[0].files[0];
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    fetch('/api/post', {
      method: 'POST',
      async: true,
      body: formData,
    })
      .then(res => res.json())
      .then(({ ok, msg, at }) => {
        // If auth success, redirect to home
        return (window.location.href = '/');
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
        })
          .then(res => res.json())
          .then(({ ok, msg, at }) => {
            // If auth success, redirect to home
            return (window.location.href = '/');
          });
        Swal.fire({
          title: 'Xoá bài viết thành công.',
          confirmButtonText: 'Xác nhận!',
          confirmButtonColor: '#0e6286',
        });
      }
    });
  });

  // Tạo bình luận
  $('.comment_box').keypress(e => {
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
          return (window.location.href = '/');
        });
    }
  });
});

//review img before post
function img_upload() {
  document.getElementById('file').click();
}
input_img = document.getElementById('input_img');
var re_img = document.getElementById('review_img');
var show_img = document.getElementById('review');
var loadFile = function (event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById('review_img');
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  re_img.style.display = 'block';
  show_img.style.display = 'block';
  input_img.style.display = 'none';
};
//remove img
function remove() {
  re_img.removeAttribute('src');
  document.getElementById('file').value = null;
  re_img.style.display = 'none';
  show_img.style.display = 'none';
  input_img.style.display = 'block';
}
