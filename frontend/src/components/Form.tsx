import {
  ArrowDown01Icon,
  ArrowRightLeft,
  ChevronDown,
  SearchCheckIcon,
} from "lucide-react";
import API_URLS from "@/config/urls";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface Token {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}
const Form = () => {
  const [from, setFrom] = useState<Token>({
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: 1,
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    name: "ETH",
    symbol: "ETH",
  });
  const [address, setAddress] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [quoteInfo, setQuoteInfo] = useState<any | null>(null);
  const [buildLoading, setBuildLoading] = useState<boolean>(false);
  const [to, setTo] = useState<Token>({
    address: "0x6985884C4392D348587B19cb9eAAf157F13271cd",
    chainId: 1,
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/28206/standard/ftxG9_TJ_400x400.jpeg",
    name: "ZRO",
    symbol: "ZRO",
  });
  const [searchText, setSearchText] = useState("");
  const [fromDropOpen, setFromDropOpen] = useState(false);
  const [toDropOpen, setToDropOpen] = useState(false);
  const [buildInfo, setBuildInfo] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const buildTransaction = async () => {
    setBuildLoading(true);
    if (!address) {
      toast.error("Please enter valid address:(");
      setBuildLoading(false);
      return;
    }
    const am = Number(amount);
    if (!am) {
      setBuildLoading(false);
      toast.error("enter valid amount first :(");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URLS.BASE_URL}${API_URLS.BUILD}?srcChainId=${from.chainId}&srcQuoteTokenAddress=${from.address}&srcQuoteTokenAmount=${am}&dstChainId=${to.chainId}&dstQuoteTokenAddress=${to.address}&receiver=${address}`,
      );
      console.log(res.data);
      setBuildLoading(false);
      setBuildInfo(res.data);
    } catch (err) {
      console.log(err);
      setBuildLoading(false);
      toast.error(
        "something went wrong while building transaction please try again later :(",
      );
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(false);
        const val = searchText.trim();
        //fetching tokens according to search
        const res = await axios.get(
          `${API_URLS.BASE_URL}${
            API_URLS.SEARCH
          }?search=${val.toLocaleUpperCase()}`,
        );
        setTokens(res.data);
      } catch (err) {
        setLoading(false);
        toast.error("something went wrong whilte getting search result...");
      }
    };
    setLoading(true);
    const time = setTimeout(() => {
      getData();
    }, 2000);
    return () => {
      clearTimeout(time);
    };
  }, [searchText]);
  const getQuote = async () => {
    setQuoteLoading(true);
    const am = Number(amount);
    if (!am) {
      setQuoteLoading(false);
      toast.error("enter valid amount first :(");
      return;
    }
    if (
      quoteInfo &&
      quoteInfo.routes &&
      from.address == quoteInfo.routes[0].srcSwapDescription.srcTokenAddress &&
      to.address != quoteInfo.routes[0].srcSwapDescription.dstTokenAddress &&
      am == quoteInfo.routes[0].srcSwapDescription.srcTokenAmount
    ) {
      setQuoteLoading(false);
      return;
    }
    try {
      //srcChainId=1&srcQuoteTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&
      //srcQuoteTokenAmount=1000000000000000000&dstChainId=1&
      //dstQuoteTokenAddress=0x6985884C4392D348587B19cb9eAAf157F13271cd&slippage=1

      //sending request to get quote for selected tokens
      const res =
        await axios.get(`${API_URLS.BASE_URL}${API_URLS.GETQUOTE}?srcChainId=${from.chainId}
              &srcQuoteTokenAddress=${from.address}&srcQuoteTokenAmount=${am}&dstChainId=${to.chainId}
              &dstQuoteTokenAddress=${to.address}
          `);
      console.log(res.data);
      setQuoteInfo(res.data);
      setQuoteLoading(false);
    } catch (err) {
      setQuoteLoading(false);
      toast.error(
        "something went wrong or service unavaliable whilte getting quote...",
      );
    }
  };
  return (
    <div className="min:h-[50dvh] flex flex-col items-center justify-center gap-5 border py-2 px-4 rounded-xl">
      <div className=" flex flex-col gap-4 w-full ">
        <p className="text-3xl  text-start">Swap</p>
        <p className="text-sm text-gray-700">From</p>
        <div className="flex flex-col md:flex-row items-center justify-around gap-4 w-full">
          <Popover onOpenChange={setFromDropOpen} open={fromDropOpen}>
            <PopoverTrigger className="w-full md:w-1/2" asChild>
              <div className="py-2 px-5 rounded-lg border flex cursor-pointer">
                <div className="flex items-center flex-1 gap-2">
                  <img
                    src={from.logoURI}
                    width={70}
                    height={70}
                    className="rounded-xl"
                  />
                  <p className="text-gray-700">
                    {from.name}{" "}
                    <span className="text-sm text-gray-700">
                      {from.symbol} (chain id {from.chainId})
                    </span>
                  </p>
                </div>
                <ChevronDown />
              </div>
            </PopoverTrigger>
            <PopoverContent className="md:w-[450px]">
              <div className="flex flex-col gap-4">
                <label className="text-center">Select Token</label>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="search token by symbol or name"
                    className="flex-1"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                  <SearchCheckIcon />
                </div>
                <div className="h-[50dvh] overflow-y-scroll">
                  <p className="text-sm text-gray-700 text-center">Tokens</p>
                  {loading ? (
                    <div className="h-[30dvh] overflow-y-scroll flex items-center justify-center">
                      <Triangle />
                    </div>
                  ) : tokens.length == 0 ? (
                    <div className="flex items-center justify-center h-[30dvh]">
                      <p>No token for the search text {searchText}</p>
                    </div>
                  ) : (
                    <div className="h-[50dvh] overflow-y-scroll grid md:grid-cols-2 gap-3">
                      {tokens.map((ele, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 cursor-pointer"
                            onClick={() => {
                              setFrom(ele);
                              setFromDropOpen(false);
                            }}
                          >
                            <img
                              src={ele.logoURI}
                              height={50}
                              width={50}
                              className="rounded-xl"
                            />
                            <p>
                              {ele.name}{" "}
                              <span className="text-sm text-gray-700">
                                {ele.symbol}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Input
            className="py-2 px-2 w-full md:w-1/2 py-[42px]"
            placeholder="Amount where 0.0 = $0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
      </div>
      <ArrowDown01Icon />
      <div className=" flex flex-col gap-4 w-full">
        <p className="text-sm text-gray-700">To</p>
        <div className="flex flex-col md:flex-row items-center justify-around gap-4 w-full">
          <Popover open={toDropOpen} onOpenChange={setToDropOpen}>
            <PopoverTrigger className="w-full md:w-1/2" asChild>
              <div className="py-2 px-5 rounded-lg border flex cursor-pointer">
                <div className="flex items-center flex-1 gap-2">
                  <img
                    src={to.logoURI}
                    width={70}
                    height={70}
                    className="rounded-xl"
                  />
                  <p className="text-gray-700">
                    {to.name}{" "}
                    <span className="text-sm text-gray-700">
                      {to.symbol} (chain id {to.chainId})
                    </span>
                  </p>
                </div>
                <ChevronDown />
              </div>
            </PopoverTrigger>
            <PopoverContent className="md:w-[450px]">
              <div className="flex flex-col gap-4">
                <label className="text-center">Select Token</label>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="search token by symbol or name"
                    className="flex-1"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                  <SearchCheckIcon />
                </div>
                <div className="">
                  <p className="text-sm text-gray-700 text-center">Tokens</p>
                  {loading ? (
                    <div className="h-[30dvh] overflow-y-scroll flex items-center justify-center">
                      <Triangle />
                    </div>
                  ) : tokens.length == 0 ? (
                    <div className="flex items-center justify-center h-[30dvh]">
                      <p>No token for the search text ${searchText}</p>
                    </div>
                  ) : (
                    <div className="h-[40dvh] overflow-y-scroll grid md:grid-cols-2 gap-3">
                      {tokens.map((ele, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 cursor-pointer"
                            onClick={() => {
                              setTo(ele);
                              setToDropOpen(false);
                            }}
                          >
                            <img
                              src={ele.logoURI}
                              height={50}
                              width={50}
                              className="rounded-xl"
                            />
                            <p>
                              {ele.name}{" "}
                              <span className="text-sm text-gray-700">
                                {ele.symbol}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button
        className="w-1/2 my-4"
        disabled={quoteLoading}
        onClick={(e) => {
          e.preventDefault();
          getQuote();
        }}
      >
        {quoteLoading ? <Triangle height={20} width={20} /> : "Get Quote"}
      </Button>
      {quoteInfo && (
        <div className="mb-4 w-full py-2 px-4 rounded-xl border">
          <p className="font-bold">Quote</p>
          <div className="flex items-center justify-center gap-3">
            <img src={from.logoURI} height={500} width={50} />
            <ArrowRightLeft />
            <img src={to.logoURI} height={50} width={50} />
          </div>
          <p>
            <span className="text-sm text-gray-700">Status </span>
            {quoteInfo.success}{" "}
          </p>
          <div className="flex flex-col gap-3 h-[60dvh] overflow-y-scroll">
            {quoteInfo.errorMsg && <p>{quoteInfo.errorMsg}</p>}
            {quoteInfo.routes &&
              quoteInfo.routes.map((ele: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="border flex flex-col rounded-xl py-2 px-3"
                  >
                    <p className="text-start">
                      <span className="text-start px-2 py-1 rounded-md bg-green-500">
                        #{index + 1}.
                      </span>
                    </p>
                    <div className=" flex flex-wrap gap-4 ">
                      <p>
                        <span className="text-gray-600">
                          dstQuoteTokenAmount:{" "}
                        </span>
                        {ele.dstQuoteTokenAmount}
                      </p>
                      <p>
                        <span className="font-bold">{index + 1}. </span>{" "}
                        <span className="text-gray-600">Estimated Gas: </span>
                        {ele.estimatedGas}
                      </p>
                      <p>
                        <span className="text-gray-600">Transfer Time: </span>
                        {ele.estimatedTransferTime}
                      </p>
                    </div>
                    <p className="text-start text-gray-600">
                      <span>Swap Description</span>
                    </p>
                    <pre
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      {JSON.stringify(ele.srcSwapDescription, null, 10)}
                    </pre>
                    <div className="flex items-center  justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Build Transaction</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-center text-gray-600">
                              Enter Valid Reciver Address
                            </DialogTitle>
                            <DialogDescription>
                              <form className="flex flex-col gap-3">
                                <div className="flex flex-col  justify-center gap-4 min:h-[20dvh]">
                                  <label>Address</label>
                                  <Input
                                    placeholder="DDsgbutK43Byar2DxiWxUvLJvQiW488s8m4fxXCd4WWX"
                                    value={address}
                                    onChange={(e) => {
                                      setAddress(e.target.value);
                                    }}
                                  />
                                  {buildInfo && (
                                    <div className="flex flex-col  h-[40vh] overflow-y-scroll">
                                      <p className="flex items-center justify-start">
                                        <span className="text-gray-600">
                                          Build Info
                                        </span>
                                      </p>
                                      <div className="flex-1 flex items-center justify-center">
                                        {buildInfo.errorMsg && (
                                          <p>{buildInfo.errorMsg}</p>
                                        )}
                                        {buildInfo.route && (
                                          <pre
                                            style={{
                                              padding: "10px",
                                              borderRadius: "5px",
                                            }}
                                          >
                                            {JSON.stringify(
                                              buildInfo.route.tx,
                                              null,
                                              10,
                                            )}
                                          </pre>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    buildTransaction();
                                  }}
                                  disabled={buildLoading}
                                >
                                  {buildLoading ? (
                                    <Triangle height={20} width={20} />
                                  ) : (
                                    "Build"
                                  )}
                                </Button>
                              </form>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
