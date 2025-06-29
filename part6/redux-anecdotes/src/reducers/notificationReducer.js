import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            // error: 'A non-serializable value was detected in the state' in console but still worked
            return ''
        }
    }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer