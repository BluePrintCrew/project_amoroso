type PlaceholderPageProps = {
  title: string;
  subtitle?: string;
};

const PlaceholderPage = ({ title, subtitle }: PlaceholderPageProps) => {
  return (
    <section className="placeholder">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </section>
  );
};

export default PlaceholderPage;
