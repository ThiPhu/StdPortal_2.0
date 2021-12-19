$(document).ready(function () {
  // Bấm vào comment btn sẽ hiện các comment dưới bài viết
  //var templateMissions = Handlebars.compile($('#comment_data_template').html());
  //   function printData(datas) {
  //     let posts = datas.posts;
  //     console.log(posts.length);
  //     for (var i = 0; i < posts.length; i++) {
  //       var data = datas.posts[i];
  //       console.log(data);
  //       var dataStamp = {
  //         comments: data.comments,
  //       };
  //       console.log(dataStamp);
  //       var template = templateMissions(dataStamp);
  //       $('.comment_container').append(template);
  //     }
  //   }
  $('.comments_expand').one('click', e => {
    e.preventDefault();
    let postId = $(e.target).closest('.post_id').data('postid');
    $.ajax({
      url: '/api/post',
      method: 'GET',
      async: true,
      beforeSend: function () {
        $('#comment_loading_' + postId).removeClass('d-none');
      },
      success: function (data) {
        let posts = data.posts;
        let commentsTemplate = Handlebars.compile(
          $('#comment_data_template').html()
        );
        for (var i = 0; i < posts.length; i++) {
          let datas = data.posts[i];
          if (datas._id === postId) {
            let dataStamp = {
              comments: datas.comments,
            };
            console.log(commentsTemplate(null));
            let template = commentsTemplate(dataStamp);
            $('.comment_container').append(template);
          }
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
