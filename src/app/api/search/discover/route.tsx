import { NextResponse } from "next/server";

const query = `{
    "context": {
        "page": {
            "uri": "/"
        }
    },
    "widget": {
        "items": [
            {
                "entity": "content",
                "rfk_id": "dotpeekser-search",
                "search": {
                    "content": {},
                    "limit": 3,
                    "offset": {{offset}},
                    "query": {
                        "keyphrase": "{{searchTerm}}",
                        "highlight": {
                          "fields": [
                            "description",
                            "name"
                          ],
                          "pre_tag": "<b>",
                          "post_tag": "</b>"
                        }
                    },
                    "facet": {
                      "all": true
                    }
                    {{filters}}
                }
            }
        ]
    }
}`;

let apiKey = process.env.SITECORE_DISCOVERY_API_KEY as string;
let endpointUrl = process.env.SITECORE_DISCOVERY_API_URI as string;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term") ?? "";
  let termQuery = query.replace("{{searchTerm}}", term);

  const offset = searchParams.get("offset") ?? "0";
  if (offset) {
    termQuery = termQuery.replace("{{offset}}", offset);
  }

  const filter = searchParams.get("filter") ?? "";
  if (filter) {
    // tags:Sitecore|type:article
    const filterJsonString = JSON.stringify(convertFilterStringToJson(filter));
    termQuery = termQuery.replace(
      "{{filters}}",
      ', "filter":' + filterJsonString
    );
  }

  if (termQuery.indexOf("{{filters}}") > -1) {
    termQuery = termQuery.replace("{{filters}}", "");
  }

  const response: Response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "application/json",
    },
    cache: "no-cache",
    body: termQuery,
  });

  const data = await response.json();

  return NextResponse.json({ data });
}

interface Filter {
  type: string;
  name?: string;
  values?: string[];
  filters?: Filter;
}

function convertFilterStringToJson(inputString: string): Filter {
  const keyValuePairs: string[] = inputString.split("|");
  let result: Filter = {} as Filter;
  let response = result;

  for (let i = 0; i < keyValuePairs.length; i++) {
    const pair = keyValuePairs[i];

    const filterGroupAndValues = pair.split(":");
    const filterGroupKey = filterGroupAndValues[0];
    const filterGroupValues = filterGroupAndValues[1].split(",");

    if (!filterGroupValues) {
      continue;
    }

    console.log(i);
    console.log(keyValuePairs.length);

    result.name = filterGroupKey;
    result.values = filterGroupValues;

    if (i + 1 === keyValuePairs.length) {
      result.type = "allOf";
    } else {
      result.type = "or";
      result.filters = {} as Filter;

      result = result.filters;
    }
  }

  return response;
}
