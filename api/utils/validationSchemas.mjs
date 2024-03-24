//Validation middlewares for user input

export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage:
        'username must be at least 3 characters with a max of 32 characters',
    },
    notEmpty: {
      errorMessage: 'username cannot be empty',
    },
    isString: {
      errorMessage: 'Username must be a string',
    },
  },
  email: {
    notEmpty: {
      errorMessage: 'email field is required',
    },
    isEmail: true,
  },
  password: {
    isLength: {
      options: {
        min: 8,
        max: 32,
      },
      errorMessage:
        'password must be at least 8 characters with a max of 32 characters',
    },
    notEmpty: true,
  },
};

export const createPropertyValidationSchema = {
  propertyName: {
    isString: {
      errorMessage: 'property should be string',
    },
    notEmpty: true,
  },
  address: {
    isString: true,
    notEmpty: true,
  },
  description: {
    isString: true,
  },
  type: {
    isString: true,
    notEmpty: true,
  },
  numberOfRooms: {
    isInt: true,
    notEmpty: true,
  },
};

export const createTenantValidationSchema = {
  name: {
    isString: {
      errorMessage: 'name should be a string',
    },
    notEmpty: {
      errorMessage: 'name cannot be empty',
    },
  },
  email: {
    isEmail: true,
  },
  // leaseStartDate: {
  //   notEmpty: true,
  // },
  propertyId: {
    notEmpty: true,
    isString: {
      errorMessage: 'Property id should be a string',
    },
  },
};
