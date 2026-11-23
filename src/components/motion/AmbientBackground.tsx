/**
 * Fixed, decorative backdrop: slow drifting accent glows over a faint grid.
 * Pure CSS (transform-only animation) so it costs no JavaScript and never shifts layout.
 */
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden>
      <div className="ambient-blob ambient-blob-a" />
      <div className="ambient-blob ambient-blob-b" />
      <div className="ambient-blob ambient-blob-c" />
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" />
    </div>
  );
}
