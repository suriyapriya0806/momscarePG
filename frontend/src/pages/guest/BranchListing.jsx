import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { usePublicBookingData, formatCurrency } from "../../data/bookingFlow";

const BranchListing = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location")?.trim().toLowerCase() || "";
  const moveIn = searchParams.get("moveIn");
  const preference = searchParams.get("preference");
  const { branches: exploreBranches } = usePublicBookingData();
  const visibleBranches = location
    ? exploreBranches.filter((branch) => branch.name.toLowerCase().includes(location))
    : exploreBranches;

  return (
  <main className="bg-paper/70">
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-brand">Mom's Care Branches</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">Choose Your PG House</h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Choose between our Anna Nagar and Virugambakkam branches to view rooms and live bed availability.
          </p>
          {(moveIn || preference) && (
            <p className="mt-4 text-sm font-semibold text-brand">
              {moveIn && `Move-in: ${moveIn}`}{moveIn && preference && " · "}{preference && `Preference: ${preference}`}
            </p>
          )}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-6 md:grid-cols-2">
        {visibleBranches.map((branch) => (
          <Link key={branch.id} to={`/branches/${branch.id}/rooms`} className="group block">
            <Card className="h-full overflow-hidden p-0">
              <div className="relative h-72 overflow-hidden">
                <img src={branch.image} alt={branch.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-brand shadow-soft">
                  <Star className="h-4 w-4 fill-brand" /> {branch.rating}
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-ink">{branch.name}</h2>
                    <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-secondary">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span>{branch.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">Starting Price</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{formatCurrency(branch.startingPrice)}</p>
                    <p className="text-sm text-muted">/ month</p>
                  </div>
                </div>
                <div className="mt-6 overflow-hidden rounded-[18px] border border-line bg-paper">
                  <iframe
                    src={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}&z=14&output=embed`}
                    title={`${branch.name} location map`}
                    className="h-44 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="mt-5 border-t border-line pt-5">
                  <Button className="w-full">
                    View Branch Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {!visibleBranches.length && (
        <Card className="mx-auto mt-6 max-w-2xl text-center hover:translate-y-0">
          <p className="text-xl font-semibold text-ink">No matching branch found</p>
          <p className="mt-2 text-secondary">Please search for Anna Nagar or Virugambakkam.</p>
          <Link to="/branches" className="mt-5 inline-block"><Button variant="secondary">View all branches</Button></Link>
        </Card>
      )}
    </section>
  </main>
  );
};

export default BranchListing;
