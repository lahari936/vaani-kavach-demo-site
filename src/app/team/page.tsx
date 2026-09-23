import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

function GitHubLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.35 9.35 0 0 1 12 7.98c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.34 7.67a2.17 2.17 0 1 0 0-4.34 2.17 2.17 0 0 0 0 4.34ZM3.46 20.67h3.76V9.17H3.46v11.5ZM9.5 9.17h3.6v1.57h.05c.5-.95 1.73-1.95 3.55-1.95 3.8 0 4.5 2.5 4.5 5.76v6.12h-3.75v-5.42c0-1.29-.03-2.96-1.81-2.96-1.81 0-2.09 1.41-2.09 2.86v5.52H9.5V9.17Z" />
    </svg>
  );
}

const teamMembers = [
  {
    name: "Panchagnula Abhinav",
    image: "/team/panchagnula-abhinav.jpeg",
    github: "https://github.com/abhinavpanchagni",
    linkedin: "https://www.linkedin.com/in/panchagnula-abhinav-674538333",
    imagePosition: "center 34%",
  },
  {
    name: "Vadakattu Sai Ram Charan",
    image: "/team/vadakattu-sai-ram-charan.jpeg",
    github: "https://github.com/vadakatturamcharansai-cmd",
    linkedin: "https://www.linkedin.com/in/ram-charan-sai-vadakattu-9a8911385",
    imagePosition: "center 30%",
  },
  {
    name: "Lahari Raaparthi",
    image: "/team/lahari-raaparthi.png",
    github: "https://github.com/lahari936",
    linkedin: "https://www.linkedin.com/in/lahari-raaparthi-605bb9308",
    imagePosition: "center 24%",
  },
  {
    name: "Sushruth Chari Ramneti",
    image: "/team/sushruth-chari-ramneti.jpeg",
    github: "https://github.com/susruthchari",
    linkedin: "https://www.linkedin.com/in/susruth-chari-ramneti-763203380",
    imagePosition: "center 27%",
  },
  {
    name: "Sathwika Pathi",
    image: "/team/sathwika-pathi.jpeg",
    github: "https://github.com/sathwikapathi",
    linkedin: "https://www.linkedin.com/in/sathwika-pathi-37898933b",
    imagePosition: "center 25%",
  },
];

export default function TeamPage() {
  return (
    <div className="page-shell container mx-auto px-5 max-w-6xl min-h-[calc(100vh-4rem)]">
      <header className="text-center space-y-4 max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="eyebrow inline-flex items-center px-3 py-1.5 mb-2 text-xs rounded-full uppercase tracking-widest">
          Vaani Kavach Project Team
        </div>
        <h1 className="page-heading text-4xl md:text-5xl font-semibold text-foreground">Meet the Team</h1>
        <p className="text-lg text-muted-foreground font-normal leading-relaxed">
          The contributors building Vaani Kavach to help protect citizens from voice-enabled fraud.
        </p>
      </header>

      <section aria-labelledby="team-members-heading">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
          <Users className="w-5 h-5 text-foreground/70" aria-hidden="true" />
          <h2 id="team-members-heading" className="text-xl font-medium tracking-tight">Project Contributors</h2>
        </div>

        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <article key={member.name} className="team-card bg-card border border-border rounded-2xl overflow-hidden">
              <div className="team-photo relative aspect-square border-b border-border overflow-hidden">
                <Image
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 50vw, 33vw"
                  className="object-cover"
                  style={{ objectPosition: member.imagePosition }}
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground leading-snug">{member.name}</h3>
                <div className="flex flex-wrap gap-3 mt-5">
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    className="team-social-link"
                  >
                    <GitHubLogo /> GitHub
                  </Link>
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="team-social-link"
                  >
                    <LinkedInLogo /> LinkedIn
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
