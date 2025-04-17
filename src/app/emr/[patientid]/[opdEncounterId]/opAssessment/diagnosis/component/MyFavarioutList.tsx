import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
const MyFavarioutList = (props: any) => {
  return (
    <>
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={props.setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto sm:px-6">
                        <div className="flex items-start justify-between mt-8">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            My Favourites List
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => props.setOpen(false)}
                            >
                              <span className="absolute -inset-0.5 z-1000">
                                <XMarkIcon className="w-5 h-5 " />
                              </span>
                              {/* <span className="sr-only">
                                          Close panel
                                        </span> */}
                            </button>
                          </div>
                        </div>

                        <div className="mt-18">
                          <div className="flow-root w-full relative">
                            {/* {favoriteDataa && favoriteDataa.length > 0 ? (
                              favoriteDataa.map((item: any, inx: number) => (
                                <>
                                  <div className="w-full flex gap-4 p-2 border mt-2">
                                    <div className="w-11/12">
                                      <p className="text-2xl font-semibold text-blue-400">
                                        Code: {item.snowmedCode}
                                      </p>
                                      <p className="text-sm">
                                        Description:
                                        {item.snowmedDescriptrion}
                                      </p>
                                    </div>
                                    <div className="w-1/12 relative">
                                      <div className="absolute right-0 top-1">
                                        <PlusCircleIcon
                                          className=" w-7 h-7 cursor-pointer text-blue-600"
                                          onClick={() => {
                                            handleAddtoDiagnosis(item);
                                            toast.success(
                                              "Added Successfully!"
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))
                            ) : (
                              <p>No Data</p>
                            )} */}
                          </div>
                        </div>
                        {/* ------------------------------------------------------------------------------------ */}
                        {/* <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a>Diagnosis Code</a>
                                    </h3>
                                    <h1>Description</h1>
                                    <p className="ml-4">
                                      DiagnosisDescriptrion
                                    </p>
                                  </div>

                                  <div className="mt-10">
                                    <div className="flow-root">
                                      <ul
                                        role="list"
                                        className="-my-6 divide-y divide-gray-200"
                                      >
                                        {favoriteDataa.map(
                                          (row: any, rowIndex: number) => (
                                            <li
                                              key={rowIndex}
                                              className="flex py-6"
                                            >
                                              <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>
                                                      <a>
                                                        {row &&
                                                          row.diagnosisCode}
                                                      </a>
                                                    </h3>
                                                    <h1>Description</h1>
                                                    <p className="ml-4">
                                                      {row &&
                                                        row.diagnosisDescriptrion}
                                                    </p>
                                                  </div>
                                                  <p className="mt-1 text-sm text-gray-500">
                                                    {row &&
                                                      row.diagnosisDescriptrion}
                                                  </p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                  <p className="text-gray-500">
                                                    Qty
                                                  </p>

                                                  <div className="flex">
                                                    <button
                                                      type="button"
                                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                      Remove
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div> */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default MyFavarioutList;
