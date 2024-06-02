import {useForm} from "react-hook-form";
import type {Credentials} from "iso";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {hidePreloader, showPreloader} from "@shammasov/mydux/src/connection/globalPreloader.ts";

export const useAuth = ({notify = alert, successRedirectTo = '/app'}:{notify?: (message:string) => any , successRedirectTo?: string}) => {

    const [isLoading, setIsLoading] = useState(false);
    const onLoginRequest = async (data: Partial<Credentials>) => {

        setIsLoading(true);
      //  showPreloader();
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const response = await fetch("/api/login", {
                redirect: "follow",
                method: "POST",
                body: JSON.stringify(data),
                headers,
            });
            if (response.status === 200) {
                const result = await response.json();

                console.log("Login result " + result);
                window.location.pathname = successRedirectTo;
                window.location.reload(); //dispatch(connectionSlice.actions.findConnectionRequested());
            } else {
                notify("Не верный лолгин/пароль");
            }
        } catch (e) {
            notify("Не удалось связаться с сервером");
        }

        //hidePreloader();
        setIsLoading(false);
    };

    return {
        onLoginRequest,isLoading,setIsLoading
    }
}