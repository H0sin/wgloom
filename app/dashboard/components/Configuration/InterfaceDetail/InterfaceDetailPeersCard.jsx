"use client";
import { useState } from "react";
import { GetPeerConfig } from "@/api/peer";
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  Download,
  Ellipsis,
  Pencil,
  QrCode,
  Share2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { QRCodeSVG } from "qrcode.react";
import { EditPeer } from "@/components/Configuration/InterfaceDetail/EditPeer";

export const InterfaceDetailPeersCard = ({ peerDetail }) => {
  const {
    name,
    allowedIPs,
    publicKey,
    status,
    uploadVolume,
    downloadVolume,
    expireTime,
    totalVolume,
    totalReceivedVolume,
    onHoldExpireDurection,
  } = peerDetail;
  const [peerConfig, setPeerConfig] = useState();

  const [dialogContent, setDialogContent] = useState(null);

  const currentTime = Date.now();
  const timeRemaining = expireTime - currentTime;
  debugger;
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const onHoldDurationTime = Math.ceil(
    onHoldExpireDurection / (1000 * 60 * 60 * 24),
  );

  const progressValue = (totalReceivedVolume / totalVolume) * 100;

  const GetPeerConfigFetch = async (name) => {
    await GetPeerConfig(name)
      .then((res) => {
        setPeerConfig(res?.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenQrCodeDialog = async (name) => {
    setDialogContent("qrcode");
    console.log(name);
    await GetPeerConfigFetch(name);
  };

  return (
    <>
      <div className=" relative col-span-1 w-full h-[240px] grid grid-cols-4 grid-rows-4 gap-2 p-2 border border-primaryLight rounded-md overflow-hidden">
        <Progress
          value={progressValue}
          className={`absolute top-0 left-0 w-full h-1 rounded-none bg-transparent [&>div]:bg-gradient-to-l [&>div]:from-[#3cb340] [&>div]:via-[#b69b63] [&>div]:to-[rgba(255,74,0,1)]  `}
        />

        <div className="col-span-1 flex items-center">
          <span
            className={`w-fit h-fit text-[12px] text-white px-1 py-0.5 rounded  ${
              status === "onhold"
                ? "bg-yellow-700"
                : status === "active"
                  ? "bg-green-700"
                  : status === "expired"
                    ? "bg-red-700"
                    : status === "limited"
                      ? "bg-blue-700"
                      : status === "disabled"
                        ? "bg-indigo-700"
                        : null
            }`}
          >
            {status === "onhold" ? (
              <>On Hold</>
            ) : status === "active" ? (
              <>Active</>
            ) : status === "expired" ? (
              <>Expired</>
            ) : status === "limited" ? (
              <>Limited</>
            ) : status === "disabled" ? (
              <>Disable</>
            ) : (
              ""
            )}
          </span>
        </div>

        <div className="col-start-2 col-end-5 xl:col-start-3 flex items-center justify-between">
          <div className="w-full flex items-center justify-center gap-1 text-blue-600 text-sm">
            <ArrowDownToDot size={16} />
            <span>{(downloadVolume / (1024 * 1024 * 1024)).toFixed(5)}</span>
            <span>GB</span>
          </div>
          <div className="w-full flex items-center justify-center gap-1 text-green-600 text-sm">
            <ArrowUpFromDot size={16} />
            <span>{(uploadVolume / (1024 * 1024 * 1024)).toFixed(5)}</span>
            <span>GB</span>
          </div>
        </div>
        <div className="col-span-3">
          <p className="line-clamp-1 font-semibold">{name}</p>
          {status === "active" || status === "limited" ? (
            <>
              {timeRemaining > 0 && (
                <p className="text-xs">
                  Expire at:{" "}
                  <span className="text-red-200">{`${days} Days , ${hours} Hours , ${minutes} Minutes`}</span>
                </p>
              )}
            </>
          ) : status === "onhold" ? (
            <>
              <p className="text-sm">{`Expire ${onHoldDurationTime} Days After Start`}</p>
            </>
          ) : status === "expired" ? (
            <p className="text-xs">
              Expired:{" "}
              <span className="text-red-200">{`${days * -1} Days , ${
                hours * -1
              } Hours , ${minutes * -1} Minutes ago`}</span>
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="col-span-4">
          <span className="font-semibold">Public Key</span>
          <p className="truncate">{publicKey}=</p>
        </div>
        <div className="col-span-3">
          <span className="font-semibold">Allowed IP</span>
          <p className="tracking-widest text-sm">{allowedIPs}</p>
        </div>
        <div className="flex items-center justify-end pr-4">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-fit h-fit px-2 py-1 outline-none border border-primaryLight rounded-md hover:bg-primaryLight hover:text-secondary transition-all duration-100">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-secondary">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="justify-between">
                    <span className="px-1.5 py-1 border bordbg-primary rounded hover:bg-primary hover:text-white transition-all duration-150 cursor-pointer">
                      <Download size={18} />
                    </span>
                    <DialogTrigger asChild>
                      <span
                        onClick={() => handleOpenQrCodeDialog(name)}
                        className="px-1.5 py-1 border bordbg-primary rounded hover:bg-primary hover:text-white transition-all duration-150 cursor-pointer"
                      >
                        <QrCode size={18} />
                      </span>
                    </DialogTrigger>
                    <span className="px-1.5 py-1 border bordbg-primary rounded hover:bg-primary hover:text-white transition-all duration-150 cursor-pointer">
                      <Share2 size={18} />
                    </span>
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => setDialogContent("editpeer")}
                      className="flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Edit <Pencil size={16} />
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="w-11/12 sm:max-w-md !bg-secondary pt-8 [&>button]:text-primary">
              <DialogHeader>
                <DialogTitle className="text-primary pb-4">
                  {dialogContent === "qrcode"
                    ? "Qr Code"
                    : dialogContent === "editpeer"
                      ? "Edit Peer"
                      : "null"}
                </DialogTitle>
                <DialogDescription>
                  {dialogContent === "qrcode" ? (
                    <>
                      <QRCodeSVG
                        value={peerConfig}
                        size={256}
                        level={"H"}
                        className="mx-auto"
                      />
                    </>
                  ) : dialogContent === "editpeer" ? (
                    <>
                      <EditPeer EditPeerData={peerDetail} />
                    </>
                  ) : null}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};
