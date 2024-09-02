// Hooks
import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

// Services
import { useGetHomesByUserIdQuery } from "../../store/services/apiSlice";

// Actions
import { appActions } from "../../store";

// Components



const HomeList = () => {    
    const dispatch = useDispatch();

    const selectedUserId = useSelector((state: any) => state.app.selectedUserId);
    const modalOpen = useSelector((state: any) => state.app.modalOpen);
    const page = useSelector((state: any) => state.app.page);

    const { data: homes, error, isLoading, refetch } = useGetHomesByUserIdQuery({userId: selectedUserId, page: page});

    useEffect(() => {
        refetch();
        dispatch(appActions.changeRefetchHomes(refetch));
    }, [ selectedUserId, page ]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full rounded-lg">
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        console.log(error);
        return (
            <div className="w-full h-full flex justify-center items-center text-red-400">
                Error loading homes!
            </div>
        );
    }

    return (
        <>
            <div className={ !modalOpen ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "w-screen h-screen overflow-hidden fixed grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}>
                { homes?.homesRelatedToUserId.map((home: any) => (
                    <div className="p-4" key={ `home_id_${ home.home_id }` }>
                        <div className="p-4 shadow-md hover:shadow-xl flex flex-col rounded-md">
                            <h3 className="text-lg font-bold text-gray-900">{ home.street_address }</h3>
                            <p className="text-sm text-gray-500">List Price: ${ home.list_price }</p>
                            <p className="text-sm text-gray-500">State: { home.state }</p>
                            <p className="text-sm text-gray-500">Zip: { home.zip }</p>
                            <p className="text-sm text-gray-500">Sqft: { home.sqft }</p>
                            <p className="text-sm text-gray-500">Beds: { home.beds }</p>
                            <p className="text-sm text-gray-500">Baths: { home.baths }</p>
                            <button className="bg-blue-500 text-white px-2.5 py-1.5 rounded-md mt-2 self-end hover:bg-blue-600" onClick={ () => {
                                dispatch(appActions.changeSelectedHomeId(home.home_id));
                                dispatch(appActions.changeSelectedHomeStreetAddress(home.street_address));
                                dispatch(appActions.changeModalOpen(true));
                            } }>Edit Users</button>
                        </div>
                    </div>
                )) }
            </div>
            { !modalOpen && <div className="w-full flex justify-center p-5">
                <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px text-sm">
                        <li onClick={() => {
                            if (homes?.totalPages !== undefined && (page > 1)) {
                                dispatch(appActions.changePage(page - 1));
                            }
                        }}>
                            <a className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-50 bg-blue-700 border border-e-0 border-blue-700 rounded-s-lg hover:bg-blue-500 hover:text-gray-200 hover:border-blue-500 hover: cursor-pointer">Previous</a>
                        </li>
                        { Array.from({ length: homes?.totalPages || 0 }, (_, index: any) => (
                            <li key={ index } onClick={ () => {
                                dispatch(appActions.changePage(index + 1));
                            } }>
                                <a className={ (index + 1 === page) ? `flex items-center justify-center px-3 h-8 leading-tight text-gray-100 bg-blue-500 hover:bg-blue-600 hover:text-gray-50 hover:cursor-pointer `: `flex items-center justify-center px-3 h-8 leading-tight text-gray-50 bg-gray-400 hover:bg-gray-600 hover:text-white hover:cursor-pointer` }>{ index + 1 }</a>
                            </li>
                        )) }
                        <li onClick={() => {
                            if (homes?.totalPages !== undefined && (page < homes?.totalPages)) {
                                dispatch(appActions.changePage(page + 1));
                            }
                        }}>
                            <a className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-50 bg-blue-700 border border-e-0 border-blue-700 rounded-e-lg hover:bg-blue-500 hover:text-gray-200 hover:border-blue-500 hover: cursor-pointer">Next</a>
                        </li>
                    </ul>
                </nav>
            </div> }
        </>
    );
};


export default HomeList;