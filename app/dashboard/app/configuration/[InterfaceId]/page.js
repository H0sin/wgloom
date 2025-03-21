import { InterfaceDetailHeader } from "@/components/Configuration/InterfaceDetail/InterfaceDetailHeader";
import { InterfaceDetailPeers } from "@/components/Configuration/InterfaceDetail/InterfaceDetailPeers";

export default function ConfigDetail({ params }) {
  const { InterfaceId } = params;

  return (
    <>
      <InterfaceDetailHeader interfaceId={InterfaceId} />
      <InterfaceDetailPeers />
    </>
  );
}
