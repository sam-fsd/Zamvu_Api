import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  propertyName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  //   photos: [String], // Array of image URLs
  // Reference to the User who owns/manages the property
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    },
  ],
  numberOfRooms: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
});

export const PropertyModel = mongoose.model('Property', propertySchema);
