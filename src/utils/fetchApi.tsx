const fetchApi = async (param: string) => {
  const response = await fetch(param);
  const data = await response.json();
  return data;
};

export default fetchApi;
