import mongoose from 'mongoose';

const tenantSchema = mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  name: { type: mongoose.Schema.Types.String, required: true },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  phone: {
    type: mongoose.Schema.Types.String,
  },
  // leaseStartDate: {
  //   type: mongoose.Schema.Types.Date,
  //   required: true,
  // },
  // leaseEndDate: {
  //   type: mongoose.Schema.Types.Date,
  //   required: true,
  // },
});

export const TenantModel = mongoose.model('Tenant', tenantSchema);
