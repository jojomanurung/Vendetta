/**
 * User profile information
 */
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  permission?: Permission | null;
}

/**
 * User profile specific permission.
 */
export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
