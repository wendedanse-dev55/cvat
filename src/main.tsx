import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Training from "@/pages/home";
import Detail from "@/pages/detail";




const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<App />} >
            <Route index   element={<Training />} />
        </Route>
            <Route
                path="detail/:name"
                element={<Detail />}
            />
        </>
    )
);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider  router={router}/>)
