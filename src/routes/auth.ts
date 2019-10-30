export const jwt = require('express-jwt');

export const getTokenFromHeaders = (req: any) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

export class Auth{
  required: string=jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  });
}
