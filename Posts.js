const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    image: String,
    tecnologies: [String],
    content1: String,
    content2: String,
    slug: String,
    date: String,
    views: Number
},{collection:'openCodeTracker_posts'})

var Posts = mongoose.model("Posts", postSchema)

module.exports = Posts;