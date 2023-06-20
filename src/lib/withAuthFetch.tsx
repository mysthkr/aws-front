export const withAuthFetch = async (url: string, cookies: { [x: string]: any; }): Promise<Response> => {
  return await fetch(`http://52.195.64.253:3010/api/v1/${url}`, {
    headers: {
      "Content-Type": "application/json",
      "uid": cookies["uid"],
      "client": cookies["client"],
      "access-token": cookies["access-token"],
    },
  });
};
