import { useState, useEffect } from "react";
import API_URLS from "./config/urls";
import axios from "axios";
import { Button } from "./components/ui/button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Triangle } from "react-loader-spinner";
import Form from "./components/Form";
const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        //fetching tokens in 50 count from backend
        const res = await axios.get(
          `${API_URLS.BASE_URL}${API_URLS.GETOKENS}?page=${page}`,
        );
        console.log(res.data.tokens);
        setData(res.data.tokens);
        setTotal(res.data.total);
        setLoading(false);
      } catch (err) {
        toast.error("not able to fetch the tokens");
        setLoading(false);
      }
    };
    getData();
  }, [page]);
  return (
    <div className=" my-2">
      <div className="flex items-center justify-center h-[20dvh]">
        <p className="text-4xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          Introducing our innovative app powered by XY Finance, designed to
          simplify the process of swapping one token to other effortlessly.
        </p>
      </div>
      <Form />
      <p className="text-3xl mt-5 bg-gradient-to-r from-gray-600 via-purple-500 to-red-400 inline-block text-transparent bg-clip-text">
        Tokens
      </p>
      {loading ? (
        <div className="h-[70dvh] flex items-center justify-center">
          <Triangle />
        </div>
      ) : (
        <div className="min-h-[70dvh] grid md:grid-cols-2 gap-4 py-4">
          {data.map((ele, index) => {
            return (
              <div className=" border py-2 px-4 rounded-xl " key={index}>
                <div>
                  <div className="flex items-center justify-center">
                    <img
                      src={ele.logoURI}
                      width={50}
                      height={100}
                      className="rounded-full bg-black"
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-around">
                    <div>
                      <p className="font-bold text-lg">{ele.name}</p>
                      <p>
                        <span className="text-gray-700 text-sm">
                          Decimals:{" "}
                        </span>
                        {ele.decimals}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="text-gray-700 text-sm">Symbol: </span>
                        {ele.symbol}
                      </p>
                      <p>
                        <span className="text-gray-700 text-sm">
                          chain id:{" "}
                        </span>
                        {ele.chainId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) {
              setPage(page - 1);
            }
          }}
          disabled={page == 1}
        >
          <MoveLeftIcon />
          prev
        </Button>
        <Button
          variant={"outline"}
          disabled={page * 50 >= total}
          onClick={(e) => {
            e.preventDefault();
            if (page * 50 < total) {
              setPage(page + 1);
            }
          }}
        >
          next <MoveRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default Home;
