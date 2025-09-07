export interface UserType {
  _id: string;
  fullName: string;
  email: string;
  username:string;
  bio?:string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignUpDataType {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDataType {
  email: string;
  password: string;
}

export interface AuthState {
  authUser: UserType | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;
}
export interface ApiError {
  message: string;
  status?: number;
}
