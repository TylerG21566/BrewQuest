import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';
import ip from '../info';

const AuthContext = createContext<any>(null);

interface props {
    children: JSX.Element
}


export default AuthContext;

export const AuthProvider : React.FC<props> = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('access_token') ? (localStorage.getItem('access_token')!) : ""))
    let [loading, setLoading] = useState(true)

    const updateToken = async () => {
        axios.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${localStorage.getItem('access_token')}`;
        const response = await axios.post(
        'http://' + ip + ':8000/token/refresh/',
        { refresh: localStorage.getItem('refresh_token') },
        {
            headers: {
            'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        );
       
        if (response.status === 200) {
            console.log("tokens generated")
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            axios.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${localStorage.getItem('access_token')}`;
        } else {
            console.log("token expired")
            axios.defaults.headers.common['Authorization'] = null;
        }

        if(loading){
            setLoading(false)
        }
    }

    const setInitialToken = (passedtoken : string) => {
        setAuthTokens(passedtoken)
        console.log("initial token set")
    }

    

    // groups all the states and functions together, otherwise we'd have to do it one by one i.e. user = {user}
    let contextData = {
        authTokens:authTokens,
        setInitialToken : setInitialToken,
    }

    useEffect(()=>{
        if(loading){
            updateToken()
        }

        const REFRESH_INTERVAL = 1000 * 60 * 2 // 4 minutes
        // does an update token every 4 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens, loading])

    // allows us to pass the user prop (contextData) into any page that is surrounded by AuthContext
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}