export default function UnderlinedHeader(props) {
  const {
    title,
  } = props;

  return (
    <div>
      <p className="one-third-underline text-medium uppercase font-bold">{title}</p>
    </div>
  );
}
