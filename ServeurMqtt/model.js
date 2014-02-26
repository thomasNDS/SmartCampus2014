
//////////////////////////////////
//Definition of a schema /////////
//////////////////////////////////
var ObjectId = Schema.ObjectId;
console.log("modele");

var Building = new Schema({
    id: ObjectId,
//    _id: String,
    name: {type: String, required: true},
    comment: {type: String},
    items: [Item],
    administrators: [Administrator]
});
var Item = new Schema({
//    _id: String,
    id: ObjectId,
    name: {type: String, required: true},
    position: {type: String},
    room_number: {type: Number},
    Sensors_data: [Sensors_data]
});
var Sensors_data = new Schema({
//    _id: String,
    id: ObjectId,
    type: {type: String},
    position: {type: String},
    mesure: [Mesure]
});
var Mesure = new Schema({
//    _id: String,
    id: ObjectId,
    date: {type: Date, default: Date.now},
    value: String
});
var Comment = new Schema({
//    _id: String,
    id: ObjectId,
    value: String
});
var Administrator = new Schema({
//    _id: String,
    id: ObjectId,
    name: String,
    first_name: String,
    building: [{ type: Schema.Types.ObjectId, ref: 'Building' }] 
});

var Entity = new Schema({
//    _id: String,
    id: ObjectId,
    room_number: Number,
    name: String,
    first_name: String,
    comments: [Comment]
});
var Tram = Entity.extend({
    id: ObjectId,
    value: String
});
var Lampadaire = Entity.extend({
    id: ObjectId,
    value: String
});
var Parking = Entity.extend({
    id: ObjectId,
    total_place: Number,
    vacant_place: Number
});
var Building_parking = Item.extend({
    id: ObjectId,
    total_place: Number,
    vacant_place: Number
});
var Cafeteria = Item.extend({
    name: String
});
var Classroom = Item.extend({
    id: ObjectId,
    total_place: Number
});
// models
var ClassroomModel = mongoose.model('Classroom', Classroom);
var CafeteriaModel = mongoose.model('Cafeteria', Cafeteria);
var BuildingModel = mongoose.model('Building', Building);
var ParkingModel = mongoose.model('Parking', Parking);
var LampadaireModel = mongoose.model('Lampadaire', Lampadaire);
var ItemModel = mongoose.model('Item', Item);
var TramModel = mongoose.model('Tram', Tram);
var EntityModel = mongoose.model('Entity', Entity);
var AdministratorModel = mongoose.model('Administrator', Administrator);
var CommentModel = mongoose.model('Comment', Comment);
var MesureModel = mongoose.model('Mesure', Mesure);
var Sensors_dataModel = mongoose.model('Sensors_data', Sensors_data);

console.log('import model');