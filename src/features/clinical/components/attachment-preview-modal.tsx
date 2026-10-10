import { ImageIcon, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

function AttachmentPreviewModal({
  previewAttachment,
  setPreviewAttachment,
}: {
  previewAttachment: string;
  setPreviewAttachment: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <div className="clinical-modal-backdrop" role="dialog" aria-modal="true">
      <div className="clinical-modal">
        <div className="clinical-modal__header">
          <span className="clinical-modal__icon">
            <ImageIcon aria-hidden="true" />
          </span>
          <div>
            <h2>{previewAttachment}</h2>
            <p>Clinical radiograph viewer (Mock)</p>
          </div>
          <button
            type="button"
            className="icon-button"
            style={{ marginLeft: "auto" }}
            onClick={() => setPreviewAttachment(null)}
            aria-label="Close radiograph preview"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="clinical-modal__body clinical-xray-preview">
          <div className="clinical-xray-placeholder">
            <ImageIcon aria-hidden="true" />
            <strong>Radiograph Preview: {previewAttachment}</strong>
            <span>High-resolution diagnostic digital X-ray image loaded</span>
          </div>
        </div>
        <div className="clinical-modal__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setPreviewAttachment(null)}
          >
            Close viewer
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttachmentPreviewModal;
