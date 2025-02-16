export interface AuthFormProps {
   title: string;
   username?: string;
   email: string;
   password: string;
   onUsernameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   onGoogleSignIn?: () => void;
   buttonLabel: string;
   isLoading?: boolean;
   error: string;
}
