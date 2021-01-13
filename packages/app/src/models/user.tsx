export default interface User {
  id: string;
  username: string;
  email: string;
  active: boolean;
  firstName?: string;
  lastName?: string;
  acceptedTermsAt?: Date;
  signedUpAt?: Date;
}