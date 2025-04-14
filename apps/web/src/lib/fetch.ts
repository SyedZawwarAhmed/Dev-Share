const fetchAbsolute = (fetch: typeof window.fetch) => {
  return (baseUrl: string) =>
    (url: string, ...otherParams: RequestInit[]) =>
      url.startsWith("/")
        ? fetch(baseUrl + url, ...otherParams)
        : fetch(url, ...otherParams);
};

export const fetchApi = fetchAbsolute(fetch)(import.meta.env.VITE_API_URL);

export const getCookie = (key: string) => {
  const cookies = document.cookie.split(";");
  console.log("\n\n ---> apps/web/src/lib/fetch.ts:12 -> document: ", document);
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(key)
  );
  return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
};

