import { Link } from 'react-router-dom';
import { LogoLockup } from '../ui/Logo.jsx';
import { Mail, MapPin } from 'lucide-react';

const Instagram = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Linkedin = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-display font-bold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="hover:text-foreground transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t px-6 py-12 md:px-12 md:py-16">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" className="flex items-center" aria-label="TekSchool home">
            <LogoLockup className="h-9" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            A modern school for builders, designers, and curious minds. Live cohorts, real mentors, work that ships.
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@tek.school</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> BEML Layout 3rd Stage, RR Nagar, Bengaluru</p>
          </div>
          <div className="mt-5 flex gap-2">
            {[
              [Instagram, 'https://www.instagram.com/tek.school/'],
              [Linkedin, 'https://in.linkedin.com/company/tekschool-global'],
            ].map(([Icon, href], i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label="social"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
          <FooterCol title="Programs" links={[
            ['AI Engineering', '/programs/ai-engineering'],
            ['Cloud Engineering', '/programs/cloud-engineering'],
            ['Software Engineering', '/programs/software-engineering'],
            ['Future Engineering (ages 6–15)', '/programs/future-engineering'],
          ]} />
          <FooterCol title="Explore" links={[
            ['Tek Campus', '/campus'],
            ['Campus at School', '/campus/school'],
            ['Campus at College', '/campus/college'],
            ['Workshops', '/workshops'],
          ]} />
          <FooterCol title="Company" links={[
            ['About', '/about'],
            ['Contact', '/contact'],
          ]} />
        </div>
      </div>

      <div className="mt-12 border-t pt-6 text-sm text-muted-foreground flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} TekSchool. All rights reserved.</span>
        <span className="opacity-80">Anormos Pvt Ltd</span>
      </div>
    </footer>
  );
}
