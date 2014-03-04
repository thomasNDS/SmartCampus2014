
//////////////////////////////////
//Definition of a schema /////////
//////////////////////////////////
var ObjectId = Schema.ObjectId;
console.log("model");

var Entity = new Schema({
    id: ObjectId,
    name: String,
    type: String,
    comments: [Comment],
    administrators: [Administrator],
    events: [Event],
    items: [{
            id: ObjectId,
            name: {type: String, required: true},
            position: {type: String},
            room_number: {type: Number},
            Sensors_data: [Sensors_data]
        }],
    infos: []
});

var Event = new Schema({
    id: ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    date: {type: Date, default: Date.now}
});

//var Item = new Schema({
//    id: ObjectId,
//    name: {type: String, required: true},
//    position: {type: String},
//    room_number: {type: Number},
//    Sensors_data: [Sensors_data]
//});

var Sensors_data = new Schema({
    id: ObjectId,
    type: {type: String},
    position: {type: String},
    mesure: [Mesure]
});

var Mesure = new Schema({
    id: ObjectId,
    date: {type: Date, default: Date.now},
    value: String
});

var Comment = new Schema({
    id: ObjectId,
    value: String
});

var Administrator = new Schema({
    id: ObjectId,
    name: String,
    first_name: String,
    entity: [{type: Schema.Types.ObjectId, ref: 'Entity'}]
});

// models
//var ItemModel = mongoose.model('Item', Item);
var EntityModel = mongoose.model('Entity', Entity);
var AdministratorModel = mongoose.model('Administrator', Administrator);
var CommentModel = mongoose.model('Comment', Comment);
var MesureModel = mongoose.model('Mesure', Mesure);
var Sensors_dataModel = mongoose.model('Sensors_data', Sensors_data);

console.log('import model');
