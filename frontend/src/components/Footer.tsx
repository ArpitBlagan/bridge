import { GithubIcon, LinkedinIcon, Waypoints } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="  mt-4 h-[100px] w-full ">
      <div className="flex items-center w-full duration-400 justify-center flex-col py-2 px-4 rounded-xl bg-gradient-to-r  from-pink-500 to-orange-500 ease-in-out transition ">
        <p>
          Take a look of my other projects and recent open source contribution
        </p>
        <a
          href="https://github.com/ArpitBlagan/"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon
            width={50}
            height={30}
            className="py-2 px-4 bg-black rounded-xl text-white"
          />
        </a>
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-start">
        <div>
          <h1>Made with ❤️ By Arpit Blagan 🇮🇳</h1>
        </div>
        <div>
          <a
            href="https://www.linkedin.com/in/arpit-blagan-79081b193/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinIcon width={50} height={30} />
          </a>
        </div>
        <div className="flex  items-center justify-center gap-3">
          <a href="https://docs.xy.finance/" target="_blank" rel="noreferrer">
            <img
              src={
                "https://assets.coingecko.com/coins/images/21541/small/xy.png?1639913622"
              }
              width={50}
              height={30}
              className="rounded-full"
            />
          </a>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          <Link to="/" className="font-semibold text-xl">
            <Waypoints />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
