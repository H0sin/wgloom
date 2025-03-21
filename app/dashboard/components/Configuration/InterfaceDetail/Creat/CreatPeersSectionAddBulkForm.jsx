"use client";
import Button from "@/components/common/Button";
import { ConfigurationFormCard } from "../../ConfigurationFormCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { PostPeerInterface } from "@/api/peer";
import { Switch } from "@/components/ui/switch";
import { CirclePlus } from "lucide-react";

export const CreatPeersSectionAddBulkForm = () => {
  const [bulkValue, setBulkValue] = useState({
    name: "",
    publicKey: "",
    presharedKey: "",
    allowedIPs: [""],
    endPoint: "",
    bulk: true,
    count: 0,
    dns: "8.8.8.8,4.2.2.4",
    mtu: 1420,
    persistentKeepalive: 21,
    endpointAllowedIPs: "0.0.0.0/0",
    expireTime: 0,
    totalVolume: 0,
    status: "onhold",
    onHoldExpireDurection: 0,
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [expireTimevalue, setExpireTimeValue] = useState(new DateObject());
  const [onHoldDaysExpire, setOnHoldDaysExpire] = useState();
  const [changeOnHoldAndActiveData, setChangeOnHoldAndActiveData] =
    useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleInputBulkValue = (e) => {
    e.preventDefault();
    setBulkValue({
      ...bulkValue,
      [e.target.name]: +e.target.value ? e.target.value : +e.target.value,
    });
  };

  const handleChangeOnHoldActive = () => {
    setChangeOnHoldAndActiveData((prev) => !prev);

    setOnHoldDaysExpire(null);
    setExpireTimeValue(new DateObject());
  };

  useEffect(() => {
    if (
      onHoldDaysExpire !== null ||
      onHoldDaysExpire > 0 ||
      !changeOnHoldAndActiveData
    ) {
      const newOnHoldExpireDate = onHoldDaysExpire * 24 * 60 * 60;

      setBulkValue({
        ...bulkValue,
        status: "onhold",
        onHoldExpireDurection: newOnHoldExpireDate,
        expireTime: 0,
      });
    } else if (expireTimevalue || changeOnHoldAndActiveData) {
      const time = Math.floor(expireTimevalue.toDate().getTime());
      setBulkValue({
        ...bulkValue,
        expireTime: time,
        status: "active",
        onHoldExpireDurection: 0,
      });
    }
  }, [onHoldDaysExpire, expireTimevalue, changeOnHoldAndActiveData]);

  const submitAddBulkForm = async (e) => {
    e.preventDefault();
    const {
      count,
      dns,
      mtu,
      persistentKeepalive,
      endpointAllowedIPs,
      totalVolume,
      onHoldExpireDurection,
      status,
    } = bulkValue;
    console.log(bulkValue);

    // validation for IpAddress
    const validIpAddressRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,3}$/;

    if (count <= 0 || count >= 254) return toast.error("Bulk Count");
    if (status === "onhold") {
      if (
        onHoldDaysExpire <= 0 ||
        onHoldExpireDurection <= 0 ||
        isNaN(onHoldExpireDurection)
      )
        return toast.error("Hold Expire Days");
    }
    if (!dns) return toast.error("Bulk Dns");
    if (!mtu) return toast.error("Bulk MTU");
    if (!persistentKeepalive) return toast.error("Persistent Keepalive");
    if (!totalVolume || totalVolume <= 0) return toast.error("Total Volume");
    if (!endpointAllowedIPs || !validIpAddressRegex.test(endpointAllowedIPs))
      return toast.error("Endpoint Allowed IPs");

    setSubmitLoading(true);
    const InterfaceName = pathname.split("/")[2];
    await PostPeerInterface(InterfaceName, {
      ...bulkValue,
    })
      .then((res) => {
        const { isSuccess } = res;
        if (isSuccess) {
          toast.success(res.message);
          router.push(`/configuration/${InterfaceName}`);
        } else {
          toast.error(res.message);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <>
      <ConfigurationFormCard title={"Peers"}>
        <form onSubmit={submitAddBulkForm}>
          <div>
            <input
              type="number"
              name="count"
              onChange={handleInputBulkValue}
              placeholder="How many peers you want to add?"
              className={`w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none ${
                bulkValue.count >= 254 || bulkValue.count < 0
                  ? "border-red-500"
                  : ""
              }`}
            />
            <p className="text-xs mt-1">You can add up to 244 peers</p>

            {/* this is a gap */}
            <div className="h-[1px] bg-primaryLight my-6 rounded"></div>

            {/*expire time*/}
            <div className="flex flex-col mt-3">
              <div>
                <label className="flex items-center cursor-pointer justify-normal gap-2">
                  <span className="label-text font-semibold text-gray-500">
                    On Hold
                  </span>
                  <Switch
                    checked={changeOnHoldAndActiveData}
                    value={changeOnHoldAndActiveData}
                    onCheckedChange={handleChangeOnHoldActive}
                    className={`!bg-primaryLight ${
                      changeOnHoldAndActiveData && "!bg-[#00a96e]"
                    }`}
                  />
                  <span className="label-text font-semibold text-[#00a96e]">
                    Active
                  </span>
                </label>
              </div>
              <div className="w-full sm:w-fit flex items-center justify-between sm:justify-normal gap-2 mt-4 relative">
                {changeOnHoldAndActiveData ? (
                  <>
                    <span>Expire Time</span>
                    <DatePicker
                      value={expireTimevalue}
                      className="bg-dark"
                      inputClass="bg-transparent border border-primaryLight rounded-lg px-3 py-2 focus:outline-none"
                      calendarPosition="bottom-right"
                      onChange={setExpireTimeValue}
                    />
                  </>
                ) : (
                  <>
                    <span>Expire Time Duration</span>
                    <input
                      type="number"
                      onChange={(e) => setOnHoldDaysExpire(e.target.value)}
                      className="w-1/3 sm:w-fit bg-transparent rounded-lg border border-primaryLight border-stroke px-3 pr-12 py-2 outline-none"
                    />
                    <span className="absolute right-3 bottom-2.5 text-sm">
                      Days
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* this is a gap */}
            <div className="h-[1px] bg-primaryLight my-6 rounded"></div>

            {/*total volumes*/}
            <div className="w-full flex justify-between overflow-hidden mt-4">
              <div className="w-1/3">
                <label className="mb-1 block font-bold">GB</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Total Volume"
                  defaultValue={bulkValue.totalVolume}
                  onChange={(e) =>
                    setBulkValue({
                      ...bulkValue,
                      totalVolume: Math.round(
                        e.target.value * 1024 * 1024 * 1024
                      ),
                    })
                  }
                  className="w-full bg-transparent rounded-lg border border-primaryLight border-stroke px-3 py-2 outline-none"
                />
              </div>
              {bulkValue.totalVolume || bulkValue.totalVolume > 0 ? (
                <div className="w-1/2 flex flex-col justify-between gap-2 text-gray-400">
                  <p>
                    MB:{" "}
                    <span>
                      {(bulkValue.totalVolume / (1024 * 1024)).toLocaleString()}
                    </span>
                  </p>
                  <p>
                    KB:{" "}
                    <span>
                      {(bulkValue.totalVolume / 1024).toLocaleString()}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* this is a gap */}
          <div className="h-[1px] bg-primaryLight my-6 rounded"></div>

          <div>
            <label className="mt-2 mb-1 block font-bold">
              Endpoint Allowed IPs
            </label>
            <input
              type="text"
              name="endpointAllowedIPs"
              defaultValue={bulkValue.endpointAllowedIPs}
              onChange={(e) =>
                setBulkValue({
                  ...bulkValue,
                  endpointAllowedIPs: e.target.value,
                })
              }
              className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="mt-2 mb-1 block font-bold">DNS</label>
            <input
              type="text"
              name="dns"
              defaultValue={bulkValue.dns}
              onChange={(e) =>
                setBulkValue({ ...bulkValue, dns: e.target.value })
              }
              className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
            />
          </div>

          {/* this is a gap */}
          <div className="h-[1px] bg-primaryLight my-6 rounded"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mt-2 mb-1 block font-bold">MTU</label>
              <input
                type="number"
                name="mtu"
                defaultValue={bulkValue.mtu}
                onChange={handleInputBulkValue}
                className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="mt-2 mb-1 block font-bold">
                Persistent Keepalive
              </label>
              <input
                type="number"
                name="persistentKeepalive"
                defaultValue={bulkValue.persistentKeepalive}
                onChange={handleInputBulkValue}
                className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button disabled={submitLoading}>
              <CirclePlus size={18} />
              Add
            </Button>
          </div>
        </form>
      </ConfigurationFormCard>
    </>
  );
};
