"use client";

import {
  useRef,
  useState,
  MouseEvent,
  KeyboardEvent,
  useEffect,
  ChangeEvent,
} from "react";
import ResultItem from "./components/search/resultItem";

type SearchState = {
  term: string;
  filter: Filter[] | undefined;
  offset: number;
};

type Filter = {
  name: string;
  value: string[];
};

type SearchResults = {
  hits: any[];
  facets: any[];
  total: number;
};

export default function Page() {
  const [searchState, setSearchState] = useState<SearchState>();
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const searchInput = useRef<HTMLInputElement>(null);

  function SetSearchState(): void {
    const searchTerm = searchInput.current?.value ?? "";

    setSearchState({
      term: searchTerm,
      offset: 0,
      filter: undefined,
    });
  }

  function handleSearchButtonOnClick(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    SetSearchState();
  }

  function handleSearchInputKeyUp(
    event: KeyboardEvent<HTMLInputElement>
  ): void {
    if (event.code === "Enter") {
      SetSearchState();
    }
  }

  function handleFilterOnChange(event: ChangeEvent<HTMLInputElement>): void {
    const key = event.currentTarget.getAttribute("facet-group");
    const value = event.target.value;
    
    if(!key) {
      return;
    }

    let newFilterValue: Filter[];
    let existingFilter: any;
    if (searchState?.filter) {
      newFilterValue = searchState?.filter;
      existingFilter = newFilterValue?.find((x) => x.name === key);
    } else {
      newFilterValue = [];
    }

    if (existingFilter) {
      if (!existingFilter.value.find((x: string) => x === value)) {
        existingFilter.value = [...existingFilter.value, value];
      } else {
        const valueIndex = existingFilter.value.indexOf(value);
        existingFilter.value.splice(valueIndex, 1);
      }
    } else {
      newFilterValue.push({
        name: key,
        value: [value],
      });
    }

    console.log(newFilterValue);

    setSearchState({
      offset: 0,
      filter: newFilterValue,
      term: searchState?.term ?? "",
    });
  }

  async function GetResults() {
    if (!searchState?.term) {
      return;
    }

    let filterString = "";
    searchState?.filter?.map(filterGroup => {
      if(filterString) {
        filterString += "|";
      }
      
      if(filterGroup.value.length >= 0) {
        filterString += `${filterGroup.name}:${filterGroup.value.join()}`;
      }
    })

    const searchRequestUrl = `http://localhost:3000/api/search/discover?term=${searchState?.term}&offset=${searchState?.offset}&filter=${filterString}`;

    const response = await fetch(searchRequestUrl);
    const results = await response.json();

    console.log(results.data);
    const resultWidget = results?.data?.widgets[0];

    setSearchResults({
      hits: resultWidget.content,
      total: resultWidget.total_item,
      facets: resultWidget.facet,
    });
  }

  useEffect(() => {
    if (searchState?.term) {
      console.log(searchState?.term);
      GetResults();
    }
  }, [searchState]);

  return (
    <>
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
              ref={searchInput}
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search DotPeekser..."
              required
              onKeyUp={handleSearchInputKeyUp}
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-search-primary-500 hover:bg-search-primary-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-search-primary-400 dark:hover:bg-search-primary-500 dark:focus:ring-search-primary-600"
              onClick={handleSearchButtonOnClick}
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex w-full gap-8 pb-8">
          {searchResults?.facets?.map((facetGroup, key) => {
            return (
              <div className="" key={key}>
                <h3 className="mb-5 text-lg font-medium capitalize text-gray-900 dark:text-white">
                  {facetGroup?.name}
                </h3>
                <ul className="flex w-full gap-6">
                  {facetGroup?.value?.map((facet: any, key: any) => {
                    return (
                      <li key={key}>
                        <input
                          facet-group={facetGroup?.name}
                          type="checkbox"
                          id={facet?.text}
                          value={facet?.text}
                          className="hidden peer"
                          onChange={handleFilterOnChange}
                        />
                        <label
                          htmlFor={facet?.text}
                          className="inline-flex items-center justify-between w-full px-4 py-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <div className="block">
                            <div className="font-semibold">
                              {facet?.text} ({facet?.count})
                            </div>
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-4 w-full items-stretch">
          {searchResults?.hits?.map((hit: any, key: any) => {
            return <ResultItem item={hit} key={key} />;
          })}
        </div>
        <button
          className={`mt-8 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800`}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Load more
          </span>
        </button>
      </main>
    </>
  );
}
