"use client";
import { PostConfigurationInterface } from "@/api/interface";
import { ConfigurationFormCard } from "@/components/Configuration/ConfigurationFormCard";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import Button from "../common/Button";
import { Import, Repeat } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ip = require("ip");

export const ConfigurationForm = () => {
  const [configValue, setConfigValue] = useState({
    address: "",
    endPoint: "",
    saveConfig: true,
    preUp: null,
    postUp: null,
    preDown: null,
    postDown: null,
    listenPort: null,
    privateKey: "",
    publicKey: "",
    name: "",
    ipAddress: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setConfigValue((prevConfig) => ({
        ...prevConfig,
        address: window.location.hostname,
        endPoint: window.location.hostname,
      }));
    }
  }, []);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [ipInfo, setIpInfo] = useState(null);
  const [howManyAvailableIPs, setHowManyAvailableIPs] = useState(null);

  const router = useRouter();

  //   generateKeys for publicKey and privateKey
  const generateKeys = useCallback(() => {
    // Generate the key pair
    const keyPair = nacl.box.keyPair();

    // Convert keys to Base64 for easy display
    const publicKey = naclUtil.encodeBase64(keyPair.publicKey);
    const privateKey = naclUtil.encodeBase64(keyPair.secretKey);
    setConfigValue({
      ...configValue,
      ["privateKey"]: privateKey,
      ["publicKey"]: publicKey,
    });
  }, []);

  useEffect(() => {
    generateKeys();
  }, [generateKeys]);


  const isValidCIDRip = (input) => {
    const regexCIDR =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;

    return regexCIDR.test(input);
  };

  const checkAvailability = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setIpInfo(value);
    // if (isValidCIDRip(value)) {
    //   setIpInfo(value);
    // }
  };

  useEffect(() => {
    if (ipInfo) {
      const subnetInfo = ip.cidrSubnet(ipInfo);
      const numHosts = subnetInfo.numHosts;
      const availableIps = numHosts - 2;
      setHowManyAvailableIPs(availableIps);
    }
  }, [ipInfo]);

  //   this is for input in form
  const handleConfigInputValue = (e) => {
    e.preventDefault();
    const { name, value, type } = e.target;
    setConfigValue({
      ...configValue,
      [name]: type === " number" ? +value : value,
    });
  };

  // validation for IpAddress
  const validIpAddressRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,3}$/;

  //   submit form and post
  const submitPostConfigValue = async (e) => {
    e.preventDefault();

    if (!configValue.name) return toast.error("Configuration Name");

    if (
      !configValue.listenPort ||
      configValue.listenPort > 65353 ||
      configValue.listenPort < 0
    )
      return toast.error("Listen Port");

    // if (
    //   !configValue.ipAddress ||
    //   !validIpAddressRegex.test(configValue.ipAddress)
    // )
    //   return toast.error("Ip Address");

    setSubmitLoading(true);

    await PostConfigurationInterface(configValue)
      .then((res) => {
        const { isSuccess, message } = res;
        if (isSuccess) {
          toast.success(message);
          router.push("/");
        } else toast.error(message);
      })
      .catch((er) => {
        console.log(er);
        toast.error("failed");
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <form
      onSubmit={submitPostConfigValue}
      className="w-full flex flex-col gap-6 pt-6"
    >
      <ConfigurationFormCard title={"Interface Name"}>
        <input
          name="name"
          onChange={handleConfigInputValue}
          type="text"
          placeholder="ex. wg1"
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none  "
        />
      </ConfigurationFormCard>
      <ConfigurationFormCard title={"Private Key / Public Key"}>
        <div>
          <label className="mb-2 block font-bold">PRIVATE KEY</label>
          <div className="w-full flex items-center">
            <input
              type="text"
              readOnly
              value={configValue.privateKey}
              className="w-full bg-transparent rounded-l-lg border border-r-0 border-[#666666] border-stroke px-3 py-2 outline-none"
            />
            <span
              onClick={generateKeys}
              className="h-[42px] flex justify-center items-center p-2 rounded-r-lg border border-[#666666] text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white hover:border-white transition-all duration-100 cursor-pointer"
            >
              <Repeat size={20} />
            </span>
          </div>
        </div>
        <div>
          <label className="my-2 block font-bold">PUBLIC KEY</label>
          <input
            type="text"
            readOnly
            value={configValue.publicKey}
            className="w-full bg-[#666666] rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none "
          />
        </div>
      </ConfigurationFormCard>
      <ConfigurationFormCard title={"Listen Port"}>
        <input
          type="number"
          name="listenPort"
          onChange={handleConfigInputValue}
          placeholder="0-65353"
          className={`w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none ${
            configValue.listenPort > 65353 || configValue.listenPort < 0
              ? "border-red-500"
              : ""
          }`}
        />
      </ConfigurationFormCard>
      <ConfigurationFormCard title={"IP Address & Range"}>
        <input
          type="text"
          name="ipAddress"
          onChange={handleConfigInputValue}
          placeholder="Ex: 10.0.0.1/24"
          className={`w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none`}
        />
        {howManyAvailableIPs && (
          <span className="absolute right-2 top-1 bg-secondaryDark px-2 py-0.5 rounded-lg text-xs">
            {howManyAvailableIPs}
          </span>
        )}
      </ConfigurationFormCard>
      <ConfigurationFormCard title={"Endpoint"}>
        <input
          type="text"
          name="endPoint"
          defaultValue={configValue.address}
          onChange={handleConfigInputValue}
          className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none  "
        />
      </ConfigurationFormCard>

      {/* this is a gap */}
      <div className="h-[2px] bg-primaryLight my-4 rounded"></div>

      {/* accordion for optional form */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-primaryLight text-xl px-4 rounded-t">
            Optional Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <ConfigurationFormCard title={"PreUp"}>
                <input
                  type="number"
                  name="preUp"
                  onChange={handleConfigInputValue}
                  className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none  "
                />
              </ConfigurationFormCard>
              <ConfigurationFormCard title={"PreDown"}>
                <input
                  type="number"
                  name="preDown"
                  onChange={handleConfigInputValue}
                  className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none  "
                />
              </ConfigurationFormCard>
              <ConfigurationFormCard title={"PostUp"}>
                <input
                  type="number"
                  name="postUp"
                  onChange={handleConfigInputValue}
                  className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none  "
                />
              </ConfigurationFormCard>
              <ConfigurationFormCard title={"PostDown"}>
                <input
                  type="number"
                  name="postDown"
                  onChange={handleConfigInputValue}
                  className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke px-3 py-2 outline-none  "
                />
              </ConfigurationFormCard>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end text-white">
        <Button disabled={submitLoading}>
          Save Interface
          {submitLoading ? (
            <span>...</span>
          ) : (
            <>
              <Import size={20} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
