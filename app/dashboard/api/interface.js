import client from "../lib/axios";

const GetInterface = async () => {
  const { data } = await client.get(`/Interface`);
  return data;
};

const GetInterfaceByName = async (name) => {
  const { data } = await client.get(`/Interface/${name}`);
  return data;
};

const PostConfigurationInterface = async (payload) => {
  const { data } = await client.post(`/Interface`, payload);
  return data;
};

const UpdateConfigurationStatus = async (payload) => {
  const { data } = await client.put(
    `/Interface?name=${payload.name}&status=${payload.status}`,
    payload,
  );
  return data;
};

export {
  GetInterface,
  GetInterfaceByName,
  PostConfigurationInterface,
  UpdateConfigurationStatus,
};
