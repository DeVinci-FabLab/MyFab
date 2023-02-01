import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import TablesAdmin from './tablesAdmin'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import STLViewer from 'stl-viewer'
import { getCookie } from 'cookies-next'
import axios from 'axios'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function OverviewSTLAdmin({ tickets }) {
  var urlObject = [];

  async function getUrlSTL(id) {
    const cookie = getCookie("jwt");
    const response = await axios({
      method: 'GET',
      url: process.env.API+'/api/ticket/' + id + '/file',
      headers: {
        'dvflCookie': cookie
      },
    });
  }

  useEffect(function () {
    tickets.map(r => getUrlSTL(r.id));
  }, []);

  return (
    <section className="">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">

          {/* Tickets à traiter */}
          <div className="w-full md:px-6 mt-5 mb-8 lg:mb-0">
            {tickets.filter(r => r.step < 3).length > 0 ? <div>

            </div>
              :
              <div className="p-4 md:p-5 rounded flex justify-between text-gray-700 bg-gray-100">
                <p>
                  Il n'y a aucun ticket à traiter. Vous pouvez accéder à l'historique des tickets déjà traités en cliquant sur le bouton suivant.
                </p>
                <Link href="/panel/admin/history"><a className="inline-flex items-center space-x-1 font-semibold ml-2 text-indigo-600 hover:text-indigo-400" >
                  <span>Accéder à l'historique</span>
                  <svg className="hi-solid hi-arrow-right inline-block w-4 h-4" fillName="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </a>
                </Link>
              </div>
            }
          </div>


        </div>
      </div>
    </section>
  )
}
