import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
    name:"player",
    initialState:{
        user_type:''
    },
    reducers:{
        setType:(s,a)=>{
            s.user_type=a.payload
        }
    }
})

export const {setType} = playerSlice.actions
export default playerSlice.reducer