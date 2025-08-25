import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { UserData } from '@/types/auth'

// Define a type for the slice state

const defaultDialogData = {
	title: "Successful!",
	desc: "",
	open: false,
	buttonLabel: "Close",
	// continue: () => { }
}
interface AppState {
	profile?: UserData | null
	navIsOpen: boolean,
	alertDialogData: typeof defaultDialogData,
	resetPasswordData: ({
		email?: string, otp?: string,
		new_password?: string, confirm_password?: string
	})

	newMessages?: { [x: number]: string }
}

// Define the initial state using that type
const initialState: AppState = {
	navIsOpen: false,
	resetPasswordData: {},
	alertDialogData: defaultDialogData,
}

export const appSlice = createSlice({
	name: 'app',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setNavIsOpen: (state, action: PayloadAction<boolean>) => {
			state.navIsOpen = action.payload
		},

		setAdminProfile: (state, action: PayloadAction<UserData | null>) => {
			state.profile = action.payload
		},

		setResetPasswordData: (state, action: PayloadAction<AppState['resetPasswordData']>) => {
			state.resetPasswordData = { ...state.resetPasswordData, ...action.payload }
		},

		openAlertDialog: (state, action: PayloadAction<Partial<AppState['alertDialogData']>>) => {
			state.alertDialogData = {
				...state.alertDialogData,
				...action.payload, open: true
			}
		},

		closeAlertDialog: (state) => {
			// state.alertDialogData.continue();
			state.alertDialogData = { ...defaultDialogData, open: false }
			// close();
		},

		setNewMessage: (state, { payload }: PayloadAction<{ id: number, message: string }>) => {
			state.newMessages = {
				...state.newMessages,
				[payload.id]: payload?.message ?? undefined
			}
		},
	},
})

export const {
	setNavIsOpen, setAdminProfile, setResetPasswordData,
	openAlertDialog, closeAlertDialog, setNewMessage
} = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app

export default appSlice.reducer