import { Request, Response } from "express";
import axios from "axios";
const cache: any = {
  firstTime: true,
  data: {},
  et: new Date(),
};
const inValid = (entryTime: any) => {
  const currentTime: Date = new Date();
  const entryTimee: Date = new Date(entryTime);
  //@ts-ignore
  const differenceInMilliseconds = currentTime - entryTimee;

  // Convert milliseconds to hours
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  console.log(differenceInHours);
  // Check if the difference is greater than or equal to 5 hours
  return differenceInHours >= 5;
};
export const getTokens = async (req: Request, res: Response) => {
  const page: any = req.query.page;
  console.log(page);
  const take = 50;
  try {
    // No need to make this api call on every request we can cache its for fast response time.
    if (cache.firstTime || inValid(cache.et)) {
      console.log("cool");
      const dd = await axios.get(
        "https://aggregator-api.xy.finance/v1/recommendedTokens",
      );
      cache["data"] = dd.data;
      cache["et"] = new Date();
      cache["firstTime"] = false;
    }
    const fin = (page - 1) * take;
    const lin = fin + 50;
    const arr = cache.data?.recommendedTokens.slice(fin, lin);
    res
      .status(200)
      .json({ tokens: arr, total: cache.data.recommendedTokens.length });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getQuote = async (req: Request, res: Response) => {
  const {
    srcChainId,
    srcQuoteTokenAddress,
    srcQuoteTokenAmount,
    dstChainId,
    dstQuoteTokenAddress,
  } = req.query;
  try {
    // get the quote info
    const data = await axios.get(
      `https://aggregator-api.xy.finance/v1/quote?srcChainId=${srcChainId}&srcQuoteTokenAddress=${srcQuoteTokenAddress}&srcQuoteTokenAmount=${srcQuoteTokenAmount}&dstChainId=${dstChainId}&dstQuoteTokenAddress=${dstQuoteTokenAddress}&slippage=1`,
    );
    res.status(200).json(data.data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "something went wrong or service unavaliable" });
  }
};

export const buildTranx = async (req: Request, res: Response) => {
  const {
    srcChainId,
    srcQuoteTokenAddress,
    srcQuoteTokenAmount,
    dstChainId,
    dstQuoteTokenAddress,
    receiver,
  } = req.query;
  try {
    //build transaction and we need to have a valid receiver address to make it work
    const data = await axios.get(
      `https://aggregator-api.xy.finance/v1/buildTx?srcChainId=${srcChainId}&srcQuoteTokenAddress=${srcQuoteTokenAddress}&srcQuoteTokenAmount=${srcQuoteTokenAmount}&dstChainId=${dstChainId}&dstQuoteTokenAddress=${dstQuoteTokenAddress}&slippage=1&receiver=${receiver}`,
    );
    res.status(200).json(data.data);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const searchToken = async (req: Request, res: Response) => {
  const { search } = req.query;
  //send back the token that matches the search
  try {
    if (cache.firstTime) {
      const dd = await axios.get(
        "https://aggregator-api.xy.finance/v1/recommendedTokens",
      );
      cache["data"] = dd.data;
      cache["et"] = new Date();
      cache["firstTime"] = false;
    }
    const arr = cache["data"].recommendedTokens;
    if (search == "") {
      return res.status(200).json(arr);
    }
    const newArr = arr.filter((ele: any) => {
      return ele.name.includes(search) || ele.symbol.includes(search);
    });
    res.status(200).json(newArr);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};
