import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import librantLogo from '../../../assets/img/logo.png';
import Transition from '../utils/Transition';

function Sidebar({ sidebarOpen, setSidebarOpen, Requests }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [hovered, sethovered] = useState(false)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        onMouseOver={() => sethovered(true)}
        onMouseLeave={() => sethovered(false)}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-100 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        } ${hovered ? 'lg:w-64' : 'lg:w-20'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-900 hover:text-slate-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end="true" to="/" className="flex">
            <img src={librantLogo} className="w-14" alt="" />
            <span className="text-black font-bold text-3xl my-auto pl-5">Librant</span>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-800 font-semibold pl-3">
                <span className={`hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6 ${hovered ? 'lg:hidden' : 'lg:block'}`} aria-hidden="true">
                  •••
                </span>
              <span className={`lg:sidebar-expanded:block 2xl:block ${hovered ? 'lg:block' : 'lg:hidden'}`}>Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Messages */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('messages') && 'bg-slate-900'}`}>
                <NavLink
                  end="true"
                  to="/dashboard"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('messages') ? 'hover:text-slate-800' : 'hover:text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'
                          }`}
                          d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                        />
                        <path
                          className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'
                          }`}
                          d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                        />
                        <path
                          className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                          d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                        />
                      </svg>
                      <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        Dashboard
                      </span>
                    </div>
                  </div>
                </NavLink>
              </li>
              {/* Books */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('ecommerce') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                          <svg className=' shrink-0 h-6 w-6' viewBox="0 0 24 24">
                            <defs>
                              <clipPath id="b">
                                <rect width="24" height="24"/>
                              </clipPath>
                            </defs>
                            <g id="a" clipPath="url(#b)">
                              <rect className={`fill-current ${pathname.includes('books') ? 'text-indigo-300' : 'text-slate-400'}`} width="16" height="16" rx="1" transform="translate(5 6)"/>
                              <rect className={`fill-current ${pathname.includes('books') ? 'text-indigo-500' : 'text-slate-600'}`} width="16" height="16" rx="1" transform="translate(3 4)"/>
                              <path className={`fill-current ${pathname.includes('books') ? 'text-indigo-600' : 'text-slate-700'}`} d="M0,0H6A0,0,0,0,1,6,0V9a1,1,0,0,1-1,1H1A1,1,0,0,1,0,9V0A0,0,0,0,1,0,0Z" transform="translate(11 4)"/>
                              <path className={`fill-current ${pathname.includes('books') ? 'text-indigo-600' : 'text-slate-700'}`} d="M12.48,14s.251.124.66-.3a2.291,2.291,0,0,0,.528-1.024s.239-1.057.5-1.057.5.693.5.693a4.079,4.079,0,0,0,.462,1.222c.3.421.429.462.429.462v.924s-2.08.66-2.179.693A11.1,11.1,0,0,1,12.48,14Z"/>
                              </g>
                          </svg>
                            <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                              Books
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className={`lg:sidebar-expanded:block 2xl:block ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/showbooks"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className={`text-sm text-black font-medium lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                                Show Books
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Docs */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('ecommerce') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                          <svg className=' shrink-0 h-6 w-6' viewBox="0 0 24 24">
                          <path className={`fill-current ${pathname.includes('docs') ? 'text-indigo-300' : 'text-slate-400'}`} id="Icon_ionic-md-document" data-name="Icon ionic-md-document" d="M15.877,3.375H8.651a1.9,1.9,0,0,0-1.9,1.9V21.248a1.9,1.9,0,0,0,1.9,1.9H20.06a1.9,1.9,0,0,0,1.9-1.9V9.459Zm-.761,6.845V4.9L20.44,10.22Z" transform="translate(-6.75 -2.375)"/>
                          <path className={`fill-current ${pathname.includes('docs') ? 'text-indigo-500' : 'text-slate-600'}`} id="Icon_ionic-md-document-2" data-name="Icon ionic-md-document" d="M15.877,3.375H8.651a1.9,1.9,0,0,0-1.9,1.9V21.248a1.9,1.9,0,0,0,1.9,1.9H20.06a1.9,1.9,0,0,0,1.9-1.9V9.459Zm-.761,6.845V4.9L20.44,10.22Z" transform="translate(-5.75 -3.375)"/>
                          <path className={`fill-current ${pathname.includes('docs') ? 'text-indigo-600' : 'text-slate-700'}`} id="Path_1" data-name="Path 1" d="M12.745,3.609V9.016h5.4Z" transform="translate(-3.395 -2.113)" fill="#4f46e5"/>
                          <path id="Icon_awesome-bars" data-name="Icon awesome-bars" d="M.276,5.462H7.458a.276.276,0,0,0,.276-.276V4.495a.276.276,0,0,0-.276-.276H.276A.276.276,0,0,0,0,4.495v.691A.276.276,0,0,0,.276,5.462Zm0,2.762H7.458a.276.276,0,0,0,.276-.276V7.257a.276.276,0,0,0-.276-.276H.276A.276.276,0,0,0,0,7.257v.691A.276.276,0,0,0,.276,8.224Zm0,2.762H7.458a.276.276,0,0,0,.276-.276v-.691a.276.276,0,0,0-.276-.276H.276A.276.276,0,0,0,0,10.019v.691A.276.276,0,0,0,.276,10.986Z" transform="translate(4.738 4.995)" fill="#fff"/>
                            
                          </svg>
                            <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                              Documents
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className={`lg:sidebar-expanded:block 2xl:block ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/showdocs"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className={`text-sm text-black font-medium lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                                Show Documents
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Messages */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('messages') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/requests"
                  className={`block text-slate-900 truncate transition duration-150 ${
                    pathname.includes('campaigns') ? 'hover:text-slate-800' : 'hover:text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <svg width="24" height="24" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={`fill-current ${pathname.includes('requests') ? 'text-indigo-500' : 'text-slate-600'}`} d="M6.09557 0H2.61239C0.870796 0 0 0.751993 0 2.25598V7.14393C0 7.35073 0.195929 7.51993 0.435398 7.51993H6.09557C7.83717 7.51993 8.70796 6.76794 8.70796 5.26395V2.25598C8.70796 0.751993 7.83717 0 6.09557 0ZM5.87787 4.04196H4.68053V5.07595C4.68053 5.23011 4.53249 5.35795 4.35398 5.35795C4.17547 5.35795 4.02743 5.23011 4.02743 5.07595V4.04196H2.83009C2.65157 4.04196 2.50354 3.91412 2.50354 3.75996C2.50354 3.60581 2.65157 3.47797 2.83009 3.47797H4.02743V2.44398C4.02743 2.28982 4.17547 2.16198 4.35398 2.16198C4.53249 2.16198 4.68053 2.28982 4.68053 2.44398V3.47797H5.87787C6.05639 3.47797 6.20442 3.60581 6.20442 3.75996C6.20442 3.91412 6.05639 4.04196 5.87787 4.04196Z" fill="#4F46E5"/>
                        <rect className={`fill-current ${pathname.includes('requests') ? 'text-indigo-500' : 'text-slate-600'}`} x="2" y="2" width="5" height="4" fill="#4F46E5"/>
                        <path className={`fill-current ${pathname.includes('requests') ? 'text-indigo-300' : 'text-slate-400'}`} d="M6.37409 4.61788L6.39742 4.07829C6.4018 3.96018 6.46223 3.76475 6.52551 3.66243L6.77201 3.26379C7.25052 2.48998 7.05334 1.49872 6.33418 1.05401C5.61172 0.610205 4.63811 0.874525 4.1596 1.64834L3.91441 2.04484C3.85114 2.14716 3.7033 2.28854 3.60157 2.34646L3.12926 2.6084C2.94761 2.71119 2.81833 2.87584 2.77706 3.06249C2.73447 3.25127 2.77919 3.44985 2.90385 3.60355C3.07095 3.81297 3.25322 4.0023 3.44869 4.17917C3.46791 4.19694 3.48844 4.21259 3.50766 4.23036C3.53284 4.25183 3.56 4.27452 3.58716 4.29721C3.63354 4.33768 3.68124 4.37601 3.73224 4.41344C3.84948 4.50363 3.97267 4.58864 4.09982 4.66727C4.22498 4.74466 4.35409 4.81566 4.48517 4.87904C4.5335 4.90303 4.58183 4.92702 4.62949 4.94765C4.66788 4.9655 4.70628 4.98335 4.74599 4.99907C4.76916 5.01045 4.79365 5.0197 4.81814 5.02895C5.06437 5.12817 5.3218 5.20484 5.58381 5.26078C5.77105 5.29995 5.96472 5.24879 6.11789 5.12544C6.27238 4.99996 6.36458 4.81533 6.37409 4.61788ZM5.43123 2.83841C5.37586 2.92794 5.2635 2.95865 5.18006 2.90705C5.09662 2.85545 5.07389 2.74121 5.12926 2.65168L5.5379 1.99084C5.59327 1.90131 5.70563 1.8706 5.78907 1.9222C5.87251 1.97379 5.89524 2.08804 5.83987 2.17757L5.43123 2.83841Z" fill="#C7D2FE"/>
                        <path className={`fill-current ${pathname.includes('requests') ? 'text-indigo-300' : 'text-slate-400'}`} d="M4.52512 5.22766C4.28877 5.42334 3.95884 5.46391 3.70058 5.30421C3.54364 5.20716 3.43086 5.04312 3.39674 4.85405C3.37271 4.75078 3.37776 4.63603 3.40399 4.53143C3.42718 4.55167 3.45169 4.56977 3.47687 4.59123C3.5186 4.62588 3.56233 4.66176 3.60737 4.69551C3.71402 4.77619 3.82529 4.85384 3.94051 4.92509C4.05375 4.99511 4.17094 5.05874 4.28879 5.11688C4.33314 5.13841 4.37618 5.16208 4.41987 5.18026C4.45429 5.19565 4.48871 5.21104 4.52512 5.22766Z" fill="#C7D2FE"/>
                      </svg>
                      </svg>
                      <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                        Requests
                      </span>
                    </div>
                    {/* Badge */}
                    <div className="flex flex-shrink-0 ml-2">
                      {
                        Requests > 0 ? (
                          <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded">{Requests}</span>
                        ) : (<></>)
                      }
                    </div>
                  </div>
                </NavLink>
              </li>
              
              {/* Calendar */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('calendar') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/events"
                  className={`block text-slate-900 truncate transition duration-150 ${
                    pathname.includes('campaigns') ? 'hover:text-slate-800' : 'hover:text-black'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path className={`fill-current ${pathname.includes('events') ? 'text-indigo-500' : 'text-slate-600'}`} d="M1 3h22v20H1z" />
                      <path
                        className={`fill-current ${pathname.includes('events') ? 'text-indigo-300' : 'text-slate-400'}`}
                        d="M21 3h2v4H1V3h2V1h4v2h10V1h4v2Z"
                      />
                    </svg>
                    <span className={`text-sm text-black font-medium ml-3 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${hovered ? 'lg:opacity-100' : 'lg:opacity-0'}`}>
                      Events
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
