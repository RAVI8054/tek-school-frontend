import markUrl from "../../assets/tekschool-mark.png";

/**
 * Assistant identity mark — the TekSchool symbol (icon only, no wordmark).
 */
export function AssistantMark({ className = "h-6 w-6" }) {
  return (
    <img
      src={markUrl}
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
    />
  );
}
