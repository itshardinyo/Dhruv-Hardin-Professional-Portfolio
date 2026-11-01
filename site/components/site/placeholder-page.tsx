/** Placeholder for Artsy, Projects and About me until their prompts arrive. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="placeholder">
      <h1 className="display-rough">{title}</h1>
      <p className="coming">Coming up next.</p>
    </section>
  );
}
