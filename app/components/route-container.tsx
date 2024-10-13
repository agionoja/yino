type Props = {
  heading: string;
};

export function RouteContainer({ heading }: Props) {
  return (
    <section>
      <header>
        <h2 className={"text-3xl"}>{heading}</h2>
      </header>
    </section>
  );
}
