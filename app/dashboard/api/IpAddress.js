import client from "../lib/axios";

const GetIpAddress = async (name) => {
  const { data } = await client.get(`/IpAddress/${name}`);
  return data;
};

export { GetIpAddress };
