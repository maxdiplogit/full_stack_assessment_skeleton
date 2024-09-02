// Hooks
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import UserSelect from './components/UserSelect/UserSelect';
import HomeList from './components/HomeList/HomeList';
import EditUsersModal from './components/EditUserModal/EditUsersModal';

// Actions
import { appActions } from './store';

// Styles
import './App.css';


const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(appActions.changeSelectedUserId(null));
		dispatch(appActions.changeSelectedHomeId(null));
		dispatch(appActions.changeSelectedHomeStreetAddress(""));
		dispatch(appActions.changeModalOpen(false));
		dispatch(appActions.changeRefetchHomes(() => {}));
	}, []);

	const selectedUserId = useSelector((state: any) => state.app.selectedUserId);
	const modalOpen = useSelector((state: any) => state.app.modalOpen);

	useEffect(() => {
		dispatch(appActions.changePage(1));
	}, [ selectedUserId ]);

	return (
		<div className='app relative'>
			{ modalOpen && <EditUsersModal /> }
			<div>
				<UserSelect />
			</div>
			<div className='h-full'>
				{ selectedUserId !== null ? <HomeList /> : <div className='flex justify-center items-center text-sm w-full h-full text-stone-400'>Nothing to show</div> }
			</div>
		</div>
	);
};


export default App;