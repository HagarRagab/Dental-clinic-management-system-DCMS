import { Dispatch, SetStateAction } from "react";
import { FileText, ImageIcon } from "lucide-react";
import { ClinicalVisitRecord } from "../clinical.types";

function ClinicalAttachments({
  visit,
  setPreviewAttachment,
}: {
  visit: ClinicalVisitRecord;
  setPreviewAttachment: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <section className="clinical-card">
      <div className="clinical-card__header">
        <div>
          <h2>Radiographs &amp; Attachments</h2>
          <p>{visit.attachments.length} files attached</p>
        </div>
      </div>

      <div className="clinical-attachment-list">
        {visit.attachments.map((att) => (
          <div key={att.id} className="clinical-attachment-card">
            <div className="clinical-att-icon">
              {att.category === "X-Ray" ? (
                <ImageIcon aria-hidden="true" />
              ) : (
                <FileText aria-hidden="true" />
              )}
            </div>
            <div className="clinical-att-details">
              <strong>{att.title}</strong>
              <small>
                {att.category} · {att.size} · {att.date}
              </small>
            </div>
            <button
              type="button"
              className="button button--secondary button--compact"
              onClick={() => setPreviewAttachment(att.title)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ClinicalAttachments;
