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
          console.log(dataStamp.comments);
          $('.comment_container_' + postId).html(template);
        }
        $('#comment_' + postId).removeClass('d-none');
        $('#comment_loading_' + postId).addClass('d-none');
      },
      error: function () {
        alert('error');
      },
    });
  });
});
