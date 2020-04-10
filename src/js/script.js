// $(document).on('load', function () {

//   var popUpContainer = document.getElementsByClassName('popup__container');
//   var popUp = document.getElementsByClassName("popup");
//   var span = document.getElementsByClassName("close");

//   // switch(cos) {
//   //   case popUp[0].onclick:
//   //     popUpContainer[0].style.display = "block";
//   // }

//   // $(".popup") -> to jest to samo co document.getElementsByClassName("popup")

//   $(".popup").on("click", function () {
//     var index = parseInt($(this).attr("popup_id"));
//     popUpContainer[index-1].style.display = 'block';
//     $(".popup__container").eq(index-1).find(".close").on("click", function () {
//       popUpContainer[index-1].style.display = "none";
//     })
//   })

//   $(window).on("click", function (event) {
//     if (event.target.className == ("popup__container")) {
//       event.target.style.display = "none";
//     }
//   })

// })