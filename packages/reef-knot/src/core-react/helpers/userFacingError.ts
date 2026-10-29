/**
 * An error with a message that we wrote for the user.
 * The UI shows only these messages. It replaces other error text with a generic one.
 */
export class UserFacingError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UserFacingError';
  }
}
