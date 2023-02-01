import {
    removeCookies
} from "cookies-next";
import axios from 'axios'
import {
    getCookie
} from "cookies-next";
import {
    toast
} from "react-toastify";

export function setZero(number) {
    if (number < 10) {
        return "000" + number;
    } else if (number < 100) {
        return "00" + number;
    } else if (number < 1000) {
        return "0" + number;
    } else {
        return number;
    }
}

export function logout(user) {
    if (user.isMicrosoft == 1) {
        window.sessionStorage.clear();
    }
    axios({
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            url: process.env.API + '/api/user/logout/',
            headers: {
                'dvflCookie': getCookie('jwt')
            }
        }).then((response) => {
            toast.success("Vous avez été déconnecté.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            removeCookies('jwt');
            window.location.href = process.env.BASE_PATH + "/";
        })
        .catch((error) => {
            removeCookies('jwt');
            window.location.href = process.env.BASE_PATH + "/";
        })
}

export function getColor(step, waitingAnswer) {
    if (waitingAnswer == true && step < 3) {
        return 10;
    }

    return step;
}

export function isUserConnected(user) {
    if (user.error) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/",
            },
            props: {},
        };
    }/* else if (user.acceptedRule == 0) {
        return {
            redirect: {
                permanent: false,
                destination: "/panel/rules",
            },
            props: {},
        };
    }
    */
}