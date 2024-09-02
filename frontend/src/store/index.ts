import { createSlice, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';


// Services
import { apiSlice } from "./services/apiSlice";


export interface User {
    user_id: number,
    username: string,
    email: string,
};


export interface Home {
    home_id: number,
    street_address: string,
    state: string,
    zip: string,
    sqft: number,
    beds: number,
    baths: number,
    list_price: number,
};


const initialAppState = {
    selectedUserId: null,
    selectedHomeId: null,
    selectedHomeStreetAddress: "",
    modalOpen: false,
    page: 1,
    refetchHomes: () => {},
};


const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        changeSelectedUserId(currentState, action) {
            currentState.selectedUserId = action.payload;
        },
        changeSelectedHomeId(currentState, action) {
            currentState.selectedHomeId = action.payload;
        },
        changeSelectedHomeStreetAddress(currentState, action) {
            currentState.selectedHomeStreetAddress = action.payload;
        },
        changeModalOpen(currentState, action) {
            currentState.modalOpen = action.payload;
        },
        changeRefetchHomes(currentState, action) {
            currentState.refetchHomes = action.payload;
        },
        changePage(currentState, action) {
            currentState.page = action.payload;
        }
    }
});


const reducers = combineReducers({
    app: appSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});


const persistConfig = {
    key: 'root',
    storage
};


const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['app.refetchHomes'],
            }
        }).concat(apiSlice.middleware),
});


export const appActions = appSlice.actions;


export default store;