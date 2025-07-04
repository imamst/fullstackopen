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

export const displayNotification = (content, timeout = 5000) => {
    return async dispatch => {
        dispatch(setNotification(content))
        setTimeout(() => {
            dispatch(removeNotification())
        }, timeout)
    }
}

export default notificationSlice.reducer