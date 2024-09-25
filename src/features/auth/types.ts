export type SignInFlow = 'signIn' | 'signUp'
/**Exporting this type allows us to use it as a type within our other files. In this case, we're using it within
 * our Authentication procedure to determine whether the user is Signing in or Registering, thus it can have only 
 * one of two different values, and being a type, can then be directly assigned to a state within other files.
 */