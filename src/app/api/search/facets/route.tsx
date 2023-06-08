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
                    "facet": {
                      "all": true
                    }
                }
            }
        ]
    }
}`;

let apiKey = process.env.SITECORE_DISCOVERY_API_KEY as string;
let endpointUrl = process.env.SITECORE_DISCOVERY_API_URI as string;

export async function GET(request: Request) {
  const response: Response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
      "Accept-Encoding": "gzip, deflate, br",
      "Accept": "application/json"
    },
    cache: "no-cache",
    body: query,
  });

  const data = await response.json();
 
  return NextResponse.json({ data });
}
