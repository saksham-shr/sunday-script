export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-surface-container-low rounded-xl p-12 lg:p-24 mb-32 flex flex-col items-center text-center">

      {/* Decorative blur blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed opacity-20 blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container opacity-20 blur-3xl -ml-32 -mb-32"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl space-y-8">
        <span className="font-label text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Weekly Muse
        </span>

        <h2 className="text-4xl lg:text-5xl font-headline italic">
          A Sunday morning invitation.
        </h2>

        <p className="text-on-surface-variant font-body italic">
          Receive our most thoughtful essays and book recommendations directly
          in your inbox every Sunday morning.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow bg-surface-container-lowest border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:font-label placeholder:text-on-surface-variant text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg whitespace-nowrap"
          >
            Join the Circle
          </button>
        </form>
      </div>

    </section>
  );
}
