export default function ResultItem(item: any) {
  const hit = item.item;

  let name = hit.name;
  let description = hit.description;

  if(hit.highlight) {
    if(hit.highlight.name) {
      name= hit.highlight.name;
    }

    if(hit.highlight.description) {
      description = hit.highlight.description;
    }
  }

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="rounded-t-lg" src={hit.image_url} alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          dangerouslySetInnerHTML={{__html: name}}/>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"
        dangerouslySetInnerHTML={{__html: description}}/>
        <a
          href={hit.url}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-search-primary-500 rounded-lg hover:bg-search-primary-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-search-primary-400 dark:hover:bg-search-primary-500 dark:focus:ring-search-primary-600"
        >
          Read more
          <svg
            aria-hidden="true"
            className="w-4 h-4 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
}
