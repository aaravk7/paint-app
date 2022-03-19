const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaintingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    }
});

const Paintings = mongoose.model('Paintings', PaintingSchema);

module.exports = Paintings;