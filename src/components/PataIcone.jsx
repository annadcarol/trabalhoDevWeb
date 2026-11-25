// Ícone de patinha usado em vários pontos do visual.
export default function PataIcone({ tamanho = 16, cor = "currentColor", className, style }) {
  return (
    <svg
      aria-hidden="true"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      fill={cor}
      className={className}
      style={style}
    >
      <ellipse cx="32" cy="42" rx="15" ry="12" />
      <ellipse cx="12" cy="26" rx="6" ry="8" transform="rotate(-25 12 26)" />
      <ellipse cx="25" cy="14" rx="6" ry="8.5" transform="rotate(-8 25 14)" />
      <ellipse cx="39" cy="14" rx="6" ry="8.5" transform="rotate(8 39 14)" />
      <ellipse cx="52" cy="26" rx="6" ry="8" transform="rotate(25 52 26)" />
    </svg>
  );
}
