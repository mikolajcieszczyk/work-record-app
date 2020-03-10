const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
var http = require("http");
var server = http.createServer(app);
var mongoose = require("mongoose");

var Models = require("./database/Models.js")(mongoose)
var Operations = require("./database/Operations.js");
var users = new Array();

var opers = new Operations();
 
mongoose.connect('mongodb://localhost/workhours');
var db;

function register (Login, Password) {
    var obj = {
        login: Login,
        password: Password
    };
    users.push(obj);
    var record = Models.User(obj);
    opers.InsertOne(record);
}

function connectToMongo() {
    db = mongoose.connection;
    db.on("error", function (err) {
        console.log("Mongo ma problem :(");
    });
    db.once("open", function () {
        console.log("Mongo jest podłączone i działa!");

        opers.SelectAll(Models.User, function (data_users) {
            users = data_users.data;
            var admin_exists = false;

            for (var i = users.length - 1; i >= 0; i--)
                if (users[i].login == "admin")
                    admin_exists = true;

            if (admin_exists == false)
                register("admin", "admin");
        })

    });
    db.once("close", function () {
        console.log("Mongo zostało zamknięte.");
    });
}
 
connectToMongo();

var socketio = require("socket.io");

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/index.html"));
})
.get('/socket', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/lib/socket.io-1.4.5.js"));
})
.get('/Main', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/js/Main.js"));
})
.get('/Net', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/js/net.js"));
})
.get('/jquery', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/lib/jquery-3.0.0.js"));
})
.get('/styles', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/scss/main.css"));
})
.get('/Tooltip', function (req, res) {
    res.sendFile(path.join(__dirname + "/src/js/classes/Tooltip.js"));
})

server.listen(port);
var io = socketio.listen(server);

io.sockets.on("connection", function(client){
    client.on("get_data", function (data) {
        if (data.which == "workhours") {
            opers.SelectByUsername(Models.Hour, data.username, function (hours) {
                client.emit("sending_data_back", {
                    hours: hours,
                    which: "workhours"
                });
            });
        } else {
            opers.SelectByUsername(Models.Hour, data.username, function (hours) {
                opers.SelectByUsername(Models.Client, data.username, function (clients) {
                    client.emit("sending_data_back", {
                        hours: hours,
                        clients: clients
                    });
                })
            });
        }
    })

    client.on("load-report", function(data) {
        var date = data.report.split("-");
        var month = parseInt(date[0]);
        var year = parseInt(date[1]);
        opers.SelectByMonthAndYear(Models.Hour, month, year, data.username, function(records){
            client.emit("send-loaded-report",{ data: records.data });
        })
    })
    client.on("add_workhour", function (data) {
        console.log(data)
        var record = Models.Hour({
            date: data.date,
            client: data.clients,
            hours: data.hoursDone,
            rate: data.hourlyRate,
            note: data.additionalNote,
            belongsTo: data.belongsTo
        });

        opers.InsertOne(record);
    })
    client.on("add-client", function(data) {
        var record = Models.Client({
            client: data.clients,
            rate: data.hourlyRate,
            note: data.additionalNote,
            belongsTo: data.belongsTo,
        });

        opers.InsertOne(record);
    })
    client.on("edit-client", function(data) {
        console.log(data)
        opers.UpdateClient(Models.Client, data._id, data.new_clientName, data.new_hourlyRate, data.new_additionalNote);
    })
    client.on("delete-client", function(data) {
        console.log(data)
        if (data.checkbox == true) {
            opers.DeleteById(Models.Client, data.clients);
            client.emit("sending-info-about-deleting", { deleted: true, id: data.clients });
        } else {
            client.emit("sending-info-about-deleting", { deleted: false, why: "checkbox" });
        }
    })

    client.on("login", function (data) {
        var wrong_pass = false, logged = false;
        for (var i = users.length - 1; i >= 0; i--) {
            if (users[i].login == data.login) {
                if (users[i].password == data.password) {
                    client.emit("logged",{ logged: "success" });
                    logged = true;
                    break;
                } else {
                    wrong_pass = true;
                    break;
                }
            }
        }
        if (!logged) {
            if (wrong_pass == true) {
                client.emit("logged",{ logged: "wrong_pass" });
            } else {
                client.emit("logged",{ logged: "user_does_not_exists" });
            }
        }
    })
})