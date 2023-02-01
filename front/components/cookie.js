import { CursorClickIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { setCookies } from 'cookies-next';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react';

export default function Cookie() {
    const [show, setShow] = useState(true);

    const router = useRouter();

  return (<div></div>);
  /*
    <>
      <div className={`fixed inset-x-0 bottom-0 ${show?'':'hidden'}`}>
        <div className="bg-indigo-600">
          <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                  <CursorClickIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <p className="ml-3 font-medium text-white truncate">
                  <span className="md:hidden">Vous devez accepter les cookies !</span>
                  <span className="hidden md:inline">L'utilisation du site web implique l'acceptation de cookies pour le fonctionnement de nos services.</span>
                  <Link href={'/rules'}><span className='underline ml-1 cursor-pointer hidden md:inline'>En savoir plus</span></Link>
                </p>
              </div>
              <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                
                <a
                  onClick={()=>{setCookies('cookie', true); setShow(false)}}
                  className="cursor-pointer flex  items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  J'ai compris
                </a>
              </div>
              <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3 md:hidden">
                <button
                  type="button"
                  onClick={()=>router.push('/rules')}
                  className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                >
                  <span className="sr-only">En savoir plus</span>
                  <QuestionMarkCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  */
}
