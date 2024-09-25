import { atom, useAtom } from "jotai";

/**This is our first use of Jotai - a state management library that provides a function similar to
 * Redux or a similar library. Jotai refers to states by their size/complexity, and an Atom is the smallest
 * form of data, holding a primitive type such as string, number, or boolean, or a unique defined data type
 * that is set elsewhere. 
 *  In Jotai, an atom is the most basic form of data to be managed, and is used to set and manage simple data
 * globally across the entire application. In this case, we're setting up an atom to tell our program whether or
 * not to display the modal that allows for the creation of new Workspaces, which should normally be off, so we set
 * the default to 'false'. Later in our code, if we wish to change this, we simply call 'useCreateWorkspaceModal(<value>)',
 * passing our desired value into the parameters, and it will act as the method within a useState variable, updating
 * the value of that atom to match the new value inserted. This value should be of a type that matches the currently
 * stored value, as it will throw an error if you try to change it, just as useState would if done locally. We can 
 * also check the value of this atom by calling the method and passing in no parameters, as it will instead act as 
 * the variable in useState, referencing the value currently stored instead. - in this way, we can keep a set state
 * with the desired value across all pages within our site, all without using local storage and potentially slowing
 * everything down irreparably.
 */
const createWorkspaceModalAtom = atom(false);

export const useCreateWorkspaceModal = () => {
    return useAtom(createWorkspaceModalAtom)
}