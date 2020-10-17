export default interface User {
  id: string;
  email: string;
  active: boolean;
  firstName?: string;
  lastName?: string;
  acceptedTermsAt?: Date;
}