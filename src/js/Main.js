$(document).ready(function() {
    
    function classToggle() {
        const navs = $('.navbar__items');

        navs.each(function() {
            $(this).toggleClass('navbar__toggleShow');
        });
    }

    $('.navbar__link-toggle').on('click', classToggle);

    $('.navbar__link').on('click', classToggle);

    var popUpContainer = $('.popup__container');
    var popUp = $(".popup");
    var close = $(".close");
    var loginContainer = $('.login__container')
    var loginPopup = $('.popup__login');

    popUpContainer[index = 0].style.display = 'block';

    /*$(window).on("click", function(event) {
        if (event.target.className == ("popup__container")) {
            event.target.style.display = "none";
        }
    })*/


    popUp.on("click", function() {
        var index = parseInt($(this).attr("popup_id"));
        popUpContainer[index].style.display = 'block';
        $(".popup__container").eq(index).find(".close").on("click", function() {
            popUpContainer[index].style.display = "none";
        })
    })

    $(".bt-load-report").on("click", function() {
        var months = [];
        $(".select-report .all-reports").html("");
        for (var i = 0; i < workhours.length; i++) {
            var canIAdd = true;
            // console.log(workhours[i].date)
            var date = new Date(workhours[i].date);
            for (var j = 0; j < months.length; j++) {
                if (months[j].month == date.getMonth() && months[j].year == date.getFullYear()) {
                    canIAdd = false;
                }
            }
            if (canIAdd == true) {
                var text = "" + date.getMonth() + "-" + date.getFullYear();
                months.push({
                    month: date.getMonth(),
                    year: date.getFullYear()
                })
            }
        }
        months.sort(function(a, b) {
            var a_text = parseFloat(a.year + "." + a.month);
            var b_text = parseFloat(b.year + "." + b.month);
            return b_text - a_text;
        })
        for (var i = 0; i < months.length; i++) {
            var text = "" + months[i].month + "-" + months[i].year;
            var option = $("<option>").val(text).html(text);
            $(".select-report .all-reports").append(option);
        }

    });


    $('.select-report-button').on('click', function() {
        $('.popup__container').hide();
    })



})