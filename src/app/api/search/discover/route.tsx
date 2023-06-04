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
                        "keyphrase": "{{searchTerm}}"
                    }
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
  if(offset) {
    termQuery = termQuery.replace("{{offset}}", offset);
  }

  const response: Response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
      "Accept-Encoding": "gzip, deflate, br",
      "Accept": "application/json"
    },
    cache: "no-cache",
    body: termQuery,
  });

  const data = await response.json();
 
  return NextResponse.json({ data });
}
