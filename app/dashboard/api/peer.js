import client from "../lib/axios";

const GetPeer = async (query) => {
  const { data } = await client.get(`/Peer${query}`);
  return data;
};

const PostPeerInterface = async (interfacename, payload) => {
  const { data } = await client.post(`/Peer/${interfacename}`, payload);
  return data;
};

const GetPeerConfig = async (name) => {
  const { data } = await client.get(`/Peer/GetPeerConfig/${name}`);
  return data;
};

const UpdatePeerInterface = async (interfacename, payload) => {
  const { data } = await client.put(`/Peer/${interfacename}`, payload);
  return data;
};

export { GetPeer, GetPeerConfig, PostPeerInterface, UpdatePeerInterface };
