export const COURSES_DATA = [
  { slug: "modern-react", title: "Modern React & TypeScript", category: "Web Dev", level: "Intermediate", duration: "10 weeks", weeks: 10, hoursPerWeek: 8, students: 218, color: "coral", blurb: "Ship production-grade React with types, tests, and taste.", price: 1890, priceMonthly: 499, seatsTotal: 30, seatsLeft: 6, nextCohort: "March 3, 2026" },
  { slug: "data-with-python", title: "Data with Python", category: "Data & AI", level: "Beginner", duration: "12 weeks", weeks: 12, hoursPerWeek: 8, students: 141, color: "blue", blurb: "From pandas to production notebooks and dashboards.", price: 2190, priceMonthly: 579, seatsTotal: 30, seatsLeft: 4, nextCohort: "March 17, 2026" },
  { slug: "applied-ml", title: "Applied Machine Learning", category: "Data & AI", level: "Intermediate", duration: "12 weeks", weeks: 12, hoursPerWeek: 10, students: 98, color: "coral", blurb: "Real datasets, real models, deployed to the web.", price: 2490, priceMonthly: 649, seatsTotal: 24, seatsLeft: 3, nextCohort: "April 14, 2026" },
  { slug: "product-craft", title: "Product Craft", category: "Product", level: "Intermediate", duration: "8 weeks", weeks: 8, hoursPerWeek: 6, students: 84, color: "lavender", blurb: "Discovery, prioritization, and the taste to say no.", price: 1590, priceMonthly: 429, seatsTotal: 24, seatsLeft: 15, nextCohort: "April 21, 2026" },
  { slug: "fullstack-node", title: "Full-Stack with Node", category: "Web Dev", level: "Advanced", duration: "14 weeks", weeks: 14, hoursPerWeek: 10, students: 132, color: "navy", blurb: "Backend, databases, auth — the full picture.", price: 2690, priceMonthly: 699, seatsTotal: 24, seatsLeft: 0, nextCohort: "May 12, 2026" },
];

export function findCourse(slug) {
  return COURSES_DATA.find((c) => c.slug === slug);
}

export function courseByTitle(fragment) {
  const f = fragment.toLowerCase();
  return COURSES_DATA.find((c) => c.title.toLowerCase().includes(f) || c.slug.includes(f));
}
