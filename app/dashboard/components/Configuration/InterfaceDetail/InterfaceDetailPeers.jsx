"use client";
import { useEffect, useRef, useState } from "react";
import { GetPeer } from "@/api/peer";
import toast from "react-hot-toast";
import { InterfaceDetailPeersCard } from "@/components/Configuration/InterfaceDetail/InterfaceDetailPeersCard";
import { usePathname } from "next/navigation";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

export const InterfaceDetailPeers = () => {
  const [peers, setPeers] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState({
    Take: 20,
    Skip: 20 * currentPage,
    name: "",
  });
  const [peerLoading, setPeerLoading] = useState(true);

  const searchNameRef = useRef();

  const pathname = usePathname();

  const fetchPeers = async (searchQuery) => {
    setPeerLoading(true);

    await GetPeer(searchQuery)
      .then((res) => {
        setPeers(res.data);
      })
      .catch((er) => {
        toast.error("Nothing Found");
        console.log(er);
      })
      .finally(() => {
        setPeerLoading(false);
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localCurrentPage = localStorage.getItem("currentPage");
      setCurrentPage(+localCurrentPage || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const searchQuery = `?Take=${filter.Take}&Skip=${
      filter.Skip
    }&InterfaceName=${pathname.split("/")[2]}&name=${filter.name}`;

    fetchPeers(searchQuery);
  }, [currentPage, filter.Skip, filter.Take, filter.name]);

  const paginationNumber = Math.floor(peers?.countPeer / filter.Take);
  const paginationArray = Array.from(
    { length: paginationNumber + 1 },
    (_, index) => index,
  );

  const itemsPerPage = 5;
  let startPage = Math.max(0, currentPage - Math.floor(itemsPerPage / 2));
  let endPage = startPage + itemsPerPage - 1;

  if (endPage >= paginationNumber) {
    endPage = paginationNumber;
    startPage = Math.max(0, endPage - itemsPerPage + 1);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setFilter({
      ...filter,
      Skip: filter.Take * newPage,
    });
  };

  const handleSearchPeer = (e) => {
    e.preventDefault();
    const searchValue = searchNameRef.current.value;

    if (searchValue) {
      setFilter({ ...filter, Take: 20, Skip: 0, name: searchValue });
      setCurrentPage(0);
    } else {
      setFilter({
        Take: 20,
        Skip: 0,
        name: "",
      });
    }
  };

  return (
    <div className="w-full">
      {peerLoading ? (
        <div className="text-center w-full h-[360px] flex justify-center items-center"></div>
      ) : (
        <>
          <div className="w-full flex justify-between items-center gap-4  mb-4">
            <form onSubmit={handleSearchPeer} className="relative flex-1">
              <input
                name="searchparam"
                ref={searchNameRef}
                type="text"
                defaultValue={filter.name}
                placeholder="Search"
                className="w-full bg-transparent rounded-lg border border-[#666666] border-stroke pl-2 pr-12 py-2 outline-none "
              />
              <button className="w-[32px] h-[32px] flex items-center justify-center absolute right-2 top-[5px] bg-transparent hover:bg-primaryLight hover:text-secondary border !border-primaryLight rounded-lg text-primaryLight transition-all duration-150">
                <Search />
              </button>
            </form>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setFilter({ ...filter, Take: 20 })}
                className=" relative w-[42px] h-[42px] flex justify-center items-center bg-primaryLight border border-secondary rounded-lg hover:bg-primary cursor-pointer transition-all duration-75"
              >
                <ArrowDownWideNarrow />
                <span className=" absolute -top-2 -right-1 text-[10px] bg-secondaryDark/60 backdrop-blur rounded-full p-[2px]">
                  20
                </span>
              </span>
              <span
                onClick={() => setFilter({ ...filter, Take: 40 })}
                className=" relative w-[42px] h-[42px] flex justify-center items-center bg-primaryLight border border-secondary rounded-lg hover:bg-primary cursor-pointer transition-all duration-75"
              >
                <ArrowUpNarrowWide />
                <span className=" absolute -top-2 -right-1 text-[10px] bg-secondaryDark/60 backdrop-blur rounded-full p-[2px]">
                  40
                </span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-secondary">
            {peers?.peers.map((peer) => {
              return (
                <InterfaceDetailPeersCard key={peer.id} peerDetail={peer} />
              );
            })}
          </div>

          {/* this is pagination */}
          <div className="flex justify-center items-center gap-0.5 mt-8">
            <>
              <button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded border border-secondary text-secondary hover:bg-primaryLight disabled:hidden"
              >
                <ChevronsLeft size={16} />
              </button>
              {paginationArray
                .slice(startPage, endPage + 1)
                .map((pageNumber) => {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded bg-primary text-secondary hover:bg-primaryLight ${
                        pageNumber === currentPage
                          ? "btn-active bg-secondary !text-primary hover:bg-secondary"
                          : ""
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
              <button
                disabled={currentPage === paginationNumber}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded border border-secondary text-secondary hover:bg-primaryLight disabled:hidden"
              >
                <ChevronsRight size={16} />
              </button>
            </>
          </div>
        </>
      )}
    </div>
  );
  z;
};
