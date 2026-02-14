interface HeroBackdropProps {
  children: React.ReactNode;
}

export function HeroBackdrop({ children }: HeroBackdropProps) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url(/assets/generated/coin-hero-bg.dim_1600x900.png)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
