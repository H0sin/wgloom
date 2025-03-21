import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { UpdatePeerInterface } from "@/api/peer";
import toast from "react-hot-toast";
import { Import } from "lucide-react";

export const EditPeer = ({ EditPeerData }) => {
  const {
    name,
    dns,
    mtu,
    endPoint,
    persistentKeepalive,
    endpointAllowedIPs,
    expireTime,
    totalVolume,
  } = EditPeerData;

  const [editedPeerValue, setEditedPeerValue] = useState({
    endPoint: endPoint,
    dns: dns,
    mtu: mtu,
    persistentKeepalive: persistentKeepalive,
    endpointAllowedIPs: endpointAllowedIPs,
    expireTime: 0,
    totalVolume: totalVolume,
  });
  const [expireDays, setExpireDays] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChangeEditedPeerValue = (e) => {
    const { name, type, value } = e.target;
    e.preventDefault();
    setEditedPeerValue({
      ...editedPeerValue,
      [name]: type === "number" ? +value : value,
    });
  };

  useEffect(() => {
    const currentDate = new Date();
    const newDate = new Date(
      currentDate.getTime() + expireDays * 24 * 60 * 60 * 1000,
    );
    const newExpireDate = Math.floor(newDate.getTime() / 1000);
    setEditedPeerValue({ ...editedPeerValue, expireTime: newExpireDate });
  }, [expireDays]);

  const submitEditPeerForm = async (e) => {
    e.preventDefault();
    await setSubmitLoading(true);
    await UpdatePeerInterface(name, editedPeerValue)
      .then((res) => {
        const { isSuccess, message } = res;
        if (isSuccess) {
        } else {
          toast.error(message);
        }
      })
      .catch(() => {
        toast.error("failed");
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    console.log(editedPeerValue);
  };

  return (
    <form
      onSubmit={submitEditPeerForm}
      className="flex flex-col gap-2 text-primary"
    >
      <div>
        <label className="mb-1 block text-sm">DNS</label>
        <input
          type="text"
          name="dns"
          defaultValue={dns}
          onChange={handleChangeEditedPeerValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">MTU</label>
        <input
          type="number"
          name="mtu"
          defaultValue={mtu}
          onChange={handleChangeEditedPeerValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Endpoint</label>
        <input
          type="text"
          name="endPoint"
          defaultValue={endPoint}
          onChange={handleChangeEditedPeerValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Persistent keepalive</label>
        <input
          type="number"
          name="persistentKeepalive"
          defaultValue={persistentKeepalive}
          onChange={handleChangeEditedPeerValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Endpoint Allowed IPs </label>
        <input
          type="text"
          name="endpointAllowedIPs"
          defaultValue={endpointAllowedIPs}
          onChange={handleChangeEditedPeerValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Expire Time</label>
        <input
          type="number"
          name="expireTime"
          defaultValue={expireTime}
          onChange={(e) => setExpireDays(e.target.value)}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Total Volume</label>
        <input
          type="number"
          name="totalVolume"
          defaultValue={totalVolume}
          onChange={handleChangeEditedPeerValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
        />
      </div>
      <div className="flex justify-end mt-2 text-white">
        <Button disabled={submitLoading}>
          Edit <Import size={20} />
        </Button>
      </div>
    </form>
  );
};
