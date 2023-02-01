import axios from "axios";
import { fetchAPIAuth, parseCookies } from "../../../lib/api";

export default function Verify() {

    return (
        <div className="min-h-screen bg-white flex">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <img
                            className="h-12 w-auto"
                            src="/logo.png"
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Vérifier votre email</h2>
                    </div>

                    <div className="mt-8">
                        <div className="space-y-5">
                            <p>Votre e-mail est entrain d'être vérifié par nos systèmes.</p>
                            <p>Rien ne se passe ? Ré-actualisez la page puis essayez de vous connecter.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://media.lesechos.com/api/v1/images/view/5d9c7a8c3e45463dde1e2ad6/1280x720/0602009053500-web-tete.jpg"
                    alt=""
                />
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, params }) {
    const cookies = parseCookies(req);
    const user = await fetchAPIAuth("/user/me", cookies.jwt);
  
    if(user.error == null){
      return {
        redirect: {
          permanent: false,
          destination: "/panel/",
        },
        props:{},
      };  }
    
    var success = false;
    await axios({
        method: 'PUT',
        url: process.env.API + '/api/user/mailValidation/' + params.token,
    }).then((response) => {
        if (response.status == 200) {
            success = true;
        }
    }).catch(() => {

    })

    if (success) {
        return {
            redirect: {
                destination: '/auth?mail=ok',
                permanent: false,
            },
        }
    } else {
        return {
            redirect: {
                destination: '/auth?mail=ko',
                permanent: false,
            },
        }
    }
}