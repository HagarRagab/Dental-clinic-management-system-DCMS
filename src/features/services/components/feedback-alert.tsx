import { Dispatch, SetStateAction } from "react";
import { CheckCircle2, X } from "lucide-react";

function FeedbackAlert({
    feedback,
    setFeedback,
}: {
    feedback: string;
    setFeedback: Dispatch<SetStateAction<string>>;
}) {
    return (
        <p className="services-feedback" role="status">
            <CheckCircle2 aria-hidden="true" />
            <span>{feedback}</span>
            <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setFeedback("")}
            >
                <X aria-hidden="true" />
            </button>
        </p>
    );
}

export default FeedbackAlert;
