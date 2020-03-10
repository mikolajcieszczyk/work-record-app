module.exports = function () {
    var opers = {

        InsertOne: function (data) {
            data.save(function (error, data, dodanych) {
                console.log("dodano " + data)
            })
        },

        SelectAll: function (Model, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            })
        },

        SelectByUsername: function (Model, username, callback) {
            var obj = {};
            Model.find({ belongsTo: username }, function (err, data) {
                if (err) {
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            })
        },

        SelectByMonthAndYear: function (Model, month, year, username, callback) {
            var obj = {};
            Model.find({ 
                date: {
                    $gte: new Date(year, month, 1),
                    $lt: new Date(year, month+1, 1)
                },
                belongsTo: username,
            }, function (err, data) {
                if (err) {
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                console.log(obj);
                callback(obj);
            })
        },

        DeleteAll: function (Model) {
            Model.remove(function (err, data) {
                if (err) return console.error(err);
            })
        },

        DeleteById: function (Model, _id) {
            Model.remove({
                _id: _id
            }, function (err, data) {
                if (err) return console.error(err);
                console.log(data);
            })
        },

        DeleteFirst: function (Model) {
            Model.deleteOne({}, function (err, data) {
                if (err) return console.error(err);
            })
        },

        UpdateClient: function (Model, _id, client, rate, note) {
            Model.update({ _id: _id }, { client: client, rate: rate, note: note }, function (err, data) {
                if (err) return console.error(err);
            })
        },

    }

    return opers;

}