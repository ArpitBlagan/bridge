import { Router } from "express";
import {
  buildTranx,
  getQuote,
  getTokens,
  searchToken,
} from "./controller/main";

export const router = Router();

router.route("/getTokens").get(getTokens);
router.route("/getQuote").get(getQuote);
router.route("/buildTranx").get(buildTranx);
router.route("/search").get(searchToken);
