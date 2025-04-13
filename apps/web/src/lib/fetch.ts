const fetchAbsolute = (fetch) => {
  return (baseUrl) =>
    (url, ...otherParams) =>
      url.startsWith("/")
        ? fetch(baseUrl + url, ...otherParams)
        : fetch(url, ...otherParams);
};

export const fetchApi = fetchAbsolute(fetch)(import.meta.env.VITE_API_URL);
