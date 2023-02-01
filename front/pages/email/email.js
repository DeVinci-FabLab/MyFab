import React from "react";

const Email = () => {

    return (
        <div className="font-sans min-w-screen min-h-screen bg-blue-50 py-8 px-4">

            <div className="max-w-md mx-auto">

                <div className="bg-white p-8 shadow-md">

                    <div className="p-5 h-64 flex flex-col items-center justify-center text-center tracking-wide leading-normal bg-gray-100 -mx-8 -mt-8">
                        <img src="../logo.png" width="50%" />
                        <p className="text-lg  font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500 mt-5">Votre compte est presque prêt !</p>
                    </div>

                    <div className="space-y-1 py-8 border-b">
                    <div className="mb-5">
                    </div>
                        <p>Bonjour <span className="font-bold text-indigo-500">Elias</span> !</p>
                        <p>Vous devez validé votre adresse e-mail pour accéder à votre compte. Cliquez-sur le bouton ci-dessus ou copier le lien suivant :</p>
                        <p className="text-xs text-gray-400">
                            https://fablab.com/verify/45TFR23Y6HTG345TF
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <button className="bg-indigo-700 text-white p-2 rounded-md hover:bg-indigo-500"><a href="/panel/12345">Vérifier mon adresse e-mail</a></button>

                    </div>

                </div>

                <div className="text-center text-sm text-grey-darker mt-8">


                    <p className="leading-loose">
                        Un problème ? Une question ? Contactez-nous à <a href="#" className="text-grey-darkest">fablab@devinci.fr</a>
                    </p>

                </div>


            </div>

        </div>

    );
};

export default Email;
