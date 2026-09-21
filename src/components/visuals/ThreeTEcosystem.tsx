const satellites = [
  {
    id: "a",
    label: "Training & Coaching",
    duration: "20s",
    delay: "0s",
    reverse: false,
  },
  {
    id: "b",
    label: "Transformation",
    duration: "26s",
    delay: "-9s",
    reverse: true,
  },
  {
    id: "c",
    label: "Trustworking",
    duration: "23s",
    delay: "-15s",
    reverse: false,
  },
] as const;

export function ThreeTEcosystem() {
  return (
    <figure
      className="vabix-3t-visual"
      role="img"
      aria-label="Mô hình hệ sinh thái 3T với ba vệ tinh Training and Coaching, Transformation và Trustworking quay quanh lõi 3T"
    >
      <div className="vabix-3t-stage" aria-hidden="true">
        <span className="vabix-3t-aura" />

        <div className="vabix-3t-scene">
          <div className="vabix-3t-system">
            <span className="vabix-3t-orbit vabix-3t-orbit-a" />
            <span className="vabix-3t-orbit vabix-3t-orbit-b" />
            <span className="vabix-3t-orbit vabix-3t-orbit-c" />
          </div>

          {satellites.map((satellite) => (
            <div
              key={satellite.id}
              className={`vabix-3t-track vabix-3t-track-${satellite.id}`}
            >
              <div
                className="vabix-3t-spin"
                style={{
                  animationDuration: satellite.duration,
                  animationDelay: satellite.delay,
                  animationDirection: satellite.reverse ? "reverse" : "normal",
                }}
              >
                <div className="vabix-3t-sat">
                  <div className="vabix-3t-sat-face">
                    <i className="vabix-3t-sat-body" />
                    <b className="vabix-3t-sat-label">{satellite.label}</b>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="vabix-3t-core">
            <span>3T</span>
            <small>VABIX</small>
          </div>
        </div>
      </div>
    </figure>
  );
}
