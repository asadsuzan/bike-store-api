import * as jwt from 'jsonwebtoken';

export const createToken = (
  payload: {
    userId: string;
    role: 'admin' | 'customer';
  },
  secret: string,
  expiresIn: jwt.SignOptions['expiresIn'], // Ensure this is a valid value for `expiresIn`
) => {
  const token = jwt.sign(
    payload, // Directly pass the payload object
    secret, // Pass a valid secret
    {
      expiresIn:
        typeof expiresIn === 'number' || typeof expiresIn === 'string'
          ? expiresIn
          : undefined, // Ensure type compatibility
    },
  );
  return token;
};
