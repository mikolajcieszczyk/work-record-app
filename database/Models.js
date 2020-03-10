module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var hourSchema = new Schema(
        {
            date: { type: Date, required: true },
            client: { type: String, required: true },
            hours: { type: Number, required: true },
            rate: { type: Number, required: true },
            note: { type: String, required: false },
            belongsTo: { type: String, required: true }
        }
    )

    var userSchema = new Schema({
        login: { type: String, required: true },
        password: { type: String, required: true }
    })

    var clientSchema = new Schema( {
        client: { type: String, required: true },
        rate: { type: Number, required: true },
        note: { type: String, required: false },
        belongsTo: { type: String, required: true }
    })





    var models = {
        Hour: mongoose.model("Hour", hourSchema),
        Client: mongoose.model("Client", clientSchema),
        User: mongoose.model("User", userSchema),
        // tdodaje tak jakw yzejj
    }

    return models;
}