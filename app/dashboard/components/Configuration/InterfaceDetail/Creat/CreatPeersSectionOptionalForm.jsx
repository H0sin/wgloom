"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import Button from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  CircleMinus,
  CirclePlus,
  Eclipse,
  Eraser,
  Plus,
  Repeat,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { GetIpAddress } from "@/api/IpAddress";
import toast from "react-hot-toast";
import { PostPeerInterface } from "@/api/peer";

export const CreatPeersSectionOptionalForm = () => {
  const [optionalPeerValue, setOptionalPeerValue] = useState({
    name: "",
    publicKey: "",
    presharedKey: "",
    allowedIPs: [],
    endPoint: "",
    bulk: false,
    count: 0,
    dns: "8.8.8.8,4.2.2.4",
    mtu: 1420,
    persistentKeepalive: 21,
    endpointAllowedIPs: "0.0.0.0/0",
    expireTime: 0,
    totalVolume: 0,
    status: "",
    onHoldExpireDurection: 0,
  });
  const [interfaceIpAdresses, setInterfaceIpAdresses] = useState([]);
  const [allowedIPInputValue, setAllowedIPInputValue] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  //   generateKeys for publicKey and privateKey
  const generateKeys = () => {
    // Generate the key pair
    const keyPair = nacl.box.keyPair();

    // Convert keys to Base64 for easy display
    const publicKey = naclUtil.encodeBase64(keyPair.publicKey);
    const privateKey = naclUtil.encodeBase64(keyPair.secretKey);

    setOptionalPeerValue({
      ...optionalPeerValue,
      publicKey: publicKey,
      privateKey: privateKey,
    });
  };

  useEffect(() => {
    generateKeys();
  }, []);

  useLayoutEffect(() => {
    GetIpAddress(pathname.split("/")[2]).then((res) => {
      setInterfaceIpAdresses(res.data.sort((a, b) => a.id - b.id));
    });
  }, [pathname]);

  const handleChangeOptionalFormValue = (e) => {
    e.preventDefault();
    const { name, type, value } = e.target;
    setOptionalPeerValue({
      ...optionalPeerValue,
      [name]: type === "number" ? +value : value,
    });
  };

  const handleAddIP = (ipAdress) => {
    const { ip, available } = ipAdress;
    if (available) {
      if (ip && !optionalPeerValue.allowedIPs.includes(ip)) {
        setOptionalPeerValue({
          ...optionalPeerValue,
          allowedIPs: [...optionalPeerValue.allowedIPs, ip],
        });
        // setOptionalPeerValue((prevState) => ({
        //   ...prevState,
        //   allowedIPs: [...prevState.allowedIPs, ip],
        // }));
      }
    } else {
      toast.error("Please Enter Valid IP");
    }
  };

  const handleDeleteIP = (ip) => {
    setOptionalPeerValue((prevState) => ({
      ...prevState,
      allowedIPs: prevState.allowedIPs.filter((item) => item !== ip),
    }));
  };

  const handleManualInputChange = () => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (ipRegex.test(allowedIPInputValue.trim())) {
      handleAddIP({ ip: allowedIPInputValue, available: true });
      setAllowedIPInputValue("");
    } else {
      toast.error("Please Enter Valid IP");
    }
  };

  const handleClearAllIps = () => {
    setOptionalPeerValue((prevState) => ({
      ...prevState,
      allowedIPs: [],
    }));
  };

  const submitOptoinalPeerForm = async (e) => {
    e.preventDefault();
    const { name, allowedIPs } = optionalPeerValue;
    if (!name) return toast.error("Name is required");
    if (allowedIPs.length === 0) return toast.error("Allowed IPs");
    console.log(optionalPeerValue);

    setSubmitLoading(true);
    const InterfaceName = pathname.split("/")[2];
    await PostPeerInterface(InterfaceName, {
      ...optionalPeerValue,
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
      <form onSubmit={submitOptoinalPeerForm} className="flex flex-col gap-3">
        <div>
          <label className="mb-2 block font-bold">Name</label>
          <input
            type="text"
            name={"name"}
            onChange={handleChangeOptionalFormValue}
            className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-bold">
            PRIVATE KEY{" "}
            <span className="text-[#E04000] text-sm font-light">
              &#x0028;Required for Qr Code and Download&#x0029;
            </span>
          </label>
          <div className="w-full flex items-center">
            <input
              type="text"
              readOnly
              value={optionalPeerValue.privateKey}
              className="w-full bg-transparent rounded-l-lg border border-r-0 border-[#666666] border-stroke px-3 py-2 outline-none"
            />
            <span
              onClick={generateKeys}
              className="h-[42px] flex justify-center items-center p-2 rounded-r-lg border border-[#666666] text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white hover:border-white transition-all duration-150 cursor-pointer"
            >
              <Repeat size={20} />
            </span>
          </div>
        </div>
        <div>
          <label className="mb-2 block font-bold">
            PUBLIC KEY{" "}
            <span className="text-[#E04000] text-sm font-light">
              &#x0028;Required&#x0029;
            </span>
          </label>
          <input
            type="text"
            readOnly
            value={optionalPeerValue.publicKey}
            className="w-full bg-[#666666] rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none "
          />
        </div>
        <div>
          <label className="mb-2 block font-bold">
            Allowed IPs{" "}
            <span className="text-[#E04000] text-sm font-light">
              &#x0028;Required&#x0029;
            </span>
          </label>
          <div className="w-full flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center">
              <input
                type="text"
                value={allowedIPInputValue}
                onChange={(e) => setAllowedIPInputValue(e.target.value)}
                placeholder="Enter IP Address/CIDR"
                className="w-full bg-transparent rounded-l-lg border border-r-0 border-[#666666] border-stroke px-3 py-2 outline-none"
              />
              <span
                onClick={handleManualInputChange}
                className="h-[42px] flex justify-center items-center p-2 rounded-r-lg border border-[#666666] text-green-500 hover:bg-green-900 hover:text-white hover:border-white transition-all duration-150 cursor-pointer"
              >
                <Plus size={20} />
              </span>
            </div>
            <div className="w-[240px] min-h-[42px] whitespace-nowrap mt-2 md:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full h-full bg-secondary text-primary px-2 py-1 flex items-center justify-between gap-3 rounded !outline-none">
                  <Eclipse size={18} />
                  Allowed IPs
                  <ChevronDown size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px] max-h-[280px] bg-secondary overflow-y-auto flex flex-col gap-0.5">
                  {interfaceIpAdresses?.map((ip) => {
                    return (
                      <div
                        className={`w-full py-1 px-2 rounded cursor-pointer flex items-center justify-between ${
                          ip?.available
                            ? "bg-green-800/20  hover:bg-green-800/40"
                            : "bg-[#E04000]/20  hover:bg-[#E04000]/40"
                        }`}
                        key={ip?.id}
                        onClick={() => handleAddIP(ip)}
                      >
                        <span>{ip?.ip}</span>
                      </div>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {optionalPeerValue.allowedIPs.length > 0 && (
          <div className="w-full flex gap-2 p-3 border border-primaryLight rounded mt-3">
            <div className="w-[100%_-_58px] flex-1 flex items-center flex-wrap gap-2">
              {optionalPeerValue.allowedIPs?.map((ip) => {
                return (
                  <span
                    key={ip}
                    className="text-[14px] bg-secondary/80 px-2 py-1 rounded flex items-center gap-4"
                  >
                    {ip}
                    <CircleMinus
                      size={16}
                      onClick={() => handleDeleteIP(ip)}
                      className="text-[#E04000] cursor-pointer hover:fill-[#E04000] hover:text-primaryLight transition-all duration-100"
                    />
                  </span>
                );
              })}
            </div>
            <span
              onClick={handleClearAllIps}
              className="group bg-[#E04000] w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer border border-transparent hover:border-secondary transition-all duration-100"
            >
              <Eraser size={16} className="group-hover:scale-[103%]" />
            </span>
          </div>
        )}

        {/* this is a gap */}
        <div className="h-[1px] bg-primaryLight my-6 rounded"></div>

        <div>
          <label className="mb-2 block font-bold">
            Endpoint Allowed IPs{" "}
            <span className="text-[#E04000] text-sm font-light">
              &#x0028;Required&#x0029;
            </span>
          </label>
          <input
            type="text"
            name={"endpointAllowedIPs"}
            defaultValue={optionalPeerValue.endpointAllowedIPs}
            onChange={handleChangeOptionalFormValue}
            className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-bold">DNS</label>
          <input
            type="text"
            name={"dns"}
            defaultValue={optionalPeerValue.dns}
            onChange={handleChangeOptionalFormValue}
            className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
          />
        </div>

        {/* this is a gap */}
        <div className="h-[1px] bg-primaryLight my-6 rounded"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="mb-2 block font-bold">Pre-Shared Key</label>
            <input
              type="text"
              name={"preSharedKey"}
              defaultValue={optionalPeerValue.presharedKey}
              onChange={handleChangeOptionalFormValue}
              className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="mb-2 block font-bold">MTU</label>
            <input
              type="number"
              name={"mtu"}
              defaultValue={optionalPeerValue.mtu}
              onChange={handleChangeOptionalFormValue}
              className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="mb-2 block font-bold">Persistent keepalive</label>
            <input
              type="number"
              name={"persistentKeepalive"}
              defaultValue={optionalPeerValue.persistentKeepalive}
              onChange={handleChangeOptionalFormValue}
              className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button disabled={submitLoading}>
            <CirclePlus size={16} />
            Add
          </Button>
        </div>
      </form>
    </>
  );
};
