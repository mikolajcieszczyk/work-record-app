$(document).ready(function () {

    function classToggle() {
        const navs = $('.navbar__items');

        navs.each(function () {
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
    var pdfExportBtn = $('.pdfExportBtn');
    var logOutBtn = $(".logOutBtn");

    popUpContainer[index = 0].style.display = 'block';

    pdfExportBtn.on('click', function () {
        html2canvas($('.pdfExport')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Report.pdf");
            }
        });
    })

    $('.add-workhour .clients').on('change', function () {
        var client_predefind = $(this).find('option:selected').val();
        var nameIndex = clients.findIndex(function (a) { return a._id == client_predefind; });
        console.log(nameIndex)
        var rate = clients[nameIndex].rate;
        var note = clients[nameIndex].note;
        $('.add-workhour .hourly-rate').val(rate);
        $('.add-workhour .additional-note').val(note);
    })


    popUp.on("click", function () {
        var index = parseInt($(this).attr("popup_id"));
        if (index == 2) {
            $('.add-workhour .clients').trigger('change');
        } else if (index == 3) {
            $('.add-client .additional-note').attr('placeholder', 'type something');
        }
        popUpContainer[index].style.display = 'block';
        $(".popup__container").eq(index).find(".close").on("click", function () {
            popUpContainer[index].style.display = "none";
        })
    })

    $(".bt-load-report").on("click", function () {
        var months = [];
        $(".select-report .all-reports").html("");
        for (var i = 0; i < workhours.length; i++) {
            var canIAdd = true;
            var date = new Date(workhours[i].date);
            for (var j = 0; j < months.length; j++) {
                if (months[j].month == (date.getMonth() + 1) && months[j].year == date.getFullYear()) {
                    canIAdd = false;
                }
            }
            if (canIAdd == true) {
                var text = "" + (date.getMonth() + 1) + "-" + date.getFullYear();
                months.push({
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                })
            }
        }
        months.sort(function (a, b) {
            var a_text = parseFloat(a.year + "." + a.month);
            var b_text = parseFloat(b.year + "." + b.month);
            return b_text - a_text;
        })
        for (var i = 0; i < months.length; i++) {
            var text = "" + months[i].month + "-" + months[i].year;
            var option = $("<option>").val(text).html(text);
            $(".select-report .all-reports").append(option);
        }

        pdfExportBtn.css("display", "block");

    });

    $('.select-report-button').on('click', function () {
        $('.popup__container').hide();
    })

    logOutBtn.on('click', function() {
        location.reload(true);
    })
})