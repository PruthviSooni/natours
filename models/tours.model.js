const mongoose = require('mongoose');
const slugify = require('slugify');
const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'Name max length is less then equal to 40 characters'],
      minLength: [5, 'Name length should be more then equal to 5 characters']
    },
    rating: {
      type: Number,
      default: 0.0,
      max: [5, 'Rating should be given in between 1-5'],
      min: [0, 'Rating should be given in between 1-5']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: "Difficulty should be like :easy ,medium, difficult"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0.0,
    },
    ratingQuantity: {
      type: Number,
      default: 0.0,
    },
    slug: {
      type: String,
    },
    secretTour: { type: Boolean, default: false, },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, trim: true })
  next();
})
toursSchema.pre('aggregate', function (next) {
  this.pipeline()
  console.log(this.pipeline())
  next();
})

toursSchema.virtual('durationToWeek').get(function () {
  return this.duration / 7;
})

toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  next();
})

module.exports = mongoose.model('Tours', toursSchema);
