"use client";

import React, { useState } from "react";
import SkeletonResultItem from "./components/search/skeletonResultItem";
import ResultItem from "./components/search/resultItem";

const skeletonResult = `<div
role="status"
className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
>
<div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
  <svg
    className="w-12 h-12 text-gray-200 dark:text-gray-600"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 640 512"
  >
    <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
  </svg>
</div>
<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-4"></div>
<div className="h-8 w-28 bg-gray-200 rounded-md dark:bg-gray-700"></div>
<span className="sr-only">Loading...</span>
</div>`;

export default function Home() {
  const [searchResults, setSearch] = useState(<></>);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleSearchTerm(event: any) {
    setSearchTerm(event.target.value);
  }

  async function handleSearch() {
    setSearch(
      <>
        <SkeletonResultItem />
        <SkeletonResultItem />
        <SkeletonResultItem />
      </>
    );

    const result = await fetch(
      `http://localhost:3000/api/search/discover?term=${searchTerm}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );

    const responseJson = await result.json();
    const results = responseJson.data.widgets[0].content.map((hit: any, hitId: any) => {
      return <ResultItem item={hit} key={hitId} />
    })

    setSearch(
      <>
        {results}
      </>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full mb-8">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search DotPeekser..."
            required
            onChange={handleSearchTerm}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-search-primary-500 hover:bg-search-primary-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-search-primary-400 dark:hover:bg-search-primary-500 dark:focus:ring-search-primary-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">{searchResults}</div>
    </main>
  );
}
