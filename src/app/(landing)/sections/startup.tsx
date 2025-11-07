"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { FadeBlock } from "../fadeanimation";

type Item = {
  title: string;
  subtitle: string;
  content: string;
  image: string;
  delay?: number;
  dir?: "up" | "down" | "left" | "right";
};

const items: Item[] = [
  {
    title: "Secure & Regulated PAMM FundManagement",
    subtitle: "IBC adheres to strict financial regulatory compliance",
    content: "Ensuring full transparency, fund security, and ethical trading practices. With our PAMM-based model, you retain complete control over your funds, while our expert traders manage and optimize your investments for consistent, risk-adjusted returns—without requiring direct deposits.",
    image: "/new/block-1.svg",
    delay: 0.3,
    dir: "left"
  },
  {
    title: "AI-Driven Trading with Expert Manual Oversight",
    subtitle: "Our hybrid trading approach seamlessly integrates AI-powered",
    content: "Automation with professional manual strategies to maximize profits while mitigating risks. This combination ensures precision in trade execution, real-time adaptability to market fluctuations, and long-term portfolio growth—all tailored to meet your financial goals.",
    image: "/new/block-2.svg",
    delay: 0.1
  },
  {
    title: "Effortless Withdrawals & Multi-Asset Trading Opportunities",
    subtitle: "",
    content:"Weekly withdrawals every Sunday you can access your earnings without hassle. IBC provides diversified investment exposure, allowing you to trade Forex, Commodities, Metals, and Cryptocurrencies, all managed under expert risk-mitigation strategies to ensure stable and sustainable financial growth.",
    image: "/new/block-3.svg",
    delay: 0.3,
    dir: "right"
  }
];

const cardStyle =
  "bg-background text-muted-foreground p-6 xl:p-10 text-center bg-[url(/work-bg.png)] bg-no-repeat bg-top bg-cover hover:text-foreground transition-all relative min-h-full";
const cardImageStyle = "w-full max-w-40 xl:max-w-50 mx-auto mb-5 xl:mb-8 aspect-square object-contain";
const cardHeadingStyle = "font-michroma text-2xl mt-5 group-hover/item:text-primary";
const cardSubtitleStyle = "font-semibold text-lg";
const cardContentStyle = "text-sm lg:text-base mt-4";

export default function StartupSection() {
  return (
    <section className="py-8 xl:py-12">
      <div className="container">
        <div className="section_inner">
          <div className="flex flex-wrap gap-5">
            {items.map((item, idx) => (
              <FadeBlock delay={item.delay} direction={item.dir} className="flex-auto md:flex-1/3 lg:flex-1/5 relative overflow-hidden bg-border/50 group/item p-0.5" key={idx}>
                <div className="animate-[spin_4s_linear_infinite] absolute inset-0 h-full w-full bg-conic from-transparent to-primary from-80% scale-130 transition-opacity opacity-0 group-hover/item:opacity-100"></div>
                <div className={cardStyle}>
                <Image
                  className={cardImageStyle}
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={500}
                  priority
                />
                <h3 className={cardHeadingStyle}>{item.title}</h3>
                <Separator className="my-6 max-w-0 mx-auto group-hover/item:max-w-24 transition-all h-0.5!" />
                <p className={cardSubtitleStyle}>{item.subtitle}</p>
                <p className={cardContentStyle}>{item.content}</p>
                </div>
              </FadeBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
