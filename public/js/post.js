$(document).ready(function () {
  // Bấm vào comment btn sẽ hiện các comment dưới bài viết
  $('.comments_expand').one('click', e => {
    e.preventDefault();
    let postId = $(e.target).closest('.post_id').data('postid');
    $('#comment_loading_' + postId).removeClass('d-none');
    setTimeout(() => {
      $('#comment_' + postId).removeClass('d-none');
      $('#comment_loading_' + postId).addClass('d-none');
    }, 1000);
  });
});
