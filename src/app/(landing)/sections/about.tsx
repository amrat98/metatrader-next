"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CheckCheck } from "lucide-react";
import { FadeBlock } from "../fadeanimation";

export default function AboutSection() {
  return (
    <>
    <section className="py-8 xl:py-12">
        <div className="container">
          <FadeBlock delay={0.2} className="section_inner text-center md:text-right max-w-4xl ml-auto">
            <span className="font-michroma text-primary uppercase text-sm tracking-widest">
              Smart
            </span>
            <p className="text-base mt-2 text-muted-foreground leading-6">
              At IBC, we focus on PAMM-based Forex Portfolio Management by
              merging AI-powered automation with professional trading expertise.
              Our goal is to deliver secure, consistent, and risk-managed
              returns. With no direct deposits required, you maintain full
              control of your funds while our experienced traders work to
              optimize your profits effectively and safely.
            </p>
            <div className="mt-8 flex gap-2 justify-end">
              <span className="font-michroma text-foreground uppercase text-lg md:text-2xl">
                PAMM Fund Management
              </span>
              <Separator
                orientation="vertical"
                className="bg-primary w-0.5! h-auto!"
              />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <span className="font-michroma text-foreground uppercase text-lg md:text-2xl">
                AI + Manual Trading
              </span>
              <Separator
                orientation="vertical"
                className="bg-primary w-0.5! h-auto!"
              />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <span className="font-michroma text-foreground uppercase text-lg md:text-2xl">
                Weekly Profit Withdrawals
              </span>
              <Separator
                orientation="vertical"
                className="bg-primary w-0.5! h-auto!"
              />
            </div>
          </FadeBlock>
        </div>
      </section>
    <section className="py-8 xl:py-12">
      <div className="container">
        <div className="section_inner flex flex-col-reverse lg:flex-row gap-5 items-center">
          <div className="grid md:grid-cols-2 gap-y-10 gap-x-5">
            <FadeBlock delay={0.2}  className="flex flex-col gap-6 pb-8 border-b-2">
              <div className="flex gap-4 items-center">
              <Image
                  className="w-20 min-w-20 aspect-square object-contain"
                  src="/new/vision.svg"
                  alt="Vision"
                  width={450}
                  height={450}
                  priority
                />
                <h3 className="font-michroma text-3xl">Vision</h3>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        To position IBC as a global leader in PAMM-based Forex Portfolio
                        Management,
                      </p>
                      <p className="text-base text-muted-foreground mt-2">
                        empowering investors through AI-driven innovations, expert trading
                        strategies, and secure wealth-building solutions designed for consistent
                        and sustainable financial growth.
                      </p>
                    </div>
            </FadeBlock>
            <FadeBlock delay={0.2} className="flex flex-col gap-6 pb-8 border-b-2">
              <div className="flex gap-4 items-center">
                <Image
                  className="w-20 min-w-20 aspect-square object-contain"
                  src="/new/mission.svg"
                  alt="Mission"
                  width={450}
                  height={450}
                  priority
                />
                <h3 className="font-michroma text-3xl">Mission</h3>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  To redefine forex investing through our advanced PAMM platform,
                </p>
                <p className="text-base text-muted-foreground mt-2">
                  enabling investors to earn effortlessly without active trading. By
                  combining AI-powered automation with professional manual oversight, we
                  ensure transparent, secure, and high-performing portfolio management
                  focused on delivering optimized returns with minimal risk.
                </p>
              </div>
            </FadeBlock>
            <FadeBlock delay={0.2} className="flex flex-col md:col-span-2 gap-6 pb-8">
              <div className="flex gap-4 items-center">
              <Image
                  className="w-20 min-w-20 aspect-square object-contain"
                  src="/new/values.svg"
                  alt="Values"
                  width={450}
                  height={450}
                  priority
                />
                <h3 className="font-michroma text-3xl">Our Values</h3>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      We are committed to transforming forex investing through our advanced PAMM
                      (Percentage Allocation Management Module) framework, focused on innovation,
                      security, and investor success.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="flex gap-2">
                        <CheckCheck className="text-primary size-8 min-w-8" />
                        <div>
                          <h4 className="text-xl font-semibold">PAMM Expertise:</h4>
                          <p className="text-muted-foreground mt-1">
                            Skilled portfolio management designed to maximize investor returns.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCheck className="text-primary size-8 min-w-8" />
                        <div>
                          <h4 className="text-xl font-semibold">Transparency:</h4>
                          <p className="text-muted-foreground mt-1">
                            Ethical, fully transparent, and regulatory-compliant trading processes.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCheck className="text-primary size-8 min-w-8" />
                        <div>
                          <h4 className="text-xl font-semibold">Security:</h4>
                          <p className="text-muted-foreground mt-1">
                            Your funds remain in your control while experts manage trading safely.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCheck className="text-primary size-8 min-w-8" />
                        <div>
                          <h4 className="text-xl font-semibold">Innovation:</h4>
                          <p className="text-muted-foreground mt-1">
                            Leveraging AI-powered strategies for smart, data-driven decisions.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCheck className="text-primary size-8 min-w-8" />
                        <div>
                          <h4 className="text-xl font-semibold">Consistency:</h4>
                          <p className="text-muted-foreground mt-1">
                            Focused on long-term stable and sustainable financial growth.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckCheck className="text-primary size-8 min-w-8" />
                        <div>
                          <h4 className="text-xl font-semibold">Trust:</h4>
                          <p className="text-muted-foreground mt-1">
                            Built on proven expertise, risk management, and reliable performance.
                          </p>
                        </div>
                  </div>
                </div>
              </div>
            </FadeBlock>
          </div>
          <FadeBlock delay={0.2} className="w-full max-w-10/12 mx-auto lg:mr-0 min-w-1/3">
          <Image
              className="w-full"
              src="/new/image-3.svg"
              alt="Mission and Vision"
              width={1000}
              height={760}
              priority
            />
            </FadeBlock>
        </div>
      </div>
    </section>
    
    {/* <section className="py-8 xl:py-12">
      <div className="container">
        <div className="section_header">
          <h2 className="section_heading">What is IBC?</h2>
        </div>
        <div className="section_inner">
          <div className="flex flex-wrap bg-card border border-border rounded-xl lg:rounded-2xl xl:rounded-3xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="card p-8 xl:p-12 border border-border m-[-1px] flex-2/3 flex flex-col justify-center text-center lg:text-left">
                <h3 className="text-2xl xl:text-3xl text-primary font-bold">
                  Where Intelligent Investing Begins!
                </h3>
                <p className="font-semibold text-base lg:text-lg xl:text-xl mt-6">
                  IBC is a digital-first investment platform designed for
                  individuals who want reliable, long-term returns without the
                  daily stress of market analysis.
                </p>
                <p className="font-semibold text-base lg:text-lg xl:text-xl mt-4">
                  We simplify the complex world of trading by letting our expert
                  systems and professional traders do the work for you, while
                  you track your earnings in real-time.
                </p>
              </div>
              <div className="flex-1 flex flex-col md:flex-row lg:flex-col lg:flex-1/3 lg:whitespace-nowrap">
                <div className="card p-8 xl:p-12 border border-border m-[-1px] text-center flex flex-1 flex-col md:flex-row gap-8 items-center justify-center">
                  <Image
                    className="w-24 min-w-24 xl:w-32 xl:min-w-32"
                    src="/users.png"
                    alt="Registered User"
                    width={450}
                    height={450}
                    priority
                  />
                  <h3 className="text-xl lg:text-2xl xl:text-3xl">
                    <strong className="font-semibold">
                      15,000 <span className="text-primary">+</span>
                    </strong>
                    <br />
                    Registered User
                  </h3>
                </div>
                <div className="card p-8 xl:p-12 border border-border m-[-1px] text-center flex flex-1 flex-col md:flex-row gap-8 items-center justify-center">
                  <Image
                    className="w-24 min-w-24 xl:w-32 xl:min-w-32"
                    src="/briefcase.png"
                    alt="Total Investment"
                    width={450}
                    height={450}
                    priority
                  />
                  <h3 className="text-xl lg:text-2xl xl:text-3xl">
                    <strong className="font-semibold">
                      18 Million <span className="text-primary">+</span>
                    </strong>
                    <br />
                    Total Investment
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row flex-1">
              <div className="flex-1 card p-12 border border-border m-[-1px] text-center md:text-left flex flex-col md:flex-row lg:flex-1/2 gap-8 items-center">
                <Image
                  className="w-24 min-w-24 xl:w-32 xl:min-w-32"
                  src="/vision.png"
                  alt="Our Vision"
                  width={450}
                  height={450}
                  priority
                />
                <div>
                  <h3 className="text-2xl xl:text-3xl text-primary font-bold">
                    Our Vision
                  </h3>
                  <p className="font-semibold text-base lg:text-lg xl:text-xl mt-2">
                    To empower your financial growth through smart, secure, and
                    automated investing.
                  </p>
                </div>
              </div>
              <div className="flex-1 card p-12 border border-border m-[-1px] text-center md:text-left flex flex-col md:flex-row lg:flex-1/2 gap-8 items-center">
                <Image
                  className="w-24 min-w-24 xl:w-32 xl:min-w-32"
                  src="/mission.png"
                  alt="Our Mission"
                  width={450}
                  height={450}
                  priority
                />
                <div>
                  <h3 className="text-2xl xl:text-3xl text-primary font-bold">
                    Our Mission
                  </h3>
                  <p className="font-semibold text-base lg:text-lg xl:text-xl mt-2">
                    To lead the future of investing with AI-driven, user-focused
                    solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> */}
    </>
  );
}
