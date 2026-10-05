export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** DRAFT — answer contains [bracketed] facts the business must confirm. */
  draft?: boolean;
  /** Shown in the short homepage FAQ section. */
  featured?: boolean;
};

export type FaqGroup = { title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "Getting started",
    items: [
      {
        id: "estimate-free",
        featured: true,
        question: "How does the free project estimate work — is it really free?",
        answer:
          "Yes. Answer a few quick questions about your project online, add photos if you have them, and choose a time for a free consultation. We visit, look at the space, talk through what you want, and then send you a clear written estimate. There's no cost and no obligation.",
      },
      {
        id: "visit-soon",
        featured: true,
        draft: true,
        question: "How soon can you visit my home?",
        answer:
          "Usually within [2–3 working days] of your request. You can pick a consultation time yourself straight after submitting the estimate questionnaire.",
      },
      {
        id: "service-area",
        featured: true,
        question: "Which areas do you cover?",
        answer:
          "We work across Malé and Hulhumalé. If your property is on another island, tell us in the questionnaire and we'll let you know what we can do.",
      },
      {
        id: "prepare",
        question: "What should I prepare before the consultation?",
        answer:
          "Photos of the space, any floor plans or measurements you have, and a few pictures of styles you like. A rough budget and your ideal start date also help us give you an accurate estimate. You can upload all of this in the questionnaire.",
      },
    ],
  },
  {
    title: "Cost & payment",
    items: [
      {
        id: "pricing",
        featured: true,
        draft: true,
        question: "How do you price a project?",
        answer:
          "After the consultation we give you a written, itemised estimate covering labour and materials, so you know exactly what you're paying for. [Most projects are quoted at a fixed price; small repairs may be charged by the hour.]",
      },
      {
        id: "deposit",
        draft: true,
        question: "Do I need to pay a deposit?",
        answer:
          "[We ask for a deposit of X% to book your project and order materials, with the balance paid in stages as the work progresses.] The payment schedule is agreed in writing before any work starts.",
      },
      {
        id: "cost-changes",
        question: "What happens if the cost changes during the project?",
        answer:
          "We're open about cost from the start. If something unexpected comes up, or you decide to change the plan, we explain the options and the price before doing any extra work — nothing is added without your approval.",
      },
      {
        id: "payment-methods",
        draft: true,
        question: "Which payment methods do you accept?",
        answer: "[Bank transfer (BML / MIB), cash and card.] Payment details are included with every invoice.",
      },
    ],
  },
  {
    title: "Timeline & process",
    items: [
      {
        id: "duration",
        featured: true,
        draft: true,
        question: "How long does a renovation take?",
        answer:
          "It depends on the size of the job. As a guide: [a bathroom takes about 2–3 weeks, a kitchen about 3–5 weeks, and a full apartment 6–12 weeks]. You'll get a timeline with your estimate, and we keep you updated if anything changes.",
      },
      {
        id: "stay-home",
        question: "Can I stay in my home during the work?",
        answer:
          "Often, yes. For most kitchen, bathroom and repair work you can stay at home — we plan the work to keep essential rooms usable for as long as possible. For full renovations we'll talk through whether moving out for a short time would be easier.",
      },
      {
        id: "updates",
        question: "How will I be kept updated?",
        answer:
          "You'll have one point of contact for the whole project, and regular progress updates with photos. We tell you early if anything affects cost or timing.",
      },
      {
        id: "contact-person",
        question: "Who manages my project?",
        answer:
          "A dedicated project manager coordinates the trades, materials and schedule from start to finish, and is your main contact throughout.",
      },
    ],
  },
  {
    title: "Permits & building rules",
    items: [
      {
        id: "permits",
        draft: true,
        question: "Do you handle permits and approvals?",
        answer:
          "[Yes. Where a project needs approval — for example from Malé City Council or HDC in Hulhumalé — we prepare and submit the paperwork for you.] We'll tell you during the consultation whether your project needs a permit.",
      },
      {
        id: "apartments",
        question: "Can you work in apartment buildings with building-management rules?",
        answer:
          "Yes. We regularly work in apartment buildings and follow their rules on working hours, noise, lift use and waste removal. If your building needs notice or paperwork in advance, we'll help arrange it.",
      },
    ],
  },
  {
    title: "Materials & quality",
    items: [
      {
        id: "materials",
        question: "Do you supply the materials, or can I buy my own?",
        answer:
          "Either works. We can source everything through our trusted suppliers, or fit materials you've chosen yourself — we'll just check they're suitable before work starts.",
      },
      {
        id: "climate",
        question: "Do you use materials suited to the Maldives climate?",
        answer:
          "Yes. Humidity, salt air and heavy rain are hard on buildings, so we choose finishes, waterproofing and fittings that are made to last in island conditions.",
      },
      {
        id: "warranty",
        featured: true,
        draft: true,
        question: "Do you guarantee your work?",
        answer:
          "Yes. [All our workmanship is guaranteed for X months/years], and manufacturers' warranties apply to the materials and appliances we install. If something isn't right, we come back and fix it.",
      },
    ],
  },
  {
    title: "Working with us",
    items: [
      {
        id: "licensed",
        draft: true,
        question: "Are you licensed and insured?",
        answer: "[Yes — The Experts is a registered business in the Maldives (registration no. XXXX) and fully insured.]",
      },
      {
        id: "clean-site",
        question: "How do you protect my home and keep the site clean?",
        answer:
          "We cover floors and furniture, contain dust where we can, and tidy the site at the end of every day. When the job is finished, we clean up and remove all our waste.",
      },
      {
        id: "small-jobs",
        question: "Do you take on small repairs, or only big renovations?",
        answer:
          "Both. From fixing a leak or a broken fitting to renovating a whole home, we give every job the same care and attention to detail.",
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);
