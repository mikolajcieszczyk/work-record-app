var client;
var username = "";
var userData = {};
var workhours = [];
var clients = [];


$(document).ready(function () {
    client = io();

    var passwordTooltip = new Tooltip($(".password"));
    var usernameTooltip = new Tooltip($(".login"));

    client.on("sending_data_back", function (data) {
        console.log(data);
        if (data.which == "workhours") {
            workhours = data.hours.data;
        } else {
            workhours = data.hours.data;
            clients = data.clients.data;

            for (var i = 0; i < clients.length; i++) {
                var element = clients[i];

                var option = $("<option>").val(element._id).html(element.client);
                $(".clients").append(option);
            }
        }
    })

    client.on("logged", function (data) {
        console.log(data.logged)
        if (data.logged == "success") {
            username = $('.login-form .login').val();
            $('.popup__container').css("display", "none");
            client.emit("get_data", { username: username });
        } else if (data.logged == "wrong_pass") {
            $('.popup__container--content .password').addClass('something_goes_wrong');

            passwordTooltip.tooltip("enable");
            passwordTooltip.tooltip('open');

        } else if (data.logged == "user_does_not_exists") {
            $('.popup__container--content .login').addClass('something_goes_wrong');


            usernameTooltip.tooltip("enable");
            usernameTooltip.tooltip('open');
        }
    })

    $(".select-report input[type=button]").on("click", function () {
        var report = $(".select-report select[name=report] option:selected").val();
        console.log(report)

        client.emit("load-report", {
            report: report,
            username: username
        })
    })

    client.on("send-loaded-report", function (data) {
        var tempWorkhours = data.data;
        console.log(tempWorkhours)

        var report = $(".select-report select[name=report] option:selected").val();

        var sumOfMoney = 0;

        $(".container main article").html('');

        $(".container main article").append('<h2 class="content">Name: ' + username + '</h2><h2 class="content">Report: ' + report + '</h2>');

        $(".container main article").append('<div class="grid-container grid-item-title"><div class="grid-item">No.</div><div class="grid-item">Name</div><div class="grid-item">Hours</div><div class="grid-item">Rate</div><div class="grid-item">Note</div></div>');


        for (var i = 0; i < tempWorkhours.length; i++) {
            console.log(tempWorkhours[i].rate)

            sumOfMoney += parseFloat(tempWorkhours[i].rate);

            $(".container main article").append('<div class="grid-container"><div class="grid-item">' + [i + 1] + '</div><div class="grid-item">' + tempWorkhours[i].clientName + '</div><div class="grid-item">' + tempWorkhours[i].hours + '</div><div class="grid-item">' + tempWorkhours[i].rate + '</div><div class="grid-item">' + tempWorkhours[i].note + '</div></div>');

            var x = (tempWorkhours[i].rate + i);

            console.log(x);
        }

        $(".container main article").append('<h3>Summary: </h3><h4>Hours: ' + tempWorkhours.length + '</h4><h4>Money:' + sumOfMoney + '</h4>');

    });

    $(".add-workhour input[type=button]").on("click", function () {
        var date = $(".add-workhour input[type=date]").val();
        var clients = $(".clients").val();
        var clientName = $(".clients option:selected").html();
        var hoursDone = $(".hours-done").val();
        var hourlyRate = $(".hourly-rate").val();
        var additionalNote = $(".additional-note").val();

        var obj = {
            date: date,
            clients: clients,
            clientName: clientName,
            hoursDone: hoursDone,
            hourlyRate: hourlyRate,
            additionalNote: additionalNote,
            belongsTo: username,
        }

        console.log(obj)

        client.emit("add_workhour", obj)
        client.emit("get_data", { username: username, which: "workhours" });


    })

    $(".add-client input[type=button]").on("click", function () {
        var clients = $(".add-client .clients").val();
        var hourlyRate = $(".add-client .hourly-rate").val();
        var additionalNote = $(".add-client .additional-note").val();

        client.emit("add-client", {
            clients: clients,
            hourlyRate: hourlyRate,
            additionalNote: additionalNote,
            belongsTo: username
        })
        client.emit("get_data", { username: username });
    })

    function nameChange() {
        var client_id = $(".edit-client .clients option:selected").val();

        var found = clients.find(function (element) {
            return client_id == element._id;
        })

        $(".edit-client .client-name").val(found.client);
        $(".edit-client .hourly-rate").val(found.rate);
        $(".edit-client .additional-note").val(found.note);
    }

    $(".popup__edit-client").on("click", nameChange)
    $(".edit-client select.clients").on("change", nameChange)

    $(".edit-client input[type=button]").on("click", function () {
        var client_id = $(".edit-client .clients option:selected").val();
        var clients = $(".edit-client .client-name").val();
        var hourlyRate = $(".edit-client .hourly-rate").val();
        var additionalNote = $(".edit-client .additional-note").val();

        client.emit("edit-client", {
            _id: client_id,
            new_clientName: clients,
            new_hourlyRate: hourlyRate,
            new_additionalNote: additionalNote
        })
        client.emit("get_data", { username: username });
    })

    $(".delete-client input[type=button]").on("click", function () {
        var _id = $(".delete-client .clients option:selected").val();
        var checkbox = $(".checkbox").prop("checked");

        client.emit("delete-client", {
            clients: _id,
            checkbox: checkbox
        })
    })

    client.on("sending-info-about-deleting", function (data) {
        if (data.deleted == true) {
            client.emit("get_data", { username: username });
        } else if (data.deleted == false) {
            if (data.why == "checkbox") {
                console.log("you didn't checked a checkbox")
            }
        }
    })

    $('.login-form .login-btn').on("click", function () {
        $('.login-form .login').removeClass('something_goes_wrong');
        $('.login-form .password').removeClass('something_goes_wrong');

        var login = $('.login-form .login').val();
        var password = $('.login-form .password').val();



        client.emit("login", {
            login: login,
            password: password
        })
    })

})