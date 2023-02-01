import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { fetchAPIAuth } from "../lib/api";
import Link from "next/link";
import { getCookie } from "cookies-next";

const footer = [
  {
    name: "Facebook",
    href: "https://facebook.com/devinci.fablab",
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/devinci.fablab",
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

const Home = ({ posts }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(async function () {
    setUser(await fetchAPIAuth("/user/me", getCookie("jwt")));
    setRole(await fetchAPIAuth("/user/role", getCookie("jwt")));
  }, []);

  return (
    <Layout user={user} role={role}>
      {/*<Seo seo={homepage.seo} />*/}
      <div className="container xl:max-w-7xl mx-auto px-4 mt-16 lg:px-8 overflow-hidden">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Bienvenue sur le site du <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-blue-400 animate-gradient-x"> DeVinci FabLab </span>!
          </h2>
          <h3 className="text-lg md:text-xl md:leading-relaxed font-medium text-gray-600 lg:w-2/3 mx-auto">
            Le FabLab est un lieu d'échange et de création du pôle universitaire Léonard de Vinci. Que vous soyez étudiant ou non, venez découvrir nos créations, articles et tutos
            !
          </h3>
        </div>

        <center>
          <div className="relative max-w-md md:max-w-lg mb-20">
            <div className="absolute top-0 -left-4 w-56 h-56 lg:w-80 lg:h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 lg:w-80 lg:h-80 w-56 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 lg:w-80 lg:h-80 w-56 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="absolute rounded-lg inset-0 bg-gray-200 w-full h-full"></div>
            <div className="absolute rounded-lg placeholder w-full h-full animate-gradient-placeholder"></div>
            <video width="840" height="560" controls={false} autoPlay="autoplay" muted loop={true} className="mt-5 rounded-lg mx-auto shadow-lg relative">
              <source src={process.env.BASE_PATH + "/video/banner.mp4"} type="video/mp4" />
            </video>
          </div>
        </center>
      </div>
      <section className="py-10 max-w-4xl m-auto px-6 md:py-[90px] font-dm-sans">
        <div className="flex flex-col m-auto md:flex-row max-w-default md:space-x-10">
          <div className="order-1 w-full mt-[88px] md:mt-0">
            <div className="max-w-md text-center m-auto mb-10 md:max-w-4xl md:text-left md:m-0">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Le DeVinci FabLab
                <br /> Qui sommes nous ?
              </h2>
              <p className="mt-10 text-lg leading-6 text-gray-500 text-justify">
                Le DeVinci FabLab est une association étudiante du Pôle Léonard De Vinci qui s'occupe de l'espace de fabrication situé au fond du Leaning center. Le but de notre
                association est de vous aider dans vos projets académiques comme personnels, que ce soit avec des outils, des machines, des matériaux ou des formations. Nous gérons
                ainsi le parc d'imprimante 3D qui vous permettra de réaliser toutes les pièces que vous aurez conçues, ainsi que les ateliers mis à la disposition de tous où vous
                pourrez faire votre bricolage. L'espace a les mêmes horaires d'ouverture que le pôle donc n'hésitez pas à venir nous y rencontrer !
              </p>
            </div>
          </div>
          <div className="order-1 max-w-md m-auto md:m-0 md:w-full">
            <div className="items-center justify-center">
              <img className="rounded-lg shadow-2xl" src={process.env.BASE_PATH + "/photo/P1000136.jpg"} alt="Banner" />
              <div className="grid grid-cols-2 gap-2 content-start mt-5">
                <img className="rounded-lg shadow-lg" src={process.env.BASE_PATH + "/photo/P1000163.jpg"} alt="Banner" />
                <img className="rounded-lg shadow-lg" src={process.env.BASE_PATH + "/photo/P1000167.jpg"} alt="Banner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
      <div className="space-y-5 px-5">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Nos derniers articles</h1>
          <p className="text-lg leading-6 text-gray-500">Venez découvrir les actualités rédigés par les membres du FabLab.</p>
        </div>
        <div className={`grid grid-cols-1 gap-12 max-w-4xl m-auto ${posts.length > 2 ? 'lg:grid-cols-3' : posts.length == 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-sm'}`}>
          {posts.length > 0 ? posts.slice(0, 3).map(post => (
            <Link href={"/blog/" + post.slug}>
              <div className="flex flex-col cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300">
                <a className="block relative group rounded overflow-hidden">
                  <img src={post.feature_image || process.env.BASE_PATH + '/logo.png'} alt="Image blog" className="rounded-lg" />
                </a>
                <div className='flex space-x-3 py-3'>
                  <img src={post.authors[0].profile_image || process.env.BASE_PATH + '/logo_square.png'} className='w-10 h-10 rounded-full' />
                  <div>
                    <p className='font-medium -mb-1'>{post.authors[0].name}</p>
                    <p className='text-sm text-gray-400'><Moment format="Do MMM YYYY à HH:mm" locale="fr">{post.created_at}</Moment> · {post.reading_time} min</p>
                  </div>

                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-4 grow">
                  <a className="leading-7 text-gray-800 hover:text-gray-600">{post.title}</a>
                </h4>
              </div>
            </Link>
          )) : "Oups, il n'y a aucun article pour le moment !"}
        </div>
      </div>

      <div className="relative bg-white mt-10">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
        </div>
        <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-5">
          <div className="bg-gray-50 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Nous contacter</h2>
              <p className="mt-3 text-lg leading-6 text-gray-500">
                Nous serions ravis de pouvoir répondre à vos demandes ! Notre équipe reviendra vers vous dans les plus brefs délais.
              </p>
              <dl className="mt-8 text-base text-gray-500">
                <div>
                  <dt className="sr-only">Postal address</dt>
                  <dd>
                    <p>Pôle universitaire Léonard de Vinci</p>
                    <p>12 Avenue Léonard de Vinci</p>
                    <p>92400 Courbevoie</p>
                    <p>FRANCE</p>
                  </dd>
                </div>
                <div className="mt-6">
                  <dt className="sr-only">Numéro de téléphone</dt>
                  <dd className="flex">
                    <PhoneIcon className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <span className="ml-3">Numéro de téléphone</span>
                  </dd>
                </div>
                <div className="mt-3">
                  <dt className="sr-only">E-mail</dt>
                  <dd className="flex">
                    <MailIcon className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <span className="ml-3">fablab@devinci.fr</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
            <div className="max-w-lg mx-auto lg:max-w-none">
              <form action="#" method="POST" className="grid grid-cols-1 gap-y-6">
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    Nom et prénom
                  </label>
                  <input
                    type="text"
                    name="full-name"
                    id="full-name"
                    autoComplete="name"
                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    placeholder="Nom et prénom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    placeholder="E-mail"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    placeholder="Numéro de téléphone"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                    placeholder="Message"
                    defaultValue={''}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href={"/legals"}>
              <a key={"legals"} className="text-gray-400 hover:text-gray-500">
                <span className="text-md hover:text-black cursor-pointer">Mentions légales</span>
              </a>
            </Link>
            {footer.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">&copy; 2015-{new Date().getFullYear()} Devinci FabLab. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
