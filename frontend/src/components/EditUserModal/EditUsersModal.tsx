// Hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { appActions } from "../../store";

// Services
import { useGetAllUsersQuery, useGetUsersByHomeIdQuery, useUpdateUsersForHomeMutation } from "../../store/services/apiSlice";


const EditUsersModal = () => {
    const dispatch = useDispatch();

    const selectedUserId = useSelector((state: any) => state.app.selectedUserId);
    const selectedHomeId = useSelector((state: any) => state.app.selectedHomeId);
    const selectedHomeStreetAddress = useSelector((state: any) => state.app.selectedHomeStreetAddress);
    const refetchHomes = useSelector((state: any) => state.app.refetchHomes);

    const [ selectedUsers, setSelectedUsers ] = useState<number[]>([]);

    const { data: users, error, isLoading } = useGetAllUsersQuery();
    const { data: usersInterested, error: fetchError, isLoading: fetchLoading, refetch } = useGetUsersByHomeIdQuery(selectedHomeId);
    const [ updateUsersForHome, { isLoading: updateLoading, error: updateError, isSuccess } ] = useUpdateUsersForHomeMutation();

    useEffect(() => {
        if (usersInterested) {
            // Set the selected users to be those who are already interested in the home
            setSelectedUsers(usersInterested.usersRelatedToHomeId.map((user: any) => user.user_id));
        }
    }, [usersInterested]);

    const handleCheckboxChange = (userId: number) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };
    
    const handleSubmit = async () => {
        try {
            await updateUsersForHome({ homeId: selectedHomeId, selectedUserId: selectedUserId, newUserIds: selectedUsers }).unwrap();
            refetch();
            refetchHomes();
            dispatch(appActions.changeSelectedHomeId(null));
            dispatch(appActions.changeSelectedHomeStreetAddress(""));
            dispatch(appActions.changeModalOpen(false));
        } catch (error) {
            console.log("UpdateError: ", updateError);
            console.log(error);
        }
    }
    
    return (
        <div className="absolute h-screen w-screen bg-black top-0 left-0 bg-opacity-80 z-10 flex flex-col justify-center items-center">
            <div className="p-4 bg-white w-1/3 rounded-lg flex flex-col">
                { (!fetchLoading && !fetchError) && <>
                    <h2 className="text-xl font-semibold pl-10">Modify Users for: { selectedHomeStreetAddress }</h2>
                    { selectedUsers.length < 1 && <div className="text-red-600 text-sm pl-10">
                        At least one user shall be interested
                    </div> }
                    <div className="pb-2 pt-4 flex flex-col w-full pl-10">
                        { users?.allUsers.map((user: any) => (
                            <div key={user.user_id}>
                                <div className="flex items-center mb-4">
                                    <input type="checkbox"
                                        checked={ selectedUsers.includes(user.user_id) }
                                        onChange={ () => handleCheckboxChange(user.user_id) }
                                        id={ `user_id_${ user.user_id }` }
                                        value=""
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={`user_id_${ user.user_id }`} className="ms-2 text-sm font-medium text-gray-900 cursor-pointer">{ user.username }</label>
                                </div>
                            </div>
                        )) }
                    </div>
                    <div className="flex w-full justify-end">
                        <button onClick={ () => {
                            dispatch(appActions.changeSelectedHomeId(null));
                            dispatch(appActions.changeSelectedHomeStreetAddress(""));
                            dispatch(appActions.changeModalOpen(false));
                        } } type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Close</button>
                        <button onClick={ handleSubmit } disabled={ updateLoading || selectedUsers.length === 0 } type="button" className={ (updateLoading || selectedUsers.length === 0) ? "text-white bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"}>
                            { updateLoading ? <>
                                <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
                                { 'Updating...' }
                            </> : 'Save' }
                        </button>
                    </div>
                </> }
                { fetchLoading && <div className="flex items-center justify-center w-full h-full rounded-lg">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="flex w-full justify-end">
                        <button onClick={ () => {
                            dispatch(appActions.changeSelectedHomeId(null));
                            dispatch(appActions.changeSelectedHomeStreetAddress(""));
                            dispatch(appActions.changeModalOpen(false));
                        } } type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Close</button>
                    </div>
                </div> }
                { fetchError && <div className="w-full h-full flex justify-center items-center">
                    <div className="text-red-400">
                        Error loading users interested in { selectedHomeStreetAddress }!
                    </div>
                    <div className="flex w-full justify-end">
                        <button onClick={ () => {
                            dispatch(appActions.changeSelectedHomeId(null));
                            dispatch(appActions.changeSelectedHomeStreetAddress(""));
                            dispatch(appActions.changeModalOpen(false));
                        } } type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Close</button>
                    </div>
                </div> }
            </div>
        </div>
    );
};


export default EditUsersModal;