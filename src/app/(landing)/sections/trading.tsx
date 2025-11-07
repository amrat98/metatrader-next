"use client";
import Image from "next/image";

export default function TradingSection() {
  return (
    <section className="py-8 xl:py-12">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <div className="section_header lg:text-left flex-1/2">
            <h2 className="section_heading">
              What Is <br className="hidden lg:block" />
              Forex Trading?
            </h2>
            <p className="text-lg lg:text-xl xl:text-3xl font-semibold text-primary">
              Forex - The World's Largest <br className="hidden lg:block" />
              and Most Liquid Market
            </p>

            <p className="section_rte ml-0 max-w-none">
              Forex, or foreign exchange trading, involves buying and selling
              global currencies. It's a dynamic market that operates 24/7 and
              offers immense profit potential due to its liquidity and
              volatility. At IBC, our trading strategies are designed to
              navigate this market using cutting-edge AI algorithms and expert
              insights to deliver consistent results—even during volatile market
              conditions. You don't need to know how to trade Forex. We do it
              for you.
            </p>
          </div>
          <div className="flex-1/2">
            <Image
              className="w-full max-w-10/12 mx-auto lg:mr-0"
              src="/trading.png"
              alt="What Is Forex Trading?"
              width={760}
              height={760}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
