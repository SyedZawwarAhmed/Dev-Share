const fetchAbsolute = (fetch: typeof window.fetch) => {
  return (baseUrl: string) =>
    (url: string, ...otherParams: RequestInit[]) =>
      url.startsWith("/")
        ? fetch(baseUrl + url, ...otherParams)
        : fetch(url, ...otherParams);
};

export const fetchApi = fetchAbsolute(fetch)(import.meta.env.VITE_API_URL);
