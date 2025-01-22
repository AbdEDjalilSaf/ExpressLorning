
export const validationSchemas = {

    name: {
    
      isString: true,
  
      isLength: {
  
        errorMessage: 'Name should be between 3 and 50 characters',
  
        options: { min: 3, max: 50 },
  
      },
  
      errorMessage: 'Name is required',
  
      notEmpty: {
  
        errorMessage: 'Name cannot be empty',
  
      },
  
    },
  
    email: {
    
      isEmail: true,
  
      errorMessage: 'Invalid email',
  
    },
  
  };
  