/**
 * Decorative ellipse rings from Figma auth background.
 * Absolute-positioned; parent must be `relative overflow-hidden`.
 */
export function AuthBackgroundDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute opacity-30"
        style={{
          width: "1613px",
          height: "1837px",
          left: "-857px",
          top: "-418px",
          transform: "matrix(-0.97, 0.26, 0.26, 0.97, 0, 0)",
        }}
      >
        <div
          className="absolute rounded-full border border-white opacity-80"
          style={{
            width: "1585px",
            height: "1585px",
            left: "92px",
            top: "244px",
          }}
        />
        <div
          className="absolute rounded-full border border-white opacity-80"
          style={{
            width: "1585px",
            height: "1585px",
            left: "0",
            top: "7px",
          }}
        />
      </div>
    </div>
  );
}
