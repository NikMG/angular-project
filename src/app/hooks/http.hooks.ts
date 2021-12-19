export const useHttp = () => {
  const getBeers = async (url:string, params:string) => {
    try {
      if (params != '') {
        url = url + params;
      }
      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (e:any) {
      throw new Error(e);
    }
  }

  return { getBeers }
}
