import { convexAuth } from "@convex-dev/auth/server";
import { Password } from '@convex-dev/auth/providers/Password'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import { DataModel } from "./_generated/dataModel";

/**This code is provided directly by Convex and is modular to include whatever we want or need for authorization purposes.
 * We have elected for a simple, standard usage here, asking for an email and name in addition to the password - (does
 * not need to be put in, as it's considered to be implied. The Password DataModel only informs what ASIDE from a password
 * the user needs to enter upon registration). Inside our DataModel, we offer the profile() method, telling the server
 * we're creating a user or server profile, and give it the 'params' argument, being our data received from inputs. The
 * profile() method must return an object defining the names of these data structures in our table and the assumed value
 * (placeholder value that describes any possible entry) marked with 'as <type>' - denoting that the database should only
 * ever store values in that section as that type. This can be any type, such as string, number, et.c or can be a unique,
 * custom-created type by replacing, for instance, string below with id<'newType'> - making it unusable by anyone or anything
 * that doesn't know what type is needed. This file does not need the 'v' object from /values, as the Password<DataModel>()
 * method takes all information given to it and applies this to it already. 
 */
const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});

/**This function allows us to use the exported functions within our pages, a very important step, as this is what allows
 * us to use things such as signIn and signOut buttons, as well as directly interact with authentication functions and the
 * global state storage. convexAuth documentation describes this much better, but at its heart, it is a type of middleware 
 * that allows us to directly interact with VERY important functions from the convexAuth server files. Passing in a property
 * of 'providers' allows us to define what services we'll allow to enter new users into our application - doing so within
 * an array of the different authorization types. To explain below - CustomPassword is the data model we defined above that
 * tells our Auth service which variables to accept, and thanks to Convex, can also be used as a way to directly log in when
 * re-entering one or more of those values. GitHub and Google are what are called 'OAuth' providers, a list of all of which
 * that are accepted can be found as the directory names within @auth/core/providers/ and each has its own unique way of
 * providing an 'authentication token' that is passed back to the provider by the database as a password of sorts, letting 
 * the provider recognize which application is requesting access for authentication and in response, passing a unique coded
 * response to the application to give all requested details as well as a go-ahead signal, allowing the completion of the 
 * registration or sign-in process and filling out the authOptions tables within the database with relevant and accurate 
 * information so far as the provider knows it. This is used VERY commonly on almost every website now, and is done through
 * the buttons that say 'Continue with Google' or 'Sign-in with Facebook'. Some OAuth providers are HUGE, multi-billion dollar
 * companies such as these, that someone is almost guaranteed to have an account for, but others are smaller, more niche 
 * web applications, such as GitHub, that have a specific demographic they cater to, so this should be considered when selecting
 * OAuth targets - in addition to the fact that creating an OAuth link and key require that you have an open and active account
 * with that website/company.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, GitHub, Google],
});
