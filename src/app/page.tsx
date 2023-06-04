"use client";

import React, { useState } from "react";
import SkeletonResultItem from "./components/search/skeletonResultItem";
import ResultItem from "./components/search/resultItem";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchResults, setSearch] = useState(<></>);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState("hidden");
  const [loadMoreIsLoading, setLoadMoreIsLoading] = useState(<></>);
  const [offset, setOffset] = useState(3);

  const router = useRouter();

  async function handleSearchTerm(event: any) {
    setSearchTerm(event.target.value);
  }

  async function handleSearchKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleSearch();
    }
  }

  async function handleLoadMore() {
    setLoadMoreIsLoading(
      <>
        <span className="px-5 py-2.5">
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </span>
      </>
    );

    router.push(`?term=${searchTerm}&offset=${offset}`);

    const result = await fetch(
      `http://localhost:3000/api/search/discover?term=${searchTerm}&offset=${offset}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );

    const responseJson = await result.json();
    const widget = responseJson?.data?.widgets[0];

    if (!widget?.content) {
      setSearch(<>No more results found</>);
      return;
    }

    if (widget.total_item <= widget.limit + widget.offset) {
      setLoadMore("hidden");
    }

    const results = widget.content.map((hit: any, hitId: any) => {
      return <ResultItem item={hit} key={hitId} />;
    });

    setOffset(offset + 3);

    setLoadMoreIsLoading(
      <>
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Load more
        </span>
      </>
    );

    setSearch(
      <>
        {searchResults}
        {results}
      </>
    );
  }

  async function handleSearch() {
    if (!searchTerm) {
      return;
    }

    router.push(`?term=${searchTerm}`);

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
    const widget = responseJson?.data?.widgets[0];

    if (!widget?.content) {
      setSearch(<>No results found</>);
      return;
    }

    if (widget.total_item > widget.limit + widget.offset) {
      setLoadMoreIsLoading(
        <>
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Load more
          </span>
        </>
      );

      setLoadMore("block");
    }

    const results = widget.content.map((hit: any, hitId: any) => {
      return <ResultItem item={hit} key={hitId} />;
    });

    setSearch(<>{results}</>);
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
            onKeyDown={handleSearchKeyDown}
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

      <div className="grid grid-cols-3 gap-4 w-full items-stretch">{searchResults}</div>
      <button
        className={`${loadMore} mt-8 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800`}
        onClick={handleLoadMore}
      >
        {loadMoreIsLoading}
      </button>
    </main>
  );
}
