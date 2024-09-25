import { AuthScreen } from "@/features/auth/components/auth-screen";
/**This page is the main-location of our Auth screen, but for neatness, we place only this one here and pull our 
 * AuthScreen element from features, as that screen is useable not only on this address.
 */
const AuthPage = () => {
    return <AuthScreen />;
    //TODO - Routing does not activate on session change - potentially due to client/server side actions
    //Potentially fixed? - added reactRouter to pages where needed - check after logout option is available
    //again.
}
 
export default AuthPage;