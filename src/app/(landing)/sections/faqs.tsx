"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "What is IBC?",
    answer:
      "IBC is a next-generation investment platform that combines human expertise and secure infrastructure to grow your money passively and predictably.",
  },
  {
    question: "How do I get started with IBC?",
    answer:
      "Simply create an account, choose an investment plan that suits you, and start growing your wealth with confidence.",
  },
  {
    question: "Is my investment secure on IBC?",
    answer:
      "Yes, IBC uses secure infrastructure and expert human oversight to ensure your investment is safe and managed responsibly.",
  },
  {
    question: "Can I withdraw my money anytime?",
    answer:
      "Yes, you can withdraw your funds at any time following the terms of your selected investment package.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, IBC maintains transparent fees with no hidden charges. All details are clearly outlined before you invest.",
  },
  {
    question: "What kind of support can I expect?",
    answer:
      "Our support team is available to assist you with any questions or issues, ensuring a smooth investment experience.",
  },
];

// Split FAQ into two columns if more than 3 items
const midpoint = Math.ceil(faqs.length / 2);
const firstColumn = faqs.slice(0, midpoint);
const secondColumn = faqs.slice(midpoint);
const isTwoColumn = faqs.length > 3;

// Accordion Style
const accordionItemStyle =
  "bg-card border border-border rounded-xl lg:rounded-2xl xl:rounded-3xl";
const accordionTriggerStyle =
  "p-4 lg:p-7 xl:p-8 text-base lg:text-lg xl:text-xl font-semibold cursor-pointer [&[data-state=open]]:pb-4";
const accordionContentStyle =
  "text-sm lg:text-base p-4 lg:p-7 xl:p-8 pt-0 lg:pt-0 xl:pt-0";

const accordionIconStyle =
  "min-w-8 lg:min-w-10 xl:min-w-12 size-8 lg:size-10 xl:size-12 stroke-1 stroke-primary";

export default function FaqSection() {
  return (
    <section className="pt-8 pb-18 xl:pt-12 xl:pb-24">
      <div className="container">
        <div className="section_header">
          <h2 className="section_heading">FAQs</h2>

          <p className="section_rte">
            Do you need some help with something or do you have questions on
            some features ?
          </p>
        </div>
        <div className="section_inner">
          {isTwoColumn ? (
            <div className="flex flex-col lg:flex-row gap-5">
              {[firstColumn, secondColumn].map((columnFaqs, colIdx) => (
                <Accordion
                  key={colIdx}
                  type="single"
                  collapsible
                  className="flex-1 space-y-5"
                >
                  {columnFaqs.map((faq, idx) => (
                    <AccordionItem
                      value={`item-${colIdx}-${idx}`}
                      key={idx}
                      className={accordionItemStyle}
                    >
                      <AccordionTrigger
                        className={accordionTriggerStyle}
                        iconType="plus-minus"
                        iconStyle={accordionIconStyle}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className={accordionContentStyle}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-5">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  value={`item-${idx}`}
                  key={idx}
                  className={accordionItemStyle}
                >
                  <AccordionTrigger
                    className={accordionTriggerStyle}
                    iconType="plus-minus"
                    iconStyle={accordionIconStyle}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className={accordionContentStyle}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
}
