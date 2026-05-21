export default function LiveBackground({ variant = "dark" }) {
  return (
    <div className={`live-bg live-bg-${variant}`} aria-hidden="true">
      <span className="live-orbit live-orbit-one" />
      <span className="live-orbit live-orbit-two" />
      <span className="live-orbit live-orbit-three" />
      <span className="live-grid" />
      <span className="live-noise" />
    </div>
  );
}
